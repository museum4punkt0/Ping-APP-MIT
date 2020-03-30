import React from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text'
import styles from '../../config/styles';

const Option = (props) => {
    const {title, children, style} = props;
    return (
      <View style={[styles.profile.optionContainer, style]}>
        <Text style={styles.profile.inputTitle}>{title}</Text>
        {children}
      </View>
    );
}
Option.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    style: ViewPropTypes.style,
};
Option.defaultProps = {
    style:{}
}
export default Option;