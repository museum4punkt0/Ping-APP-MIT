import React from 'react';
import {Modal, View, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import styles, {colors} from '../config/styles';
import { Text } from 'react-native';

const Loader = ({visible, caption, percentage}) => (
  <Modal visible={visible} onRequestClose={() => {}} transparent>
    <View style={styles.common.loadingContainer}>
      <ActivityIndicator       
        color={colors.green} size='large'
        style={{padding: 30, backgroundColor:colors.dark, borderRadius:20}} 
      />
      <Text style={{color: colors.green}}>{caption}</Text>
      {
        percentage
        ? <Text style={{color: colors.green, fontWeight: 'bold'}}>{percentage}%</Text>
        : undefined
      }
      
    </View>
  </Modal>
);

Loader.propTypes = {
  visible: PropTypes.bool,
  caption: PropTypes.string,
  percentage: PropTypes.number,
};

Loader.defaultProps = {
  visible: false,
  caption: '',
  percentage: 0,
};

export default Loader;