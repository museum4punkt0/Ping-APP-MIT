import React from 'react';
import {Modal, View, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import styles, {colors} from '../config/styles';

const Loader = ({visible}) => (
  <Modal visible={visible} onRequestClose={() => {}} transparent>
    <View style={styles.common.loadingContainer}>
      <ActivityIndicator       
        color={colors.green} size='large'
        style={{padding: 30, backgroundColor:colors.dark, borderRadius:20}} 
      />
    </View>
  </Modal>
);

Loader.propTypes = {
  visible: PropTypes.bool
};

Loader.defaultProps = {
  visible: false
};

export default Loader;