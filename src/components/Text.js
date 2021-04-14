import React, { useState } from 'react';
import { Text as RNText } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export const getFontSize = (size, type = 'normal') => {
  if(type === 'normal') {
    return size;
  } else if (type === 'big') {
    return size + 2;
  } else if (type === 'large') {
    return size + 3.5;
  } else{
    return size;
  }
};

const Text = (props) => {
  const {style} = props;
  const [fontSize, setFontSize] = useState('normal')

  AsyncStorage.getItem('font_size').then(value => {
    setFontSize(value)
  });

  return <RNText {...props} style={[style, { fontFamily: 'SFProText-Regular' }, style.fontSize && {fontSize: getFontSize(style.fontSize, fontSize)} ]} />
}

Text.propTypes = {
  style: RNText.propTypes.style,
  ...RNText.propTypes
};
  
Text.defaultProps = {
  style: {}
};

export default Text;
