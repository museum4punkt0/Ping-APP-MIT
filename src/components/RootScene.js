import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles, { colors } from "../config/styles";
import { calculateMessageDelay } from "../config/helpers";
import Toaster, { ToastView, ToasterTypes } from './Popup';

const toastStyles = {
  [ToasterTypes.MESSAGE]: { backgroundColor: colors.gray },
  [ToasterTypes.SUCCESS]: { backgroundColor: colors.green },
  [ToasterTypes.ERROR]: { backgroundColor: colors.red },
};

class RootScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toasts: []
    };
  }

  componentDidMount() {
    this.listener = Toaster.pushListener(this.handleToastMessage.bind(this));
  }

  componentWillUnmount() {
    if(this.listener) Toaster.popListener(this.listener);
  }

  handleToastMessage(message, type) {
    const {toasts} = this.state
    if(toasts.some(t => t.message === message)) return;
    const toastsArray = [...toasts];
    toastsArray.unshift({ message, type });
    this.setState({ toasts:toastsArray });
    setTimeout(this.handlePopToastMessage.bind(this), calculateMessageDelay(message, 5000, 3.5));
  }

  handlePopToastMessage() {
    const {toasts} = this.state
    const toastsArray = [...toasts];
    toastsArray.pop();
    this.setState({ toasts:toastsArray });
  }

  render() {
    const {children} = this.props;
    const {toasts} = this.state;
    return (
      <View style={{flex: 1}}>
        <View style={styles.common.toastsContainer}>
          {toasts.map(toast => (
            <ToastView
              onPress={()=>this.handlePopToastMessage()}
              key={toast.message}
              message={toast.message}
              style={toastStyles[toast.type]}
            />
          ))}
        </View>
        {children}
      </View>
    );
  }
}

RootScene.propTypes = {
  children: PropTypes.node
};

RootScene.defaultProps = {
  children: null
};

export default RootScene;