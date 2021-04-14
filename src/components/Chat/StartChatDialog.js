import React from 'react';
import {Modal, View, Image} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles, {colors} from '../../config/styles';
import Button from "../Button";
import Text from "../Text";
import strings from '../../config/localization';
import {getLocalization, getImage} from '../../config/helpers';

const StartChatDialog = (props) => {
    const {visible, onRequestClose, onRequestApply, object, user, title} = props;
    return (
      <Modal visible={visible} onRequestClose={onRequestClose} transparent>
        <View style={styles.main.dialogRootContainer}>     
          <View style={[styles.main.dialogContentContainer,{padding:0, overflow:'hidden'}]}>
            <View style={{height:300}}>
              <Image source={{uri: getImage(object.avatar)}} style={{flex:1}} /> 
              <View style={styles.camera.photoTitleContainer}>
                <Text style={styles.camera.photoTitle}>{getLocalization(object.localizations, user.language, 'title')}</Text>
              </View>
            </View> 
            {(title && getLocalization(object.localizations, 'en', 'conversation')) && <Text style={{fontSize:20, textAlign:'center', color:colors.white, paddingVertical:15}}>{title}</Text>}
            {getLocalization(object.localizations, 'en', 'conversation') ?
            (<Button onPress={onRequestApply} title={strings.apply} />  ) :
            (<View style={[styles.camera.errorMessageContainer,{marginHorizontal:0, marginTop:-5}]}><Text numberOfLines={5} style={styles.camera.errorMessage}>{strings.cannotTalk}</Text></View>)}        
            
            <Button containerStyle={{backgroundColor:colors.dark}} onPress={onRequestClose} title={strings.cancel} />            
          </View>
        </View>
      </Modal>
)}

StartChatDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onRequestApply: PropTypes.func.isRequired,
  object: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  title: PropTypes.string
};
StartChatDialog.defaultProps = {
  title:null
};

export default connect(({ user }) => ({ user:user.user }) , {})(StartChatDialog);
