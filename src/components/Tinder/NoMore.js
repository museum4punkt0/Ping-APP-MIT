import React from 'react';
import { View, ViewPropTypes, Text as Icon } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../config/styles';
import Text from '../Text'

  
const NoMore = (props) => {
    const {containerStyle, title, icon, description} = props;
    return(
      <View style={[styles.common.noMoreContainer, containerStyle]} {...props}>
        <Icon style={styles.common.noMoreIcon}>{icon}</Icon>
        <Text style={styles.common.noMoreTitle}>{title}</Text>
        <Text style={styles.common.noMoreDescription}>{description.toUpperCase()}</Text>
      </View>
    )
};
  
NoMore.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    containerStyle: ViewPropTypes.style,
};

NoMore.defaultProps = {
    containerStyle: {}
  };

export default NoMore;