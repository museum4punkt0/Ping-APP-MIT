import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Scene from "../../components/Scene";
import Text from '../../components/Text';
import NoMore from '../../components/Tinder/NoMore';
import {getLocalization, convertToArray, getImage} from '../../config/helpers';
import vipChat from '../../assets/images/frame/vipChat.png';
import { getObjects } from '../../db/controllers/museums';
import styles, { colors } from '../../config/styles';
import { getChats } from '../../actions/chats'
import { updateUser } from '../../actions/user'
import strings from '../../config/localization';
import variables from '../../config/constants'

class ChatsListScene extends Component {
  constructor(props) {
    super(props);
      this.state = { 
        chats:[]
      }
  }

  componentWillMount(){
    const { getChats, user, updateUser, plan, museumObjectsIds } = this.props;
    const objects = convertToArray(getObjects());
    let chats = getChats();
    updateUser({sync_id:user.sync_id, chats});
    const chatsObj = [];
    if(plan === variables.planMode) chats = chats.filter(chat => chat.planned)
    chats.forEach(chat=>{
      const object = objects.find((object)=> object.sync_id === chat.object_id)
      if(!object || !museumObjectsIds.includes(object.sync_id) || object.onboarding) return true;
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
            icon="m"
          />
        )}
        <ScrollView style={{ flex: 1, paddingBottom: 15 }}>
          {chats
            .sort((a, b) => a.chat.finished - b.chat.finished)
            .map((item) => {
              const { object, chat } = item;
              const {
                sync_id,
                avatar,
                cropped_avatar,
                localizations,
              } = object;
              const { finished } = chat;
              const { lastMessage } = chat;
              return (
                <TouchableOpacity
                  key={sync_id}
                  onPress={() =>
                    Actions.ChatsScene({
                      object: { ...object, from: 'ChatsListScene' },
                      chatID: chat.sync_id,
                    })
                  }
                  style={[
                    styles.chat.chatListContainer,
                    {
                      backgroundColor: finished
                        ? colors.completeColor
                        : null,
                    },
                  ]}
                >
                  <ImageBackground
                    source={object.vip && vipChat}
                    style={styles.chat.chatListImageBackground}
                  >
                    <Image
                      source={{ uri: getImage(cropped_avatar || avatar) }}
                      style={styles.chat.chatImage}
                    />
                  </ImageBackground>
                  <View style={{ flex: 1, marginHorizontal: 15 }}>
                    <Text style={styles.chat.optionsTitle}>
                      {getLocalization(
                        localizations,
                        user.language,
                        'title'
                      )}
                    </Text>
                    <Text
                      style={styles.chat.lastMessageLabel}
                      numberOfLines={1}
                    >
                      {lastMessage}
                    </Text>
                  </View>
                  {finished && (
                    <Icon
                      color={colors.green}
                      name="check"
                      size={24}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </Scene>
    );
  }
}

export default connect(
  ({ user, plan, museums }) => ({
    user: user.user,
    plan: plan.plan,
    museumObjectsIds: convertToArray(museums.museums.objects).map(
      (item) => item.sync_id
    ),
  }),
  { getChats, updateUser }
)(ChatsListScene);

ChatsListScene.propTypes = ({
  getChats: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  plan: PropTypes.number.isRequired
});
