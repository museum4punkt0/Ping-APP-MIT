import React, { Component } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Image, Text as Icon, Linking, Animated } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuidv1 from 'uuid/v1';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker-select';
import { Actions } from 'react-native-router-flux';
import FIcon from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import Scene from "../../components/Scene";
import Text from "../../components/Text";
import styles, { colors } from '../../config/styles';
import strings from '../../config/localization';
import {getImage, getLocalization} from '../../config/helpers';
import constant from '../../config/constants';
import Button from '../../components/Button'
import ChooseAvatarDialog from '../../components/Dialogs/ChooseAvatarDialog'
import Option from '../../components/Profile/OptionContainer'
import {getUser, updateUser, resetUser, setPlanMode} from '../../actions/user'
import {synchroniseRemote} from '../../actions/synchronize'
import { WriteBase64Image, getRemoteData, setUser } from '../../actions/museums';
import gold from '../../assets/images/frame/gold.png'
import silver from '../../assets/images/frame/silver.png'
import bronze from '../../assets/images/frame/bronze.png'
import Toaster, {ToasterTypes} from "../../components/Popup";

const options = {
  title: 'Profile Picture',
  customButtons: [{ name: 'avatar', title: 'Choose Avatar' }],
  quality: 0.3,
  storageOptions: {
    skipBackup: true,
  },
};
class ProfileInfoScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      input:'',
      language:'en',
      font_size:'normal',
      avatar:'http:///www.lol.kek.cheburek',
      isChooseAvatarModalOpen:false,
      chosenIndex:99,
      user:{},
      speed: null
    }
    this.spinValue = new Animated.Value(0)
  }

  async componentWillMount(){
    const {getUser, updateUser} = this.props;
    const user = getUser();
    this.setState({speed: await AsyncStorage.getItem('speed') || ''});

    if(!user.font_size) await updateUser({...user, font_size: 'normal'})

    if(user.levelup) this.showAnimation()
    this.setState({avatar: user.avatar || 'http:///www.lol.kek.cheburek', input:user.name, language:user.language, font_size:user.font_size, user:{...user}})
  }

  showAnimation(){
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {  toValue: 1, duration: 4000 }
    ).start();
  }

  componentWillUnmount(){
    const { updateUser, getUser } = this.props;
    const { avatar, user, language, font_size, speed } = this.state;
    AsyncStorage.setItem('speed', speed);
    const dbUser = getUser();
    if(dbUser.sync_id !== user.sync_id) return;
    const { input } = this.state;
    updateUser({ ...user, name:input, avatar, language, font_size, levelup:false });
  }

  onUserChanged(key, value){
    const { updateUser, getUser } = this.props;
    const { user } = this.state; 
    const dbUser = getUser();
    if(dbUser.sync_id !== user.sync_id || !value) return;
    this.setState({[key]: value})
    if(key === 'language') strings.setLanguage(value); 
    updateUser({ ...user, [key]: value})
  }

  handleChangeAvatarButtonPress(){
    ImagePicker.showImagePicker(options, async response => {
      if(response.customButton) return this.setState({isChooseAvatarModalOpen: true});
      const avatar = await WriteBase64Image(response.data, uuidv1());
      if(!response.error && !response.didCancel) this.setState({avatar})
    });
  }

  async handleResetUserButtonPress(){
    const { resetUser, setUser } = this.props;
    const { user } = this.state;
    this.setState({loading:true});
    const updateUser = {...user}
    delete updateUser.votings; delete updateUser.collections; delete updateUser.chats;    
    updateUser.language_style = Array.from(updateUser.language_style);
    const museum_id = await AsyncStorage.getItem('museum');
    const json = { "add": {}, "update": { user:{...updateUser, device_id:`DELETE_${user.sync_id}`}}, "delete": {}, "get": {} }
    const data = new FormData();
    data.append('data',JSON.stringify(json));
    synchroniseRemote(data, museum_id)
    .then(() => resetUser()
      .then(() => getRemoteData(museum_id)
        .then(response => setUser(response.users)
          .then(async () => {
            await AsyncStorage.multiRemove([
              'firstEntry','museum', 'firstLike', 'firstDislike', 'firstDiscovery', 'firstDiscoverySwipe', 'firstMatch', 'firstVip', 'firstChatImage',
              'firstCollection', 'firstCollection_2', 'firstCollection_3', 'firstCollection_4', 'firstCollection_5', 'firstCollection_6'
            ]);
            Actions.PreloaderScene()
          }))))
    .finally(() => this.setState({loading:false}));
  }

  handleClick = (url) => {
    if(!url) return
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
    })
  }
  
  handleQuitTourButton(){
    const {setPlanMode} = this.props;
    setPlanMode(3)
    Actions.DetectLocation()
  }
  
  async handleChatIntervalChange(speed){
    this.setState({speed});
    await AsyncStorage.setItem('speed', speed);
  }

  render() {
    const {input, language, font_size, avatar, isChooseAvatarModalOpen, chosenIndex, loading, speed, user} = this.state;
    const {settings, museums, plan} = this.props;
    const planString = () => {
        switch(plan){   
            case 1: return "Quit Plan Mode";
            case 2: return "Quit Tour";
            case 3: return "Quit Discovery";
            case 4: return "Quit Planned Tour";
            default: return "Quit";      
        }
    };
    const spin = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    return (
      <Scene label={strings.info} isFooterShow index={5} loading={loading}>
        <ChooseAvatarDialog
          visible={isChooseAvatarModalOpen} 
          onRequestClose={()=>this.setState({isChooseAvatarModalOpen:false})}
          onRequestApply={(avatar, chosenIndex) => this.setState({ chosenIndex, avatar })}
          chosenIndex={chosenIndex}
          settings={settings}
        />
        <ScrollView style={{flex:1}}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <Text style={styles.profile.profileTitle}>{strings.accountInfo}</Text>
            <Text style={styles.profile.versionTitle}>{`V ${DeviceInfo.getVersion()}`}</Text>
          </View>
          <View style={styles.profile.settingContainer}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <AvatarView spin={spin} level={user.level} avatar={avatar} handleChangeAvatarButtonPress={()=>this.handleChangeAvatarButtonPress()} />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.profile.levelTitle}>{`Level ${user.level}`}</Text>
                <TouchableOpacity onPress={()=>Toaster.showMessage(strings.levelInformation, ToasterTypes.MESSAGE)}>
                  <FIcon color={colors.white} name="question-circle" size={20} style={{paddingTop:15, marginLeft: 10}} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.profile.optionsContainer}>  
              <Option title={strings.nameLabel} style={{marginBottom:5}}>
                <TextInput
                  value={input}
                  onChangeText={(input)=>this.setState({input})}
                  style={styles.profile.nameTextInput}
                  placeholderTextColor={colors.white}
                  placeholder={strings.typeYourName}
                />
              </Option>            

              <Option title={strings.languageLabel} style={{marginTop:5}}>
                <Picker
                  items={constant.lang}
                  onValueChange={(value) => this.onUserChanged('language', value)}
                  value={language}
                  style={{ iconContainer:{ top: 5 }, inputIOS:{ paddingVertical:10, color:colors.white }, inputAndroid:{ color:colors.white} }}
                  Icon={() => (<Icon style={{fontFamily:'meinobjekt', fontSize:24, color:colors.white}}>c</Icon>)}
                  useNativeAndroidPickerStyle={false}
                />
              </Option>

              <Option title={strings.fontSizeLabel} style={{marginTop:5}}>
                <Picker
                  items={constant.fontSizes}
                  onValueChange={(value) => this.onUserChanged('font_size',value)}
                  value={font_size}
                  style={{ iconContainer:{ top: 5 }, inputIOS:{ paddingVertical:10, color:colors.white }, inputAndroid:{ color:colors.white} }}
                  Icon={() => (<Icon style={{fontFamily:'meinobjekt', fontSize:24, color:colors.white}}>c</Icon>)}
                  useNativeAndroidPickerStyle={false}
                />
              </Option>

              <Option title={strings.chatIntervalLabel} style={{marginTop:5}}>
                <Picker
                  items={constant.chatInterval}
                  onValueChange={(speed) => this.handleChatIntervalChange(speed)}
                  value={speed}
                  style={{ iconContainer:{ top: 5 }, inputIOS:{ paddingVertical:10, color:colors.white }, inputAndroid:{ color:colors.white} }}
                  Icon={() => (<Icon style={{fontFamily:'meinobjekt', fontSize:24, color:colors.white}}>c</Icon>)}
                  useNativeAndroidPickerStyle={false}
                />
              </Option> 
            </View>
          </View>  
          <Button onPress={() => this.handleQuitTourButton()} title={planString()} containerStyle={{marginHorizontal:15, backgroundColor:colors.green}} /> 
          <Text style={[styles.profile.profileTitle, {textDecorationLine: 'underline', color:colors.green}]} onPress={() => this.handleClick(museums.museum_site_url)}>{getLocalization(museums.localizations, user.language, 'title')}</Text>
          <Text style={styles.profile.profileDescription}>{getLocalization(museums.localizations, user.language, 'description')}</Text>
          <Text style={[styles.profile.profileTitle, {textDecorationLine: 'underline', color:colors.brownGrey}]} onPress={() => this.handleClick('http://playersjourney.de/dataprotection_datenschutzerklaerung/')}>{strings.termsAnd}</Text>
          <Button onPress={() => Actions.AppGuideScreen()} title={strings.openGuide} containerStyle={{marginHorizontal:15, backgroundColor: plan === 1 ? colors.blue : colors.green}} />  
          <TouchableOpacity style={{alignSelf:'center'}} onPress={() => this.handleResetUserButtonPress()}>
            <Text style={styles.profile.btnTitle}>{strings.resetDevice}</Text>
          </TouchableOpacity>
        </ScrollView>
      </Scene>
    );
  }
}

