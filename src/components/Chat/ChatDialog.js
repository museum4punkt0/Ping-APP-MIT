import React from 'react';
import { View, Image, TouchableOpacity, Linking } from 'react-native';
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
      const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      const regex = new RegExp(expression);

      switch (message.type) {
        case 'Image': return <ImageMessageContent onPress={()=>onPress(getImage(message.uri))} uri={getImage(message.uri)} />
        default:
          if(message.text.match(regex)){
            const message_parts = message.text.split(regex).filter(part => !!part).map((part, index) => {
              if(part.match(regex)){
                return <Text key={index} style={{...styles.chat.messageText, color: colors.green}} onPress={() => Linking.openURL(part.startsWith('http') ? part : 'http://' + part)}>{part}</Text>
              } else {
                return <Text key={index} style={styles.chat.messageText}>{part}</Text>
              }
            })
            return <Text>{message_parts}</Text>
          } else {
            return <Text style={styles.chat.messageText}>{message.text}</Text>;
          }
      }
    };
    return(
      <View style={styles.chat.messageContainer}>  
        {isIncoming && <View style={{flex: 1, minWidth: 40}} />}
        <View style={{minWidth: 40}}>
          {((!isIncoming && message.responses && message.responses.length > 0)||(last && !isIncoming)) && 
          <Image style={{borderRadius:16, width:32, height:32, backgroundColor:colors.dark}} source={{uri: getImage(avatar)}} />}
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