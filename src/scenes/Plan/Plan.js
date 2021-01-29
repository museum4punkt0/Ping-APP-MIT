import React, { Component } from 'react';
import {  ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChats } from '../../actions/chats'
import { setPlanMode } from '../../actions/user'
import { getObjects } from '../../db/controllers/museums';
import {convertToArray, getImage, planString} from '../../config/helpers';
import Scene from "../../components/Scene";
import NoMore from '../../components/Tinder/NoMore';
import Dialog from '../../components/Dialogs/Dialog'
import strings from '../../config/localization';
import styles, { colors } from '../../config/styles';
import variables from '../../config/constants';
import { Actions } from 'react-native-router-flux';
import Button from '../../components/Button';


class DetectLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats:[] 
    }
  }

  componentWillMount(){
    const { getChats, plan, newPlan, museumObjectsIds } = this.props;
    const objects = convertToArray(getObjects());
    let chats = getChats();
    const chatsObj = [];
    if(plan === variables.planMode) chats = chats.filter(chat => chat.planned)
    chats.forEach(chat=>{
      const object = objects.find((object)=> object.sync_id === chat.object_id)
      if(!object || !museumObjectsIds.includes(object.sync_id) || object.onboarding) return true;
      chatsObj.push({object, chat})
    })
    this.setState({ chats:chatsObj.reverse(), planDialog: newPlan })
  }

  handleQuitTourButton(){
    const {setPlanMode} = this.props;
    setPlanMode(variables.discoverMode)
    Actions.DetectLocation()
  }

  render() {
    const {chats, planDialog} = this.state;
    const { plan } = this.props
    return (
      <Scene label={strings.myPlan} isFooterShow index={3}>
        {chats.length === 0 && (
        <NoMore 
          title={strings.noActine}
          description={strings.likeObjects}
          icon='m'
        />
        )}
        <ScrollView style={{padding:15, flex:1}} contentContainerStyle={{flexWrap:'wrap', flexDirection: 'row'}}>
          {chats.map(item => {
            const { object } = item;
            const { sync_id, avatar } = object;
            return (
              // <View key={sync_id} style={styles.chat.planListContainer}>
              <Image key={sync_id} style={styles.chat.planListContainer} source={{uri:getImage(avatar)}}  />
              // </View>
            )
          })}    
        </ScrollView>
        <Button onPress={() => this.handleQuitTourButton()} title={planString(plan, isFromPlanScene=true)} containerStyle={{marginHorizontal:35, marginBottom: 20, backgroundColor:colors.blue}}/> 
        <Dialog visible={planDialog} onRequestClose={()=>this.setState({planDialog:false})} title={strings.congratulations} bodyText={strings.startYouOwnTour} btnTetx={strings.gotIt} />
      </Scene>
    );
  }
}

export default connect(
  ({ plan, museums }) => ({
    plan: plan.plan,
    museumObjectsIds: convertToArray(museums.museums.objects).map(
      (item) => item.sync_id
    ),
  }),
  { getChats, setPlanMode }
)(DetectLocation);

DetectLocation.propTypes = ({
  getChats: PropTypes.func.isRequired,
  plan: PropTypes.number.isRequired,
  newPlan: PropTypes.bool,
  setPlanMode: PropTypes.func.isRequired,
});

DetectLocation.defaultProps = {
  newPlan:false
};