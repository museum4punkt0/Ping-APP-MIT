import React, { Component } from 'react';
import { Image, ImageBackground, View, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Toaster, {ToasterTypes} from "../../components/Popup";
import Scene from "../../components/Scene";
import Button from "../../components/Button";
import Text from "../../components/Text";
import notDetected from "../../assets/images/notDetected.png";
import detecting from "../../assets/images/detecting.png";
import detected from "../../assets/images/detected.png";
import detectedPlan from "../../assets/images/detectedPlan.png";
import strings from '../../config/localization';
import {getLocalization, convertToArray, getDeviceLocale, getPermission} from '../../config/helpers';
import styles, { colors } from '../../config/styles';
import variables from '../../config/constants'
import { getMuseums } from '../../db/controllers/museums';
import { getMuseumsList, setAllData, getMuseum, setObject } from '../../actions/museums';
import { sync } from "../../actions/synchronize";
import { getSettings, getUser, setPlanMode, updateUser } from "../../actions/user";
import { createChat, getChats } from "../../actions/chats";


class DetectLocation extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading:false,
      type:null,
      museum:{},
      loadingCaption: '',
      totalLoadingObjects: 0,
      currentlyLoadedObjects: 0,
      chosenMuseumLogo: null,
    }
  }

async componentWillMount(){  
  // eslint-disable-next-line 
  setTimeout(()=>{if(!this.state.type) this.setState({type:0})}, 6000); //For Xiaomi hack
    if(Platform.OS === 'android') {
      await PermissionsAndroid.request(getPermission('location'));
    } else {
      await Geolocation.requestAuthorization('whenInUse');
    }
    
    Geolocation.getCurrentPosition(
      location => getMuseumsList(location.coords.latitude, location.coords.longitude)
        .then(museums => {
          const museum = museums.find(museum => museum.located);
          if(!museum) return this.setState({type:2});
          this.setState({museum, type:1})
        }).catch(() => this.setState({type:0})),
      () => this.setState({type:0}),
      { timeout: 5000 }
    );
}

  updateTotalLoadingObjects(number) {
    this.setState({totalLoadingObjects: number})
  }

  incrementCurrentlyLoadedObjects() {
    this.setState((prevState, props) => ({
      currentlyLoadedObjects: prevState.currentlyLoadedObjects + 1
    }))
  }
  
  handlePlanTourButton(){
    const {setPlanMode} = this.props;
    setPlanMode(variables.planMode);
    Actions.MuseumsScene()
  }

  handleSelectMuseumButton(){
    const {setPlanMode} = this.props;
    setPlanMode(variables.tourMode)
    Actions.MuseumsScene()
  }

  async handleChooseMuseum(museum_id, plan){
    const { setAllData, getUser, getSettings, getMuseum, sync, setObject, getChats, setTour, setPlanMode } = this.props;
    const { museum: currentMuseum } = this.state
    setPlanMode(plan);
    
    this.setState({
      loading: true,
      loadingCaption: strings.downloading,
      totalLoadingObjects: 0,
      currentlyLoadedObjects: 0,
      chosenMuseumLogo: currentMuseum.museumimages.find(
        (image) => image.image_type === "logo"
      ).image,
    });

    museums = convertToArray(getMuseums()), settings = getSettings();
    let museum = museums.find(item => item.sync_id === museum_id);

    if(museum) museum = getMuseum(museum_id);
    
    if (!museum)
    {
      museum = await setAllData(
        museum_id,
        this.updateTotalLoadingObjects.bind(this),
        this.incrementCurrentlyLoadedObjects.bind(this)
      ).catch((err) =>
        this.setState({ loading: false }, () =>
          Toaster.showMessage(
            `${strings.wentWrong}: '${err}'`,
            ToasterTypes.ERROR
          )
        )
      );
    }
      
    const user = getUser(), chats = getChats();
    
    if(user) updateUser({...user, section: museum.sections.filter(section => section.isMainEntrance)[0]})
    
    this.setState({
      loadingCaption: strings.synchronising,
      totalLoadingObjects: 0,
      currentlyLoadedObjects: 0,
    });
    
    await sync(
      { museum, user, settings },
      this.updateTotalLoadingObjects.bind(this),
      this.incrementCurrentlyLoadedObjects.bind(this)
    )
      .then(() =>
        this.setState({ loading: false }, () =>
          AsyncStorage.setItem("museum", museum_id)
        )
      )
      .catch((err) =>
        Toaster.showMessage(
          strings.updatingError + ":" + err,
          ToasterTypes.ERROR
        )
      )
      .finally(() =>
        this.setState({ loading: false }, () =>
          AsyncStorage.setItem("museum", museum_id)
        )
      );
    
    let object = null; 
    chats.forEach(chat => {if(!chat.finished) object = museum.objects.find(object => (!object.onboarding && object.sync_id === chat.object_id))});
    setObject(object || {});
    
    const first = await AsyncStorage.getItem('firstEntry');
    if(!first) return this.handleUserLogin(museum, chats);
    if(plan === variables.tourMode) return Actions.Tours();
    
    return Actions.TinderScene();    
  }

  async handleUserLogin(museums, chats, plan){  
    const { createChat } = this.props; 
    const objects = Array.from(museums.objects);
    const onboardingObject = objects.find((object) => object.onboarding);
    const finishedChats = chats.filter(chat => chat.finished);
    if(finishedChats.length >= 1) { 
      AsyncStorage.setItem('firstEntry', 'true'); 
      if(plan === variables.tourMode) return Actions.Tours();
      return Actions.TinderScene();
    }
    if(!onboardingObject) return Toaster.showMessage(strings.museumIsCurrently, ToasterTypes.ERROR);    
    if(onboardingObject) {
      const chat = await createChat(onboardingObject);
      return Actions.ChatsScene({ object: onboardingObject, chatID:chat.sync_id })
    }    
    return Toaster.showMessage(strings.museumIsCurrently, ToasterTypes.ERROR);
  }

  render() {
    const {type, museum, loading, loadingCaption, chosenMuseumLogo, currentlyLoadedObjects, totalLoadingObjects} = this.state;
    const percentage = parseInt(
      (currentlyLoadedObjects / totalLoadingObjects) * 100
    );
    let logo = {};
    if(museum.museumimages) logo = museum.museumimages.find( image => image.image_type === 'logo');
    const detect = () => {
      switch (type) {
        case 0: return <CouldntDetect handlePlanTourButton={() => this.handlePlanTourButton()} handleSelectMuseumButton={() => this.handleSelectMuseumButton()} />
        case 1: return (
          <DetectedMuseum
            title={getLocalization(museum.localizations, getDeviceLocale(), 'title')} logo={logo.image} 
            handleSelectMuseumButton={() => this.handleSelectMuseumButton()} museum_id={museum.sync_id}
            handleChooseMuseum={(museum_id, plan) => this.handleChooseMuseum(museum_id, plan)}
          />
        )
        case 2: return <DetectedOutside handlePlanTourButton={() => this.handlePlanTourButton()} handleSelectMuseumButton={() => this.handleSelectMuseumButton()} />
        default: return <Detecting />;
      }
    };
    
    return (
      <Scene
        navigator={false}
        isHaderShow={false}
        loading={loading}
        loadingCaption={loadingCaption}
        loadingPercentage={percentage}
        loadingLogo={chosenMuseumLogo}
      >
        {detect()}
      </Scene>
    );
  }
}

