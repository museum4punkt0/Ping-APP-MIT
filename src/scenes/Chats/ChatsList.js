import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Scene from "../../components/Scene";
import Text from '../../components/Text';
import NoMore from '../../components/Tinder/NoMore';
import {getLocalization, convertToArray, getImage} from '../../config/helpers';
import vipChat from '../../assets/images/frame/vipChat.png';
import { getObjects } from '../../db/controllers/museums';
import styles from '../../config/styles';
import { getChats } from '../../actions/chats'
import { updateUser } from '../../actions/user'
import strings from '../../config/localization';

class ChatsListScene extends Component {
  constructor(props) {
    super(props);
      this.state = { 
        chats:[]
      }
  }

  componentWillMount(){
    const { getChats, user, updateUser, plan } = this.props;
    const objects = convertToArray(getObjects());
    let chats = getChats();
    updateUser({sync_id:user.sync_id, chats});
    const chatsObj = [];
    if(plan === 1) chats = chats.filter(chat => chat.planned)
    chats.forEach(chat=>{
      const object = objects.find((object)=> object.sync_id === chat.object_id)
      if(!object || object.onboarding) return true;
      let history = []
      if(chat.history) history = JSON.parse(chat.history)
      let lastMessage = '';
      if(history[history.length-1]) lastMessage = history[history.length-1].text;
      if(!lastMessage && history[history.length-2]) lastMessage = history[history.length-2].text;
      chatsObj.push({object, chat:{...chat, lastMessage}})
    })
    this.setState({ chats:chatsObj.reverse() })
  }

  render() {
    const { user } = this.props;
    const {chats} = this.state;
    return (
      <Scene label={strings.chat} isFooterShow index={2}>
        {chats.length === 0 && (
          <NoMore 
            title={strings.noActine}
            description={strings.likeObjects}
            icon='m'
          />
        )}
        <ScrollView style={{flex:1, paddingBottom:15}}>
          {chats.map(item => {
            const { object, chat } = item;
            const {sync_id, avatar, cropped_avatar, localizations} = object;
            const { lastMessage } = chat;
            return (
              <TouchableOpacity key={sync_id} onPress={() => Actions.ChatsScene({ object:{...object, from:'ChatsListScene'}, chatID:chat.sync_id })} style={styles.chat.chatListContainer}>
                <ImageBackground source={object.vip && vipChat} style={{width:54, height:54, borderRadius:52, alignItems:'center', justifyContent:'center'}}>
                  <Image source={{uri:getImage(cropped_avatar || avatar)}} style={{width:50, height:50, borderRadius:25, zIndex:-1}} />
                </ImageBackground>
                <View style={{flex:1, marginHorizontal:15}}>
                  <Text style={styles.chat.optionsTitle}>{getLocalization(localizations, user.language, 'title')}</Text>
                  <Text style={styles.chat.lastMessageLabel} numberOfLines={1}>{lastMessage}</Text>
                </View>
              </TouchableOpacity>
            )
          })}    
        </ScrollView>
      </Scene>
    );
  }
}

export default connect(({ user, plan }) => ({ user:user.user, plan:plan.plan }) , { getChats, updateUser })(ChatsListScene);

ChatsListScene.propTypes = ({
  getChats: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  plan: PropTypes.number.isRequired
});
