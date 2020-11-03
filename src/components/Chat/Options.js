import React from 'react';
import { View, Text, TouchableOpacity, TextInput,Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles, {colors} from '../../config/styles';
import Button from '../Button';
import strings from '../../config/localization';
import {getImage} from '../../config/helpers';

export const Options = (props) => {
    const {options, optionSelected} = props;
    return(
      <View style={styles.chat.optionsContainer}>
        {options.map((value, key) => 
        (<Button key={value.id} onPress={() => optionSelected(key)} containerStyle={{backgroundColor:colors.green, marginHorizontal:8}} title={value.text} />)
      )}
      </View>
    )
  };
  
  Options.propTypes = {
    optionSelected: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired
  };
  
 export const Input = (props) => {
    const {handleSendMessageButtonPress, onStateChanged,messageInput} = props;
    return(
      <View style={styles.chat.messageInputContainer}>
        <TextInput
          value={messageInput}
          onChangeText={onStateChanged}
          style={styles.chat.messageTextInput}
          placeholderTextColor={colors.white}
          placeholder={strings.typeYourName}
        />
        <TouchableOpacity
          style={styles.chat.messageInputButton}
          onPress={handleSendMessageButtonPress}
        >
          <Text style={styles.chat.messageInputButtonText}>{strings.send}</Text>
        </TouchableOpacity>
      </View>
    )
  };
  
  Input.propTypes = {
    handleSendMessageButtonPress: PropTypes.func.isRequired,
    onStateChanged: PropTypes.func.isRequired,
    messageInput: PropTypes.string.isRequired
  };


 export const ChooseAvatar = (props) => {
  const {handleChooseAvatarPress, settings, chosenIndex} = props;
  const { predefined_avatars } = settings;
  if(!predefined_avatars) return null
  return(
    <View style={styles.chat.chooseAvatarContainer}>
      {predefined_avatars.map((item, i)=>(
        // eslint-disable-next-line react/no-array-index-key
        <TouchableOpacity key={i} onPress={() => handleChooseAvatarPress(item, i)}>
          <Image source={{uri:getImage(item)}} style={styles.chat.chooseAvatarImage} />
          {chosenIndex === i && <Icon style={{position:'absolute', bottom:10, right:10}} color={colors.green} name="check-circle" size={24} />}
        </TouchableOpacity>
      ))}      
    </View>
  )
};

ChooseAvatar.propTypes = {
  handleChooseAvatarPress: PropTypes.func.isRequired,
  settings: PropTypes.object,
  chosenIndex: PropTypes.number
};

ChooseAvatar.defaultProps = {
  chosenIndex:99,
  settings: {}
}