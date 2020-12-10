import React from 'react';
import {Modal, View, ActivityIndicator, Image} from 'react-native';
import PropTypes from 'prop-types';
import styles, {colors} from '../config/styles';
import { Text } from 'react-native';
import detecting from "../assets/images/detecting.png";
import strings from '../config/localization'

const Loader = ({ visible, caption, percentage, logo }) => (
  <Modal
    visible={visible}
    onRequestClose={() => {}}
    transparent
    style={{ backgroundColor: "black" }}
  >
    <View
      style={{
        ...styles.common.loadingContainer,
        backgroundColor: caption ? "black" : "",
      }}
    >
      {caption ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={{ uri: logo || detecting }}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
          <Text style={styles.common.loadingHeader}>{strings.dataIsBeingProcessed}</Text>
          <Text style={styles.common.loadingCaption}>{caption}</Text>
          {percentage ? (
            <Text style={styles.common.loadingCaption}>
              {String(percentage)}%
            </Text>
          ) : (
            undefined
          )}
        </View>
      ) : (
        <ActivityIndicator
          color={colors.green}
          size="large"
          style={{
            padding: 30,
            backgroundColor: colors.dark,
            borderRadius: 20,
          }}
          visible={!!caption}
        />
      )}
    </View>
  </Modal>
);

Loader.propTypes = {
  visible: PropTypes.bool,
  caption: PropTypes.string,
  percentage: PropTypes.number,
  logo: PropTypes.string,
};

Loader.defaultProps = {
  visible: false,
  caption: '',
  percentage: 0,
  logo: '',
};

export default Loader;