ProfileInfoScene.propTypes = {
  getUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  resetUser: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  setPlanMode: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  museums: PropTypes.object.isRequired,
  plan: PropTypes.number.isRequired
};

export default connect(({user, museums, plan}) => ({settings:user.settings, museums:museums.museums, plan: plan.plan}) , {getUser, updateUser, resetUser, setUser, setPlanMode})(ProfileInfoScene);


export const AvatarView = (props) => {
  const {avatar, level, spin, handleChangeAvatarButtonPress} = props;
  const borderView = () => {
    if(level === 2 ) { return <Animated.Image source={bronze} style={[ styles.profile.profileAvatarBorder,{transform: [{rotate: spin}]} ]} />
      } else if(level === 3 ) { return <Animated.Image source={silver} style={[ styles.profile.profileAvatarBorder,{transform: [{rotate: spin}]} ]} />
      } else if(level >= 4 ) { return <Animated.Image source={gold} style={[ styles.profile.profileAvatarBorder,{transform: [{rotate: spin}]} ]} />
      } else { return null; }
      
  };
  return(
    <View style={{width:130, height:130, alignItems:'center', justifyContent:'center'}}>
      {borderView()}
      <Image source={{uri: getImage(avatar), cache: 'reload'}} style={styles.profile.profileAvatar} />
      <TouchableOpacity style={styles.profile.cameraIcon} onPress={handleChangeAvatarButtonPress}>
        <Icon style={{fontFamily:'meinobjekt', fontSize:24, color:'rgba(255,255,255,0.8)'}}>a</Icon>
      </TouchableOpacity>
    </View>
  )
};

AvatarView.propTypes = { 
  handleChangeAvatarButtonPress: PropTypes.func.isRequired,
  avatar: PropTypes.string.isRequired,
  level: PropTypes.number,
  spin: PropTypes.object,
};

AvatarView.defaultProps = {
  spin:{},
  level:1
}