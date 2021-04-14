import React, { Component } from 'react';
import { Text, Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import {colors}  from '../config/styles';

export default class AnimatedEllipsis extends Component {

  constructor(props) {
    super(props);

    this._animation_state = {
      dot_opacities: this.initializeDots(),
      target_opacity: 1,
      should_animate: true
    };
  }

  initializeDots() {
    const {minOpacity, numberOfDots} = this.props;
    const opacities = [];

    for (let i = 0; i < numberOfDots; i++) {
      const dot = new Animated.Value(minOpacity);
      opacities.push(dot);
    }

    return opacities;
  }

  componentDidMount() {
    this.animate_dots.bind(this)(0);
  }

  componentWillUnmount() {
    this._animation_state.should_animate = false;
  }

  animate_dots(which_dot) {
    const {minOpacity, animationDelay} = this.props;
    if (!this._animation_state.should_animate) return;

    // swap fade direction when we hit end of list
    if (which_dot >= this._animation_state.dot_opacities.length) {
      which_dot = 0;
      const min = minOpacity;
      this._animation_state.target_opacity = this._animation_state.target_opacity === min ? 1 : min;
    }

    const next_dot = which_dot + 1;

    Animated.timing(this._animation_state.dot_opacities[which_dot], {
      toValue: this._animation_state.target_opacity,
      duration: animationDelay
    }).start(this.animate_dots.bind(this, next_dot));
  }

  render() {
    const {style} = this.props;
    // eslint-disable-next-line react/no-array-index-key
    const dots = this._animation_state.dot_opacities.map((o, i) => (<Animated.View key={i} style={[style, { opacity: o }]} />))

    return (
      <View style={{marginLeft:45, backgroundColor:colors.dark, padding: 10, margin:5, borderRadius: 10, flexDirection: 'row', width:80, justifyContent:'center'}}>
        {dots}
      </View>
    );
  }
}

AnimatedEllipsis.propTypes = {
  numberOfDots: PropTypes.number,
  animationDelay: PropTypes.number,
  minOpacity: PropTypes.number,
  style: Text.propTypes.style
};

AnimatedEllipsis.defaultProps = {
  numberOfDots: 3,
  animationDelay: 300,
  minOpacity: 0,
  style: {width:10, height:10, borderRadius:5, backgroundColor:'rgb(92,94,96)', marginHorizontal:5}
};