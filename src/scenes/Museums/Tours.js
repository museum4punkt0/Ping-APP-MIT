import React, { Component } from 'react';
import { View, TouchableOpacity, Text as Icon , ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import Scene from "../../components/Scene";
import Text from "../../components/Text";
// import NoPlannedDialog from "../../components/Dialogs/Dialog";
// import Toaster, {ToasterTypes} from "../../components/Popup";
import strings from '../../config/localization';
import {convertToArray, getLocalization, scale} from '../../config/helpers';
import styles, { colors } from '../../config/styles';
import variables from '../../config/constants';
import {setTour, setPlanMode} from '../../actions/user';
import { getChats } from '../../actions/chats'


class Tours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // noPlannedDialog:false,
      isPlannedChats:false
    }
  }

  componentWillMount() {
    const {getChats, museums} = this.props;
    const chats = getChats();
    const museumObjectsIds = convertToArray(museums.objects).map(item => item.sync_id);
    const isPlanned = chats.find(chat => chat.planned && museumObjectsIds.includes(chat.object_id));
    if(!isPlanned) return;
    this.setState({
      isPlannedChats: isPlanned.planned
    })
  }
  
  onPressTourButton(tour){
    const {setTour, first} = this.props;
    setTour(tour);
    Actions.TinderScene({first});
  }

  onPressStartDiscoverButton(){
    const {setPlanMode, first} = this.props;
    setPlanMode(variables.discoverMode);
    Actions.TinderScene({first});
  }

  onPressPlanetButton(){
    const {setPlanMode} = this.props;
    setPlanMode(variables.plannedTourMode);
    Actions.ChatsListScene();
  }

  render() {
    const {museums, user} = this.props;
    const {isPlannedChats} = this.state;
    return (
      <Scene label='Tours' backBtnFunc={()=>Actions.pop()} navigator={false} style={{flex:1, padding:15}}>
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[styles.main.toursButtonContainer, {marginRight:5}]} onPress={()=>this.onPressStartDiscoverButton()}>
              <Icon style={[styles.main.toursButtonIcon, {left:0, color:'rgba(255,255,255,0.2)'}]}>l</Icon>
              <Icon style={[styles.main.toursButtonIcon, {right:0, bottom:50, color:'rgba(0,0,0,0.2)'}]}>i</Icon>
              <Text style={[styles.main.toursButtonLabel, {fontSize: scale(24)}]}>{strings.startDiscover}</Text>
            </TouchableOpacity>
          </View>
          {isPlannedChats && (
            <View style={{flexDirection: 'row', marginTop: 25}}>          
              <TouchableOpacity style={[styles.main.toursButtonContainer, {marginLeft:5, height: 120, backgroundColor:colors.blue}]} onPress={()=>this.onPressPlanetButton()}>
                <Icon style={[styles.main.smallToursButtonIcon, {left:0, color:'rgba(255,255,255,0.2)'}]}>m</Icon>
                <Icon style={[styles.main.smallToursButtonIcon, {right:0, bottom:25, color:'rgba(0,0,0,0.2)', transform:[{ rotateY: '180deg'}]}]}>m</Icon>
                <Text style={styles.main.smallToursButtonLabel}>{strings.startPlannedTour}</Text>
              </TouchableOpacity>
            </View>
          )}
          {museums.tours.filter((tour) => !tour.is_hidden).length ? (
            <Text style={styles.main.museumTourLabel}>
              {strings.museumTours}
            </Text>
          ) : null}
          {museums.tours
          .filter((tour) => !tour.is_hidden)
          .sort((a, b) => a.order - b.order)
          .map((tour) => (
            <ToursButton
              key={tour.sync_id}
              tour={tour}
              user={user}
              onPressTourButton={() => this.onPressTourButton(tour)}
            />
          ))}
          {/* <NoPlannedDialog
          visible={noPlannedDialog} onRequestClose={()=>this.setState({noPlannedDialog:false})} 
          title={strings.noPlannedTour} bodyText={strings.likeObjectsInPlanned} btnTetx={strings.gotIt}
        /> */}
        </ScrollView>
      </Scene>
    );
  }
}
export default connect(({ museums, user, plan }) => ({ museums: museums.museums, user:user.user, plan: plan.plan }) , {setTour, setPlanMode, getChats})(Tours);

Tours.propTypes = {
  museums: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setTour: PropTypes.func.isRequired,
  setPlanMode: PropTypes.func.isRequired,
  getChats: PropTypes.func.isRequired,
  first:PropTypes.bool
};
Tours.defaultProps = { first:false }

export const ToursButton = (props) => {
  const {tour, user, onPressTourButton} = props;
  return(
    <TouchableOpacity 
      onPress={onPressTourButton}
      style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderRadius:10, padding:15, backgroundColor:colors.dark}}
    >
      <Text style={styles.main.museumTourTitle}>{getLocalization(tour.localizations, user.language, 'title')}</Text>
      <MIcon name='keyboard-arrow-right' size={24} color={colors.white} /> 
    </TouchableOpacity>
  )
}
ToursButton.propTypes = {
  tour: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onPressTourButton: PropTypes.func.isRequired,
};