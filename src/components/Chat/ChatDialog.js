import React from 'react';
import { View, Image, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text'
import styles, {colors} from '../../config/styles';  
import {getImage} from '../../config/helpers';  
  
export const ImageMessageContent = ({ onPress, uri }) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      style={styles.chat.messageImage}
      source={{uri}}
    />
  </TouchableOpacity>
  );
    
ImageMessageContent.propTypes = ({
  uri: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
});


  export const MessageView = ({ message, isIncoming, onPress, avatar, last }) => {
    const color = isIncoming ? colors.green : colors.dark;
    const renderMessageContent = () => {
      switch (message.type) {
        case 'Image': return <ImageMessageContent onPress={()=>onPress(getImage(message.uri))} uri={getImage(message.uri)} />
        default: return <Text style={styles.chat.messageText}>{message.text}</Text>;
      }
    };
    return(
      <View style={styles.chat.messageContainer}>  
        {isIncoming && <View style={{flex: 1, minWidth: 40}} />}
        <View style={{minWidth: 40}}>
          {((!isIncoming && message.responses && message.responses.length > 0)||(last && !isIncoming)) && 
          <Image style={{borderRadius:16, width:32, height:32, backgroundColor:colors.dark}} source={{uri: getImage(avatar) + (Platform.OS === 'ios' ? '' : '?' + new Date())}} />}
        </View>
        <View style={[styles.chat.messageTextContainer, { backgroundColor: color }]}>
          {renderMessageContent()}
        </View>
        {!isIncoming && <View style={{flex: 1, minWidth: 40}} />}
      </View>
    );
};
    
MessageView.propTypes = {
  message: PropTypes.object.isRequired,
  isIncoming: PropTypes.bool.isRequired,
  last: PropTypes.bool.isRequired,
  avatar: PropTypes.string,
  onPress: PropTypes.func
};

MessageView.defaultProps = {
  avatar: 'http:avatar',
  onPress: () => {}
};