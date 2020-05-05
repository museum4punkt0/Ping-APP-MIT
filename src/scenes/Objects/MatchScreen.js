import React, {Component} from 'react';
import { View, Image, TouchableOpacity, Animated, Easing, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles,{ colors } from '../../config/styles';
import Match from '../../assets/images/match.png'
import vipMatch from '../../assets/images/frame/vipMatch.png';
import Button from '../../components/Button'
import Text from '../../components/Text'
import { createChat } from "../../actions/chats";
import {getLocalization, getImage, getStorageItem} from '../../config/helpers';
import strings from '../../config/localization';
import Tips from '../../components/Tips';

class MatchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    }
    this.animatedImage= new Animated.Value(0);
  }

  componentDidMount () {
    this.animatedImage.setValue(1)
    Animated.timing(
      this.animatedImage,
      {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear
      }
    ).start();
    getStorageItem('firstMatch').then(value => {
      this.setState({
        isModalOpen: typeof value !== 'string'
      });
    });
  }

  async handleStartConversationPress(){
    const { object, createChat, plan } = this.props;
    // console.warn(plan);
    const chat = await createChat({...object, planned: plan === 1});
    Actions.ChatsScene({ chatID:chat.sync_id, object:{...object, from:'TinderScene'} })
  }

  render(){
    const { object, user, plan } = this.props;
    const { isModalOpen } = this.state;
    const {cropped_avatar, avatar} = object;
    const margin = this.animatedImage.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, 100]
    })
  return (  
    <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:colors.black }}>
      {/* <MathDialog visible={isModalOpen} onRequestClose={()=>this.setState({isModalOpen:false})} title={strings.perfectMatch} bodyText={strings.weThing} btnTetx={strings.gotIt} /> */}
      <Tips visible={isModalOpen} onRequestClose={()=>this.setState({isModalOpen:false})} screen='matchScreen' title={strings.weThing} />
      <Image source={Match} style={{width:270, height:50}} resizeMode="contain"  />     

      <View style={{ flexDirection:'row', marginVertical:25}}>
        <Animated.Image style={[styles.main.matchImage, { marginRight:margin }]} source={user.avatar ? {uri: getImage(user.avatar)} : require("../../assets/images/user.png")} />

        <Animated.View style={[styles.main.matchImage, { marginLeft:margin, borderWidth:object.vip ? 0 : 2 }]}>
          <ImageBackground style={{ flex:1, alignItems:'center', justifyContent:'center', }} source={object.vip && vipMatch}>
            <Image style={{ width:196, height:196, borderRadius:98, zIndex:-1 }} source={{uri: getImage(cropped_avatar || avatar) }} />
          </ImageBackground>
        </Animated.View>
      </View>

      <View>
        <Text style={styles.main.matchTitle}>{`${strings.youAnd} “${getLocalization(object.localizations, user.language, 'title')}” ${strings.haveLiked}`}</Text>
        <Button onPress={() => this.handleStartConversationPress()} title={strings.startConversation} containerStyle={{backgroundColor:plan === 1 ? colors.blue : colors.green}} />
        <Button onPress={Actions.pop} title={strings.noThanks} containerStyle={{backgroundColor:colors.dark}} />
      </View>
      <TouchableOpacity onPress={()=>this.setState({isModalOpen:true})}>
        <Text style={styles.main.matchDescription}>{strings.whatDoes}</Text>
      </TouchableOpacity>
    </View>
  );
}
}
export default connect(({user, plan}) => ({ user: user.user, plan:plan.plan }) , {createChat})(MatchScreen);


  MatchScreen.propTypes = ({
    object: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    createChat:  PropTypes.func.isRequired,
    plan: PropTypes.number.isRequired
  });