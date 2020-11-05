import React, { Component } from 'react';
import { TouchableOpacity, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import { TfImageRecognition } from 'react-native-tensorflow';
import Scene from "../../components/Scene";
import StartChatDialog from "../../components/Chat/StartChatDialog";
// import Toaster, {ToasterTypes} from "../../components/Popup";
import { getTensor } from '../../db/controllers/museums';
// import {getLocalization} from '../../config/helpers';
import { createChat } from "../../actions/chats";
import strings from '../../config/localization';
import {Recognize} from '../../actions/museums';
import styles from '../../config/styles';



export const recognizeImage = (image, tensor, museum_id, data) => Recognize(data, museum_id)
.then(response => response)
.catch(async () => {
  try {
    // console.warn('tensor.tensor_flow_model:', tensor.tensor_flow_model, 'tensor.tensor_flow_lables',tensor.tensor_flow_lables) 
    const tfImageRecognition = new TfImageRecognition({ model:tensor.tensor_flow_model, labels:tensor.tensor_flow_lables });
    const results = await tfImageRecognition.recognize({ image:image.uri, outputName: "final_result" });
    // console.warn('catch:', results) 
    let result = {title:'No results!', prediction:0, sync_id:''};
    if(results[0]) result = {sync_id: results[0].name.replace(/ /g, '-'), prediction:results[0].confidence};
    await tfImageRecognition.close();
    return result;
  } catch(error) {  
    // console.warn("Recognize Error:", error)
    return  { error };
  }
});


class CameraScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      visible:false,
      object:{}
    }
  }

  async componentDidMount() {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  }


  async takePicture(){
    this.setState({loading:true})
    const {object, chatID, objects} = this.props;
    const tensors = getTensor();
    const camera = this.camera;
    const museum_id = await AsyncStorage.getItem('museum');
    const tensor = tensors.find(item => item.museum_id === museum_id);
    if (camera) {
      const img = await camera.takePictureAsync({ quality: 0.5, base64: true, width:1080 });
      const data = new FormData();
      data.append('image', {uri:img.uri, name:'image.jpg', type: 'image/jpeg'});  
      const result = await recognizeImage(img, tensor, museum_id, data) || {};       
      let obj = {};
      if(result.sync_id && objects) obj = objects.find(item => item.sync_id === result.sync_id);
      this.setState({loading:false})
      if(!object || !chatID) return this.setState({object:obj || {} , visible:true});
      Actions.PhotoScene({img, chatID, object, from: 'CAM', result:{...result, object:obj || {}}})
    }
  }

  async handleStartConversationPress(object){
    const { createChat, chats } = this.props;
    let chat = {};
    chat = chats.find(item => item.object_id === object.sync_id);
    if(!chat) chat = await createChat(object);
    this.setState({visible:false})
    Actions.ChatsScene({ chatID:chat.sync_id, object:{...object, from:'TinderScene'} })
  }

  render() {
    const {loading, visible, object} = this.state;
    return (
      <Scene label={strings.takePhoto} isFooterShow index={3} loading={loading}>
        <RNCamera
          ref={ref => { this.camera = ref; }}
          style={{flex: 1}}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
        />
        <TouchableOpacity
          onPress={this.takePicture.bind(this)}
          style={styles.camera.cameraButton}
        >
          <Icon color='#2B3654' name="ios-camera" size={40} />
        </TouchableOpacity>
        {(Object.keys(object).length !== 0) && (
        <StartChatDialog 
          visible={visible} 
          onRequestApply={() => this.handleStartConversationPress(object)}
          onRequestClose={() => this.setState({visible:!visible})}
          object={object}
        />
        )}
      </Scene>
    );
  }
}


export default connect(({museums, chats}) => ({objects:museums.objects, chats:chats.chats}) , { createChat })(CameraScene);

CameraScene.propTypes = {
  objects: PropTypes.array.isRequired,
  chats: PropTypes.array.isRequired,
  createChat: PropTypes.func.isRequired,
  object: PropTypes.object,
  chatID: PropTypes.string
};

CameraScene.defaultProps = {
  object: null,
  chatID:null
};
