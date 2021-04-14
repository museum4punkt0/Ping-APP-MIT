import React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 472.615 472.615" {...props}>
      <Path d="M472.615 12.908H0l180.081 189.721-.015 257.079 112.484-58.183-.016-198.896z" />
    </Svg>
  );
}

export default SvgComponent;
