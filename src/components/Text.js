import React from 'react';
import { Text as RNText } from 'react-native';
import { connect } from 'react-redux';

export const getFontSize = (size, type = 'medium') => {
  if(type === 'small') {
    return size;
  } else if (type === 'medium') {
    return size + 2;
  } else if (type === 'large') {
    return size + 3.5;
  } else{
    return size;
  }
};

const Text = (props) => {
   const {style, user} = props;
   return(<RNText {...props} style={[style, { fontFamily: 'SFProText-Regular' }, style.fontSize && {fontSize: getFontSize(style.fontSize, user.font_size)} ]} />)
}

Text.propTypes = {
  style: RNText.propTypes.style,
  ...RNText.propTypes
};
  
Text.defaultProps = {
  style: {}
};

export default connect(({user}) => ({ user:user.user }) , {})(Text);
