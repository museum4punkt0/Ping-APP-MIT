import React, {Component} from 'react';
import { View, TouchableOpacity, Text as Icon } from 'react-native';
import { Actions } from 'react-native-router-flux';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-deck-swiper'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Scene from '../../components/Scene'
import CardComponent from "../../components/Tinder/Tinder";
import OnboardingDialog from "../../components/Tinder/Onboarding";
import styles, { colors } from '../../config/styles';
import {getLocalization, convertToArray, getStorageItem, showToast} from '../../config/helpers';
import { getChats } from '../../actions/chats'
import { getUser, voteUpdate, updateUser, getVotes } from '../../actions/user'
import strings from '../../config/localization';
import { getScore } from '../../services/voting';
import Tips from '../../components/Tips';
import Text from '../../components/Text';

class Tinder extends Component{
  constructor(props) {
    super(props);
    this.state = {
      chats:[],
      cardArray: [],
      user:{},
      onboarding:false,
      isModalOpen: false,
    }
    this.isSwiperAvailable = true;
  }

  componentWillMount(){    
    const {getChats, getUser, objects, updateUser, getVotes, tour, plan, first} = this.props;
    const chats = getChats(), user = getUser(), votings = getVotes();
    if(first) this.setState({onboarding:true});

    updateUser({...user, votings});
    let cardArray = [];
    if(plan === 2) {
      const cards = []
      const tourObjects = convertToArray(tour.tourobjects);
      tourObjects.forEach(obj => {
        const card = objects.find(item=>obj===item.sync_id);
        if(card) cards.push(card)
      });
      cardArray = this.sortObjects(user, chats, cards);
    } else cardArray = this.sortObjects(user, chats, objects);
    this.setState({cardArray, chats, user});
  }


  onSwiped(card){  
    const {getUser} = this.props;
    const { chats, cardArray } = this.state;
    const user = getUser();
    const cards = this.sortObjects(user, chats, cardArray, card);
    this.setState({ cardArray:cards });
  }  

  sortObjects(user, chats, objects, object){   
    const { categories, settings, searchedObject } = this.props;
    let { objects_to_suggest } = searchedObject;
    if(!objects_to_suggest) objects_to_suggest = [];
    const cardArray = [];
    objects.forEach(item => {
      if(object && object.sync_id === item.sync_id) return true
      const chat = chats.find((chat)=> item.sync_id === chat.object_id);
      if (item.onboarding || chat || user.level < item.level) return true;
      const suggestObject = objects_to_suggest.find(obj => obj.sync_id === item.sync_id);
      let score = getScore(user, item, categories, settings);
      if(suggestObject) score+=( 500 - ( suggestObject.position*100 ) );
      cardArray.push({...item, score});
    });
    return cardArray.sort( (a,b) => b.score - a.score );
  }

  onSwipedRight(index){
    const { voteUpdate } = this.props;
    const {cardArray, user} = this.state;
    const object = cardArray[index];
    if(!object) return;
    voteUpdate({object_id:object.sync_id, vote:true, style:object.language_style})
    if(getLocalization(object.localizations, user.language, 'conversation') && this.isSwiperAvailable) {
      this.isSwiperAvailable = false
      setTimeout(() => this.isSwiperAvailable = true, 1000);
      //showToast('firstMatch', strings.awesomeThisObject); 
      return Actions.MatchScene({ object })
    } else { showToast('firstLike', strings.greatYouLiked); }
  }

  onSwipedLeft(index){
    const { voteUpdate } = this.props;
    const { cardArray } = this.state;
    getStorageItem('firstDislike').then(value => {
      this.setState({
        isModalOpen: typeof value !== 'string'
      });
    });
    
    if(cardArray[index]) voteUpdate({object_id:cardArray[index].sync_id, vote:false, style:cardArray[index].language_style})
  }

  render(){ 
    const { settings, museums, plan } = this.props;
    const {cardArray, user, onboarding, isModalOpen} = this.state;
    return(
      <Scene label={strings.objects} isFooterShow index={1}>
        {
          cardArray.length
          ? <>
              <Swiper
              ref={swiper => { this.swiper = swiper; }}
              cards={cardArray}
              renderCard={(card, index) => (<CardComponent card={{...card, index}} user={user} position={settings.exit_position} pixelMeter={museums.ratio_pixel_meter} />)}
              onSwiped={(i) => (cardArray[i+1] && cardArray[i+1].vip) && showToast('firstVip', strings.youJustMet)}
              // onSwiped={(i) => this.onSwiped(cardArray[i])}
              overlayLabels={{
                  left: {
                    title: strings.dislike,
                    style: { label: styles.tinder.leftLabel, wrapper: styles.tinder.wrapper }
                  },
                  right: {
                    title: strings.like,
                    style: { label: styles.tinder.rightLabel,  wrapper: styles.tinder.wrapper }
                  },
                }}
              onSwipedRight={(index) => this.onSwipedRight(index)}
              cardIndex={0}
              onSwipedLeft={(index) => this.onSwipedLeft(index)}
              backgroundColor='transparent'
              verticalSwipe={false}
              marginBottom={220}
              cardVerticalMargin={50}
              useViewOverflow={false}
              outputRotationRange={["-5deg", "0deg", "5deg"]}
              stackSize={2}
              infinite

              animateOverlayLabelsOpacity
              animateCardOpacity
            />         
            <View style={styles.tinder.actionContainer}>
              <TouchableOpacity style={[styles.tinder.actionBtn,{backgroundColor:colors.red}]} onPress={()=> this.isSwiperAvailable && this.swiper.swipeLeft()}>
                <Icon style={styles.tinder.likeIcon}>i</Icon>
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal:15}} onPress={()=> Actions.CameraScene()}>
                <MIcon color={colors.white} name="center-focus-weak" size={50} /> 
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tinder.actionBtn,{backgroundColor: plan === 1 ? colors.blue : colors.green}]} onPress={()=> this.isSwiperAvailable && this.swiper.swipeRight()}>
                <Icon style={styles.tinder.likeIcon}>l</Icon>
              </TouchableOpacity>
            </View>
            </>
          : <Text style={styles.common.noObjectsMessage}>{strings.noObjectsLeft}</Text>
        }
        {onboarding && <OnboardingDialog visible={onboarding} onRequestClose={()=>this.setState({onboarding:false})} />}
        {isModalOpen ? <Tips visible={isModalOpen} title={strings.youDidNotLike} onRequestClose={()=>this.setState({isModalOpen:false})} screen='tinder' /> : null}
      </Scene>
    )
  }
}

export default connect(({ museums, user, plan }) => ({
   objects: museums.objects,
   searchedObject: museums.object,
   categories:museums.categories,
   settings:user.settings,
   museums: museums.museums, 
   plan: plan.plan,
   tour: plan.tour
   }),
   { getChats, getUser, voteUpdate, updateUser, getVotes })(Tinder);

Tinder.propTypes = ({
  objects: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  museums: PropTypes.object.isRequired,
  getChats: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  getVotes: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  voteUpdate: PropTypes.func.isRequired,
  plan: PropTypes.number.isRequired,
  searchedObject: PropTypes.object,
  tour: PropTypes.object,
  first: PropTypes.bool
});
Tinder.defaultProps = {
  searchedObject:null,
  tour:{},
  first:false
}