DetectLocation.propTypes = {
  setPlanMode: PropTypes.func.isRequired,
  setAllData: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  getSettings: PropTypes.func.isRequired,
  getMuseum: PropTypes.func.isRequired,
  sync: PropTypes.func.isRequired,
  setObject: PropTypes.func.isRequired,
  getChats: PropTypes.func.isRequired,
  setTour: PropTypes.func.isRequired,
  createChat: PropTypes.func.isRequired,
};

export default connect(() => ({ }) , { setPlanMode, setAllData, getUser, getSettings, getMuseum, sync, setObject, getChats, createChat })(DetectLocation);

export const Detecting = () => (
  <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
    <Image source={detecting} style={{width:200, height:200}} resizeMode="contain"  />
    <Text style={styles.main.locationTitleRow}>{strings.detecting}</Text>
  </View>
)


export const CouldntDetect = ({handlePlanTourButton, handleSelectMuseumButton}) => (
  <View style={{flex:1}}>
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Image source={notDetected} style={{width:200, height:200, transform:[{ rotate: '270deg'}]}} resizeMode="contain"  />
      <Text style={styles.main.locationTitleRow}>{strings.weCouldntDetect}</Text>
    </View>
    <View style={{padding:15}}>
      <Button containerStyle={{backgroundColor:colors.blue, marginVertical:10}} onPress={handlePlanTourButton} title={strings.planTour} />
      <Button containerStyle={{backgroundColor:'transparent', marginVertical:10}} onPress={handleSelectMuseumButton} title={strings.selectMuseum} />
    </View>
  </View>
)
CouldntDetect.propTypes = {handlePlanTourButton: PropTypes.func.isRequired, handleSelectMuseumButton: PropTypes.func.isRequired};

export const DetectedMuseum = ({title, logo, handleSelectMuseumButton, handleChooseMuseum, museum_id}) => (
  <View style={{flex:1}}>
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <ImageBackground source={detected} style={{width:200, height:200, alignItems:'center', justifyContent:'center'}} resizeMode="contain">
        <Image source={{uri:logo}} style={{width:240, height:50}} resizeMode="contain"  />
      </ImageBackground>
      <Text style={styles.main.locationTitleRow}>{`${strings.weDetectedThatYou} ${title}`}</Text>
    </View>
    <View style={{padding:15}}>
      <Button onPress={() => handleChooseMuseum(museum_id, 2)} title={strings.startTour} />
      <Button containerStyle={{backgroundColor:'transparent', marginVertical:10}} onPress={handleSelectMuseumButton} title={strings.areWeWrong} />
    </View>
  </View>
)
DetectedMuseum.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  museum_id: PropTypes.string.isRequired,
  handleSelectMuseumButton: PropTypes.func.isRequired,
  handleChooseMuseum: PropTypes.func.isRequired,
};
DetectedMuseum.defaultProps = {logo: '', title:''};

export const DetectedOutside = ({handleSelectMuseumButton, handlePlanTourButton}) => (
  <View style={{flex:1}}>
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Image source={detectedPlan} style={{width:200, height:200}} resizeMode="contain"  />
      <Text style={styles.main.locationTitleRow}>{strings.weDetectedThatYouOutside}</Text>
    </View>
    <View style={{padding:15}}>
      <Button containerStyle={{backgroundColor:colors.blue, marginVertical:10}} onPress={handlePlanTourButton} title={strings.planTour} />
      <Button containerStyle={{backgroundColor:'transparent', marginVertical:10}} onPress={handleSelectMuseumButton} title={strings.selectMuseum} />
    </View>
  </View>
)
DetectedOutside.propTypes = {handlePlanTourButton: PropTypes.func.isRequired, handleSelectMuseumButton: PropTypes.func.isRequired};