import React, {Component} from 'react';
import {Modal, Text as Image, View, Animated, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import styles, { colors } from '../../config/styles';
import Button from '../Button';
import Text from '../Text';
import strings from '../../config/localization';
import Match from '../../assets/images/match.png'
import medal from '../../assets/images/animation/5.png';
import title from '../../assets/images/animation/4.png';
import x from '../../assets/images/animation/1.png';
import l from '../../assets/images/animation/2.png';
import o from '../../assets/images/animation/3.png';

const icons = [x,l,o];

class Dialog extends Component {
    constructor(props){
        super(props)
        this.state = { move: new Animated.Value(0) }
    }

    onLoad = () => {
        // eslint-disable-next-line no-invalid-this
        const {move} = this.state;
        Animated.timing(move, {
          toValue: 1,
          duration: 500
        }).start();
    }

    getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))

    render(){
        const {visible, onRequestClose, collection} = this.props;
        const {move} = this.state;
        const items = (length = 10, position = ['top', 'right'], x = 75, y = 75 ) => {
            const arr =[]
            for(let i=0; i <= length; i++) arr.push(
              <Animated.Image
                source={icons[this.getRandomInt(3)]}
                onLoadEnd={this.onLoad} 
                resizeMode='contain'
                style={{
                        width:10, height:10, 
                        [position[0]]: move.interpolate({ inputRange: [0, 1], outputRange: [0, this.getRandomInt(x)] }),
                        [position[1]]: move.interpolate({ inputRange: [0, 1], outputRange: [0, this.getRandomInt(y)] }),
                        opacity: move.interpolate({ inputRange: [0, 1], outputRange: [0, Math.random()] }),
                        transform: [{  rotate: move.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${this.getRandomInt(180)}deg`] }) }],
                        position:'absolute'
                    }}
              />)
            return arr;
        };
        return (
          <Modal visible={visible} onRequestClose={onRequestClose} transparent>
            <View style={styles.main.dialogRootContainer}>
              <View style={styles.main.dialogContentContainer}>
                <Image source={Match} style={styles.common.pacificoTitle}>{strings.congratulations}</Image>   
                <Text style={styles.main.dialogContentText}>{`${strings.youHaveCompleted} ${collection} ${strings.collection}`}</Text> 
                <View style={{justifyContent:'center', padding:15, flexDirection:'row'}}>
                  <Items items={items} position={['bottom', 'right', 'top', 'right']} />
                  <View style={{alignItems:'center', width:90}}>
                    <Animated.Image
                      onLoadEnd={this.onLoad} source={title}
                      resizeMode='contain'
                      style={{height:60, marginBottom:10, transform: [{ scale: move.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] }}
                    />
                    <Animated.Image
                      onLoadEnd={()=>this.onLoad(3000)} source={medal}
                      style={{
                            width:90, height:90,
                            marginLeft: move.interpolate({ inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1], outputRange: [-30, 0, 30, 0, -30, 0] }),
                            // transform: [{  scale: move.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.5, 1] }) }]
                        }}
                    />
                    <Items items={items} position={['top', 'right', 'top', 'left']} containerStyle={{flexDirection:'row'}} />
                  </View>
                  <Items items={items} position={['bottom', 'left', 'top', 'left']} />
                </View>
                <Button onPress={onRequestClose} title={strings.share} />  
                <Button onPress={onRequestClose} containerStyle={{backgroundColor:colors.green}} title={strings.close} />           
              </View>
            </View>
          </Modal>
        )
    }
}

Dialog.propTypes = {
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func,
  collection: PropTypes.string
};

Dialog.defaultProps = {
  visible: false,
  onRequestClose: () => {},
  collection:'Time'
};

export default Dialog;

export const Items = (props)=>{
    const {items, position, containerStyle} = props;
    return(
      <View style={[containerStyle, {flex:1}]}>
        <View style={{flex:1}}>
          {items(5, [position[0], position[1]])}
        </View>
        <View style={{flex:1}}>
          {items(5, [position[2], position[3]])}
        </View>
      </View>
    )
}
Items.propTypes = {
    items: PropTypes.func.isRequired,
    position: PropTypes.array.isRequired,
    containerStyle: ViewPropTypes.style
};

Items.defaultProps = {
    containerStyle: {}
};
