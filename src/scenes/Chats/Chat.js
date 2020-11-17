import React, {Component} from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Permissions from 'react-native-permissions'
import { connect } from 'react-redux';
import uuidv1 from 'uuid/v1';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import Dialogue from '../../services/dialogue'
import Scene from '../../components/Scene'
import {MessageView} from '../../components/Chat/ChatDialog'
import {Input, Options, ChooseAvatar} from '../../components/Chat/Options';
import AnimatedEllipsis from '../../components/DotAnimation';
import ZoomImageDialog from "../../components/Dialogs/ZoomImageDialog";
import {getLocalization, calculateMessageDelay, getPermission} from '../../config/helpers';
import { updateUser } from '../../actions/user';
import { updateChat, getChats } from '../../actions/chats';
import { WriteBase64Image, setObject } from '../../actions/museums';
import { sync } from '../../actions/synchronize';
import Tips from '../../components/Tips';
import strings from '../../config/localization';
import { getStorageItem } from "../../config/helpers";

const isMessageIncoming = (message)=> message.isIncoming === 1 || message.isIncoming === undefined

const DIALOGUE_IDS_FOR_SPECIAL_ACTIONS = { EXIT: '10001', CAM: '10002', MAP: '10003', IMAGE: '10004', COLLECTION: '10005', IMAGETAKEN: '10007' };
class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgArray: [],
      options:[],
      messageInput:'',
      isInputShow:false,
      isChooseAvatarShow:false,
      isIndicatorShow:false,
      isZoomImageDialogShow:false,
      zoomImage:'',
      isModalShow: false,
      chat:{},
      speed: '',
    };
    this.minimumMessageDelay = 2500;
    this.messageDelay = 0;
  }

  async componentWillMount(){
    const {img, object, chatID, from, user, setObject, getChats} = this.props;
    const chats = getChats();
    const chat = chats.find(item => item.sync_id === chatID);
    this.setState({chat});

    const speed = await AsyncStorage.getItem('speed');
    if (speed) this.setState({speed: parseInt(speed)});
    
    if(chat.history.length !== 0 && !object.onboarding ) await this.setState({msgArray: img ? [...JSON.parse(chat.history), {type:'Image', isIncoming:2, uri:img}] : JSON.parse(chat.history)});

    if(img) this.imgPath = img; 
    if(chat.finished || !object) return true;
    if(!object.onboarding) setObject(object);

    Dialogue.parse(object.sync_id, getLocalization(object.localizations, user.language, 'conversation')); 
    if (object.from && DIALOGUE_IDS_FOR_SPECIAL_ACTIONS[from] != null) return this.nextMessage(DIALOGUE_IDS_FOR_SPECIAL_ACTIONS[from], object.sync_id, true);
    return this.nextMessage(!object.onboarding ? chat.last_step || null : 1, object.sync_id);
  }

  // componentWillUnmount(){
  //   Dialogue.dialogue_states = {};
  //   Dialogue.dialogues = {};
  // }

// eslint-disable-next-line react/destructuring-assignment
  async nextMessage(messageID, id = this.props.object.sync_id, isNext = false) {
    await this.setState({isIndicatorShow:true})
    const { chat, speed } = this.state;
    const {msgArray, messageInput} = this.state; 
    const nextStep = Dialogue.interact(id, 'player', messageID, isNext); 
    
    await this.updateChat({...chat,
      history: JSON.stringify(msgArray),
      last_step: Dialogue.__getState(chat.object_id, 'player')
    });

    if(msgArray.length && msgArray[msgArray.length - 1]["type"] === "Image") {
      const value = await getStorageItem('firstChatImage')
      this.setState({
        isModalShow: typeof value !== 'string',
      });
    }
    
    if (nextStep == null) return;
    if (this.isSpecialAction(nextStep.text)) return this.setState({isIndicatorShow:false}); 
    if (nextStep.text) nextStep.text = nextStep.text.replace('{name}', messageInput);
    
    const isOption = nextStep.responses.length > 0;

    setTimeout(() => {
      this.messageDelay = calculateMessageDelay(nextStep.text, this.minimumMessageDelay);
        if (isOption) {
            this.setState({ msgArray: [...msgArray, nextStep], options: nextStep.responses, isIndicatorShow:false});
        } else {
            this.setState({ msgArray: [...msgArray, nextStep], isIndicatorShow:false }, () => this.nextMessage());
        }        
     }, speed || this.messageDelay);
  }

  async updateChat(chat){
    const { updateChat } = this.props;
    await updateChat(chat).then( async item => await this.setState({chat:item}))
  }

  async handleAvatar(response){
    const { user } = this.props;
    const { chat } = this.state;
    if(response.error || response.didCancel) return this.nextMessage(chat.last_step);
    const avatar = await WriteBase64Image(response.data, user.sync_id);    
    this.imgPath = avatar;
    this.addMessage({type:'Image', isIncoming:2, uri: avatar})
  }

