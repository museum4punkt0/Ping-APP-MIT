import React from 'react';
import {Modal, Text as Icon, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
// import Match from '../../assets/images/match.png'
import styles from '../../config/styles';
import Button from '../Button';
import Text from '../Text';

const Dialog = (props) => {
    const {visible, onRequestClose, onPress, title, bodyText, btnTetx} = props;
    return (
      <Modal visible={visible} onRequestClose={onRequestClose} transparent>
        <View style={styles.main.dialogRootContainer}>
          <TouchableOpacity style={styles.main.dialogRootContainerButton} onPress={onRequestClose} />
          <View style={styles.main.dialogContentContainer}>
            <Icon style={styles.common.pacificoTitle}>{title}</Icon>   
            <Text style={styles.main.dialogContentText}>{bodyText}</Text>
            <Button onPress={onPress || onRequestClose} title={btnTetx} />   
          </View>
        </View>
      </Modal>
)}

Dialog.propTypes = {
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func,
  onPress: PropTypes.func,
  title: PropTypes.string,
  bodyText: PropTypes.string,
  btnTetx: PropTypes.string
};

Dialog.defaultProps = {
  visible: false,
  onRequestClose: () => {},
  onPress: null,
  title:'',
  bodyText:'',
  btnTetx:''
};

export default Dialog;