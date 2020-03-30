import React from "react";
import {TouchableOpacity, Text, ViewPropTypes} from "react-native";
import PropTypes from 'prop-types';
import styles, { colors } from "../config/styles";

export const ToasterTypes = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  MESSAGE: 'MESSAGE',
  DEFAULT: 'DEFAULT'
};

class ToastListener {
  constructor() {
    this.listeners = [];
  }

  showMessage(message, type) {
    this.listeners.map(data => data.listener(message, type));
  }

  pushListener(listener) {
    const key = new Date();
    this.listeners.push({listener, key});
    return key;
  }

  popListener(key) {
    this.listeners.filter(data => data.key !== key);
  }
}

export const ToastView = (props) => {
  const {style, message} = props;
  if(!message) return null;
  return (
    <TouchableOpacity
      elevation={5} {...props}
      style={[styles.common.toastView, style]}
    >
      <Text style={{color: colors.white}}>{message}</Text>
    </TouchableOpacity>
  );
};

ToastView.propTypes = {
  message: PropTypes.string,
  style: ViewPropTypes.style,
};

ToastView.defaultProps = {
  message: null,
  style: null,
};

const Toaster = new ToastListener();
export default Toaster;