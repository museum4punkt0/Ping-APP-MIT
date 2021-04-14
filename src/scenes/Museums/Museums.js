import React, { Component } from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import Scene from "../../components/Scene";
import Text from '../../components/Text'
import NoMore from '../../components/Tinder/NoMore';
import Toaster, {ToasterTypes} from "../../components/Popup";
import { getMuseums } from '../../db/controllers/museums';
import { getMuseumsList, setAllData, getMuseum, setObject } from '../../actions/museums';
import { sync } from "../../actions/synchronize";
import { getSettings, getUser, updateUser } from "../../actions/user";
import { createChat, getChats } from "../../actions/chats";
import {convertToArray, getLocalization, getDeviceLocale} from '../../config/helpers'
import strings from '../../config/localization'
import styles, { colors } from '../../config/styles';
import variables from '../../config/constants'

class MuseumsScene extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        museums:[],
        loading:false,
        loadingCaption: '',
        totalLoadingObjects: 0,
        currentlyLoadedObjects: 0,
        chosenMuseumLogo: null,
     }
  }

  componentWillMount() {
    this.setState({loading:true});
    getMuseumsList()
      .then(museums => this.setState({museums}))
      .finally(() => this.setState({loading:false}))
  }

  updateTotalLoadingObjects(number) {
    this.setState({totalLoadingObjects: number})
  }

  incrementCurrentlyLoadedObjects() {
    this.setState((prevState, props) => ({
      currentlyLoadedObjects: prevState.currentlyLoadedObjects + 1
    }))
  }

  async handleChooseMuseum(museum_id){
    const { setAllData, getUser, getSettings, getMuseum, sync, setObject, getChats, plan, updateUser } = this.props;
    
    let { museums } = this.state
    const currentMuseum = museums.find(item => item.sync_id === museum_id)
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

    if (user) {
      const mainEntranceSection = museum.sections.filter(
        (section) => section.is_main_entrance
      )[0]
      updateUser({
        ...user,
        ...mainEntranceSection.exit_position,
        section: mainEntranceSection,
      });
    }

    
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
          AsyncStorage.setItem('museum', museum_id)
        )
      )
      .catch((err) =>
        Toaster.showMessage(
          strings.updatingError + ':' + err,
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

  async handleUserLogin(museums, chats){  
    const { createChat, plan } = this.props; 
    const objects = Array.from(museums.objects);
    const onboardingObject = objects.find((object) => object.onboarding);
    const finishedChats = chats.filter(chat => chat.finished);
    if(finishedChats.length >= 1) { 
      AsyncStorage.setItem('firstEntry', 'true'); 
      if(plan === variables.tourMode) return Actions.Tours();
      return Actions.TinderScene();
    }    
    if(!onboardingObject) return Actions.Tours();
    if(onboardingObject) {
      const chat = await createChat(onboardingObject);
      return Actions.ChatsScene({ object: onboardingObject, chatID:chat.sync_id })
    }    
    return Toaster.showMessage(strings.museumIsCurrently, ToasterTypes.ERROR);
  }

  render() {
    const {
      museums,
      loading,
      loadingCaption,
      currentlyLoadedObjects,
      totalLoadingObjects,
      chosenMuseumLogo,
    } = this.state;
    const percentage = parseInt(
      (currentlyLoadedObjects / totalLoadingObjects) * 100
    );
    return (
      <Scene
        label="Museums"
        backBtnFunc={() => Actions.pop()}
        loading={loading}
        loadingCaption={loadingCaption}
        loadingPercentage={percentage}
        loadingLogo={chosenMuseumLogo}
      >
        <ScrollView>
          {museums.map((museum) => {
            // let from_hour = '', to_hour = '';
            // if(museum.opennings) from_hour = museum.opennings.from_hour;
            // if(museum.opennings) to_hour = museum.opennings.to_hour;
            const image = convertToArray(museum.museumimages).find(
              (image) => image.image_type === "logo"
            );
            const logo = image ? image.image : "https://logo";
            return (
              <TouchableOpacity
                key={museum.sync_id}
                style={styles.main.museumsRowContainer}
                onPress={() => this.handleChooseMuseum(museum.sync_id)}
              >
                <View style={{ backgroundColor: colors.black }}>
                  <Image
                    source={{ uri: logo }}
                    style={{ width: 100, height: 73, alignSelf: "center" }}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.main.museumsRowDescriptionContainer}>
                  <View>
                    <Text style={styles.main.museumsRowTitle}>
                      {getLocalization(
                        museum.localizations,
                        getDeviceLocale(),
                        "title"
                      )}
                    </Text>
                    <Text style={styles.main.museumsRowDescription}>
                      {getLocalization(
                        museum.localizations,
                        getDeviceLocale(),
                        "specialization"
                      )}
                    </Text>
                  </View>
                  <Icon
                    name="keyboard-arrow-right"
                    size={24}
                    color={colors.white}
                  />
                  {/* <View key={museum.sync_id} style={{flexDirection:'row', marginTop:10, alignItems:'center'}}>
                    <Icon name='access-time' size={16} color='rgb(92,94,96)' /> 
                    <Text style={{color:'rgb(92,94,96)', fontSize:12, fontWeight:'bold', marginHorizontal:10}}>{`${from_hour} - ${to_hour}`}</Text>
                  </View> */}
                </View>
              </TouchableOpacity>
            );
          })}
          {museums.length === 0 && (
            <NoMore
              title={strings.noMuseums}
              description=""
              icon="m"
              containerStyle={{ marginTop: 25 }}
            />
          )}
        </ScrollView>
      </Scene>
    );
  }
}

MuseumsScene.propTypes = {
  setAllData: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  getSettings: PropTypes.func.isRequired,
  sync: PropTypes.func.isRequired,
  getMuseum: PropTypes.func.isRequired,
  createChat: PropTypes.func.isRequired,
  getChats: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  setObject: PropTypes.func.isRequired,
  plan: PropTypes.number.isRequired,
};

MuseumsScene.defaultProps = { }

export default connect(({plan}) => ({ plan:plan.plan }) , { setAllData, getUser, getSettings, sync, getMuseum, createChat, getChats, setObject, updateUser  })(MuseumsScene);
