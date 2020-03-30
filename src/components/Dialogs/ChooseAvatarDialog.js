import React from 'react';
import {Modal, View} from 'react-native';
import PropTypes from 'prop-types';
import styles, {colors} from '../../config/styles';
import Button from '../Button';
import {ChooseAvatar} from '../Chat/Options'
import Text from '../Text';
import strings from '../../config/localization';

const ChooseAvatarDialog = (props) => {
    const {visible, onRequestClose, onRequestApply, chosenIndex, settings} = props;
    return (
      <Modal visible={visible} onRequestClose={onRequestClose} transparent>
        <View style={styles.main.dialogRootContainer}>
          <View style={styles.main.dialogContentContainer}>  
            <Text style={styles.chat.chooseAvatarDialogTitle}>{strings.chooseAvatar}</Text>    
            <ChooseAvatar settings={settings} handleChooseAvatarPress={(ava, i)=>onRequestApply(ava, i)} chosenIndex={chosenIndex} />       
            <Button onPress={onRequestClose} title={strings.apply} />  
            <Button containerStyle={{backgroundColor:colors.dark}} onPress={onRequestClose} title={strings.cancel} />            
          </View>
        </View>
      </Modal>
)}

ChooseAvatarDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onRequestApply: PropTypes.func.isRequired,
  chosenIndex: PropTypes.number.isRequired,
  settings: PropTypes.object.isRequired
};

export default ChooseAvatarDialog;