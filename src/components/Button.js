import React from 'react';
import { TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../config/styles';
import Text from './Text'

  
const Button = (props) => {
    const {containerStyle, title} = props;
    return(
      <TouchableOpacity
        style={[styles.common.buttonContainer, containerStyle]}
        {...props}
      >
        <Text style={styles.chat.messageInputButtonText}>{title}</Text>
      </TouchableOpacity>
    )
};
  
Button.propTypes = {
    title: PropTypes.string.isRequired,
    containerStyle: ViewPropTypes.style,
};

Button.defaultProps = {
    containerStyle: {}
  };

export default Button;