import React, {Component} from 'react';
import { View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import Scene from '../../components/Scene'
import Text from '../../components/Text'
import Button from '../../components/Button'
import styles, {colors} from '../../config/styles'
import {getLocalization, getImage} from '../../config/helpers';
import { CopyImage, WriteAndSaveOrientation } from '../../actions/museums';
import strings from '../../config/localization';

class PhotoScene extends Component {
  constructor(props) {
    super(props);
    this.state = {   
      isRecognized:true
    }
  }

  componentWillMount(){
    const { object, result, user } = this.props;
    this.setState({ isRecognized: !(object.sync_id !== result.sync_id || result.error), result:{...result, title:getLocalization(result.object.localizations, user.language, 'title') || strings.NotRecognized } })
  }

  handleSavePhoto = async (img, chatID, object) => {
    const image = await WriteAndSaveOrientation(img, uuidv1())
    Actions.ChatsScene({img:image, chatID, object, from: 'CAM'})
  }

  handleUseDefaultPhoto = async (chatID, object) => {
    const image = await CopyImage(getImage(object.avatar), uuidv1());
    Actions.ChatsScene({img:image, chatID, object, from: 'CAM'})
  }


  render() {
    const { object, chatID, user, img } = this.props;
    const { isRecognized, result } = this.state;
    return (
      <Scene label={strings.objectPhoto}>

        <View style={{flex:0.6, margin:15}}>
          <Image style={{flex:1, backgroundColor: colors.dark, borderRadius:10}} source={{uri: img.uri}} />
          <View style={styles.camera.photoTitleContainer}>
            <Text style={styles.camera.photoTitle}>{getLocalization(object.localizations, user.language, 'title')}</Text>
            <Text style={styles.camera.photoDescription}>{getLocalization(object.localizations, user.language, 'title')}</Text>
          </View>
        </View>

        {!isRecognized && (
          <View style={styles.camera.errorMessageContainer}>
            {/* <Text numberOfLines={5} style={styles.camera.errorMessage}>{result.error ? `${strings.NotRecognized}\n${result.error}` : `${strings.wasNotRecognized} '${result.title}' ${strings.made}?`}</Text> */}   
            <Text numberOfLines={5} style={styles.camera.errorMessage}>{result.error ? strings.NotRecognized : `${strings.wasNotRecognized} '${result.title}' ${strings.made}?`}</Text>
          </View>
        )}

        <View style={{flex:0.4, paddingHorizontal:15}}>
          {isRecognized && <Button onPress={() => this.handleSavePhoto(img, chatID, object)} title={strings.addThis} />}
          <Button containerStyle={{ backgroundColor:isRecognized ? colors.dark : colors.green }} onPress={()=>Actions.pop()} title={strings.takeAnother} />
          {!isRecognized && <Button containerStyle={{backgroundColor:colors.dark}} onPress={() => this.handleSavePhoto(img, chatID, object)} title={strings.useThisPhoto} />} 
          {/* <Button containerStyle={{backgroundColor:colors.dark}} onPress={()=>Actions.ChatsScene({img:object.avatar, chatID, object, from: 'CAM'})} title={strings.useDefault} />   */}
          <Button containerStyle={{backgroundColor:colors.dark}} onPress={() => this.handleUseDefaultPhoto(chatID, object)} title={strings.useDefault} />             
        </View>      
      </Scene>
    );
  }
}


export default connect(({ user }) => ({ user:user.user}) , {})(PhotoScene);

PhotoScene.propTypes = {
  user: PropTypes.object.isRequired,
  object: PropTypes.object.isRequired,
  chatID: PropTypes.string.isRequired,
  result: PropTypes.object.isRequired,
  img: PropTypes.object.isRequired
};