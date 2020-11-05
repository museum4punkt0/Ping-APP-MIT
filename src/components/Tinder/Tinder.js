import React, {Component} from 'react';
import { View, Animated, ImageBackground, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Text from "../Text";
import styles  from '../../config/styles';
import {getLocalization, getImage} from '../../config/helpers';
import vipObject from '../../assets/images/frame/vipObject.png';
import strings from '../../config/localization';
import { getDistance } from '../../services/voting';

class CardComponent extends Component{
    constructor(props) {
      super(props);
      this.state = { 
        opacity: new Animated.Value(0),
        random: new Date(),
      }
    }

  onLoad(){
    // eslint-disable-next-line no-invalid-this
    const {opacity} = this.state;
    Animated.timing(opacity, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }

  componentWillUpdate(){ this.onLoad(); }
  
    render(){   
    const { card, user, position, pixelMeter } = this.props;
    const { avatar, cropped_avatar, localizations } = card;
    const { opacity } = this.state
    const meter = pixelMeter || 1
    const distance = Math.floor(getDistance(user, card, position)/meter);
    return(
      <ImageBackground resizeMode='stretch' source={card.vip && vipObject} style={{flex:1, padding:5, paddingBottom:10}}>
        <View style={styles.tinder.card}>
          <Animated.Image
            onLoadEnd={() => {if(card.index === 0) this.onLoad()}} 
            source={{uri: getImage(cropped_avatar || avatar) + (Platform.OS === 'ios' ? '' : '?' + this.state.random)}}
            style={[styles.tinder.cardImage, 
            { 
                transform: [
                    { 
                        scale: opacity.interpolate({ inputRange: [0, 1], outputRange: [1, 2] })
                    }
                ],
            }]}
            resizeMode='cover'
          />
          <View style={styles.tinder.boxLabelWrapper}>
            <Text style={styles.tinder.boxTitle}>{getLocalization(localizations, user.language, 'phrase')}</Text>
            <Text style={styles.tinder.boxLabel}>{`${getLocalization(localizations, user.language, 'object_kind')} ${distance}m ${strings.away}`.toUpperCase()}</Text>
          </View>
        </View>
      </ImageBackground>
    )
  }
}
export default CardComponent;

CardComponent.propTypes = ({
  card: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  pixelMeter: PropTypes.number
});

CardComponent.defaultProps = {
  pixelMeter:1
 }