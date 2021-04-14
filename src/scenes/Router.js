import React from 'react';
import { Router, Scene, ActionConst } from "react-native-router-flux";
import PreloaderScene from "./Preloader";
import AppGuideScreen from "./Onboarding/AppGuide";
import MuseumsScene from "./Museums/Museums";
import DetectLocation from "./Museums/DetectLocation";
import Tours from "./Museums/Tours";
import TinderScene from "./Objects/Tinder";
import MatchScene from "./Objects/MatchScreen";
import ChatsScene from "./Chats/Chat";
import ChatsListScene from "./Chats/ChatsList";
import CollectionScene from "./Collection/Collection";
import ObjectInfoScene from "./Collection/ObjectInfo";
import ProfileInfoScene from "./Profile/ProfileInfo";
import DiscoverScreen from "./Discover/DiscoverRooms";
import PlanScene from "./Plan/Plan";
import CameraScene from "./Camera/Camera";
import PhotoScene from "./Camera/Photo";

const RouterComponent = () => (
  <Router>
    <Scene key="root" hideNavBar> 

      <Scene
        type={ActionConst.RESET}
        key="PreloaderScene"          
        component={PreloaderScene}
      />

      <Scene
        key="MuseumsScene"          
        component={MuseumsScene}
      />

      <Scene
        type={ActionConst.RESET}
        key="DetectLocation"          
        component={DetectLocation}
        // initial
      />

      <Scene
        key="Tours"          
        component={Tours}
        // initial
      />

      <Scene
        type={ActionConst.RESET}
        key="AppGuideScreen"          
        component={AppGuideScreen}
      /> 

      <Scene
        key="ChatsScene"          
        component={ChatsScene}
        type={ActionConst.RESET}
      />

      <Scene        
        key="ChatsListScene"       
        component={ChatsListScene}
        type={ActionConst.RESET}
      />

      <Scene
        key="TinderScene"          
        component={TinderScene}
        type={ActionConst.RESET}
      /> 

      <Scene
        key="DiscoverScreen"          
        component={DiscoverScreen}
        type={ActionConst.RESET}
      />   

      <Scene
        key="CollectionScene"          
        component={CollectionScene}
        type={ActionConst.RESET}
      />    

      <Scene
        key="ProfileInfoScene"          
        component={ProfileInfoScene}
        type={ActionConst.RESET}
      /> 

      <Scene
        key="CameraScene"          
        component={CameraScene}
      /> 

      <Scene
        key="PhotoScene"          
        component={PhotoScene}
      /> 

      <Scene
        key="ObjectInfoScene"          
        component={ObjectInfoScene}
      />  

      <Scene
        key="MatchScene"          
        component={MatchScene}
      />  

      <Scene
        key="PlanScene"          
        component={PlanScene}
        type={ActionConst.RESET}
      />       
  

    </Scene>
  </Router>
);
export default RouterComponent;