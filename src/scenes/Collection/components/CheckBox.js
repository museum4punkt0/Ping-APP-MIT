import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../config/styles';
import FilterSvg from '../../../components/FilterSvg';

const CheckBox = (props) => {
  const { value, onValueChange } = props;
  return (
    <TouchableOpacity {...props} onPress={onValueChange}>
      {value ? (
        <Icon color={colors.green} name="check-circle" size={24} />
      ) : (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.darkGrey,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FilterSvg style={{ width: 15, height: 15 }} />
        </View>
      )}
    </TouchableOpacity>
  );
};

CheckBox.propTypes = {
  value: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default CheckBox;