handleDiscoverFunc(){
  const { plan, object } = this.props;
  const { chat } = this.state;
  if(plan === 1) return Actions.PlanScene({newPlan:true});
  Actions.DiscoverScreen({object, chatID:chat.sync_id});
}

handleCameraFunc(){
  const { object } = this.props;
  const { chat } = this.state;
  Actions.CameraScene({object, chatID:chat.sync_id})
}

  handleSpecialAction(action) {
    const {object} = this.props;
    const {chat} = this.state;
    const imgString = action.split('Image');
    let number = '0'; if(imgString[1]) number = imgString[1];
    // eslint-disable-next-line 
    const image = object.images.find(item => item.number == number) || {image:''};
    switch (action) {
      case 'AppStart': return this.handleAppStart();
      case 'Exit': return this.handleExitDialog();
      case 'Cam': return  Permissions.request(getPermission('camera')).then(per => {if(per === 'denied') return this.nextMessage(chat.last_step);  this.handleCameraFunc();});
      case 'Map': return this.handleDiscoverFunc();
      case 'Input': return this.setState({isInputShow:true});
      case 'TakePhoto': return Permissions.request(getPermission('camera')).then(per => {if(per === 'denied') return this.nextMessage(chat.last_step); ImagePicker.launchCamera({quality:0.3}, response => this.handleAvatar(response, object.sync_id))});
      case 'Avatar': return this.setState({isChooseAvatarShow:true});
      case 'Galery': return Permissions.request(getPermission('photo')).then(per => {if(per === 'denied') return this.nextMessage(chat.last_step); ImagePicker.launchImageLibrary({quality:0.3}, response => this.handleAvatar(response, object.sync_id))});
      case 'Image': return setTimeout(() => this.addMessage({type:'Image', uri:image.image}), 150);
      case `Image${number}`: return setTimeout(() => this.addMessage({type:'Image', uri:image.image}), 150);
      case 'ImageTaken': return this.addMessage({type:'Image', uri: this.imgPath});
      case 'Collection': return setTimeout(() => this.handleFinishDialog(object), 150);
    }
  }

  async handleExitDialog(){
    const { setObject } = this.props;
    const { msgArray, chat } = this.state;
    setObject({})
    await this.updateChat({...chat, history: JSON.stringify(msgArray), finished: true});
    return Actions.TinderScene();
  }

  async handleFinishDialog(object){
    const { updateUser, getChats, user, setObject } = this.props;
    const { msgArray, chat } = this.state;
    setObject({})
    await this.updateChat({...chat, history: JSON.stringify(msgArray), finished: true});
    const chats = getChats();
    if(object.positionX && object.positionY && object.floor) await updateUser({ ...user, positionX:parseFloat(object.positionX), positionY:parseFloat(object.positionY), floor:object.floor, chats });
    return Actions.CollectionScene({ object, image: this.imgPath });
  }
  
  isSpecialAction(text) {
    if (text.indexOf('||') === 0) {
      this.handleSpecialAction(text.substr(2));
      return true;
    }
    return false;
  }

  async addMessage(msg) {
    const {msgArray, chat} = this.state;
    await this.updateChat({...chat, history:  JSON.stringify([...msgArray, msg])})
    this.setState({ msgArray: [...msgArray, msg], options: []}, () => this.nextMessage()); 
  }
  
  optionSelected(num) {
    const {options, msgArray} = this.state;
    this.setState({ msgArray: [...msgArray, {...options[num], isIncoming:2}], options: []}, () => this.nextMessage(options[num].next));      
  }

  handleSendMessageButtonPress(){
    const {messageInput, msgArray} = this.state;
    this.setState({ msgArray: [...msgArray, {text:messageInput, isIncoming:2}], isInputShow:false}, () => this.nextMessage());
  }

  handleChooseAvatarPress(uri){
    this.setState({isChooseAvatarShow:false});
    this.imgPath = uri;
    this.addMessage({type:'Image', isIncoming:2, uri})
  }

  async handleAppStart(){
    const { updateUser, user, settings, plan, museums, sync } = this.props;
    const { messageInput, msgArray, chat } = this.state;
    const language_style = [];
    const styles = Array.from(settings.language_styles)
    if(styles) styles.forEach(style => language_style.push({style, score:0, sync_id:uuidv1()}));
    await this.updateChat({...chat, history: JSON.stringify(msgArray), finished: true});
    await updateUser({ ...user, name:messageInput, avatar:this.imgPath, language_style });
    AsyncStorage.setItem('firstEntry', 'true');
    sync({ museum:museums, user, settings})
    if(plan === 2) return Actions.Tours({first:true});
    Actions.TinderScene({first:true});   
  }


  render(){
    const {msgArray, options, isInputShow, isChooseAvatarShow, messageInput, isIndicatorShow, isZoomImageDialogShow, zoomImage, isModalShow } = this.state;
    const {object, user, settings} = this.props;
    let backBtnFunc = null;
    if(object.from) switch (object.from) {      
      case 'TinderScene': backBtnFunc = () => Actions.TinderScene(); 
      break;        
      case 'ChatsListScene':  backBtnFunc = () => Actions.ChatsListScene();
      break;
    }
      return(
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios'&&'padding'}>
          <Scene label={getLocalization(object.localizations, user.language, 'title')} description={getLocalization(object.localizations, user.language, 'object_kind')} backBtnFunc={backBtnFunc} headerStyle={{paddingVertical: 10}}> 
            <ScrollView 
              style={{flex:1}}
              contentContainerStyle={{paddingVertical: 20}}
              ref={(ref) => this.scrollView = ref}
              onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
            >
              {msgArray.map((message, i)=>(
                <MessageView
                // eslint-disable-next-line react/no-array-index-key
                  key={i} message={message} avatar={object.cropped_avatar || object.avatar}
                  last={i === msgArray.length - 1}
                  isIncoming={!isMessageIncoming(message)}
                  isZoomImageDialogShow={isZoomImageDialogShow}
                  onPress={(zoomImage) => this.setState({isZoomImageDialogShow:!isZoomImageDialogShow, zoomImage})}
                />
            ))} 
              {isIndicatorShow && (<AnimatedEllipsis numberOfDots={3} minOpacity={0.4} animationDelay={200} />)}
            </ScrollView>
            {(options && options.length > 0) && <Options options={options} optionSelected={(key)=>this.optionSelected(key)} />}
            {isInputShow && <Input messageInput={messageInput} onStateChanged={(messageInput)=>this.setState({messageInput})} handleSendMessageButtonPress={()=>this.handleSendMessageButtonPress()} />}
            {isChooseAvatarShow && <ChooseAvatar settings={settings} handleChooseAvatarPress={(avatar)=>this.handleChooseAvatarPress(avatar)} />}   
            {isModalShow && <Tips title={strings.youCanPinch} visible={isModalShow} onRequestClose={() => this.setState({isModalShow: false})} screen='chat'/>}
            <ZoomImageDialog visible={isZoomImageDialogShow} onRequestClose={() => this.setState({isZoomImageDialogShow:!isZoomImageDialogShow})} image={zoomImage} />
          </Scene>
        </KeyboardAvoidingView>
      )}
}

Chats.propTypes = {
  object: PropTypes.object.isRequired,
  chatID: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  museums: PropTypes.object.isRequired,
  updateChat: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  getChats: PropTypes.func.isRequired,
  setObject: PropTypes.func.isRequired,
  sync: PropTypes.func.isRequired,
  img: PropTypes.string,
  from: PropTypes.string,
  plan: PropTypes.number.isRequired,

};

Chats.defaultProps = {
  img: null,
  from:null
};

export default connect(({user, plan, museums}) => ({ user:user.user, settings:user.settings, plan:plan.plan, museums:museums.museums }) , { updateChat, updateUser, getChats, setObject, sync })(Chats);
