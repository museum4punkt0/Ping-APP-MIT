import React, {Component} from 'react';
import { View, Animated, Platform, Image } from 'react-native';
import PropTypes from 'prop-types';
import Text from "../Text";
import styles  from '../../config/styles';
import {getLocalization, getImage} from '../../config/helpers';
import vipObject from '../../assets/images/frame/vipObject.png';
import strings from '../../config/localization';
import { getDistance } from '../../services/voting';
import LinearGradient from 'react-native-linear-gradient';

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

  renderObjectLabel(text, positionStyle) {
    return (
      <View style={[styles.tinder.objectLabel, positionStyle]}>
        <Text style={styles.tinder.objectLabelText}>{text}</Text>
      </View>
    )
  }

  componentWillUpdate(){ this.onLoad(); }
  
    render(){   
    const { card, user, pixelMeter } = this.props;
    const { avatar, cropped_avatar, localizations } = card;
    const { opacity } = this.state
    const meter = pixelMeter || 1
    const position = card.section.exit_position
    const distance = Math.floor(getDistance(user, card, position)/meter);
    const textColor = getLocalization(localizations, user.language, 'text_color') || 'white';
    return(
      <View style={[styles.tinder.card]}>
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
        <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']} style={styles.tinder.gradientBox}/>
        <Image source={card.vip && vipObject} style={{position: 'absolute', width: '100%', height: '100%', resizeMode: 'stretch'}}/>
        {card.vip && this.renderObjectLabel(text='VIP', positionStyle={right: 10, bottom: 10})}
        {card.level && card.level > 1 && this.renderObjectLabel(text=`Lvl ${card.level}`, positionStyle={right: 10, top: 10})}

        <View style={[styles.tinder.boxLabelWrapper, {marginBottom: card.vip ? 20 : 0}]}>
          <Text style={{...styles.tinder.boxTitle, color: textColor}}>{getLocalization(localizations, user.language, 'phrase')}</Text>
          <Text style={{...styles.tinder.boxLabel, color: textColor}}>{`${getLocalization(localizations, user.language, 'object_kind')} ${distance}m ${strings.away}`.toUpperCase()}</Text>
        </View>
      </View>
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