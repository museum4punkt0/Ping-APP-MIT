import React, { Component } from 'react';
import { Image, View, Text as Icon } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import RNFetchBlob from "rn-fetch-blob";
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Picker from 'react-native-picker-select';
import Scene from "../components/Scene";
import Text from "../components/Text";
import Button from "../components/Button";
import Option from '../components/Profile/OptionContainer'
import logo from "../assets/images/logo.png";
import styles, { colors } from '../config/styles';
import strings from '../config/localization';
import constant from '../config/constants';
import { getUser, updateUser } from '../actions/user'

class LoaderScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAppStart:false,
      user:{}
    }
  }

  async componentWillMount() {
    const { getUser } = this.props;
    // console.warn(RNFetchBlob.fs.dirs)
    const user = await getUser();
    this.setState({user});

    const first = await AsyncStorage.getItem('firstEntry');
    if(!first) return this.setState({isAppStart:true});

    const chatSpeed = await AsyncStorage.getItem('speed');	
    if(!chatSpeed) AsyncStorage.setItem('speed', '1500');
    
    Actions.DetectLocation();
  }

  onUserChanged(key, value){
    const { updateUser } = this.props;
    const { user } = this.state;
    if(!value) return;
    this.setState({user: {...user, [key]: value}})
    if(key === 'language') strings.setLanguage(value); 
    updateUser({ ...user, [key]: value});
  }

  render() {
    const { isAppStart, user } = this.state;
    const {language, font_size} = user;
    return (
      <Scene navigator={false} isHaderShow={false}>
        <View style={{flex:1, justifyContent:'center'}}>
          <Image source={logo} style={{width: 150, height: 150, alignSelf:'center'}} resizeMode="contain"  />
          <Text style={styles.common.preloaderMessageDescription}>Mein Objekt</Text>
          {(isAppStart) && <AppStartComponent onUserChanged={this.onUserChanged.bind(this)} language={language} font_size={font_size} handleAppStart={() => Actions.AppGuideScreen()} />}
        </View>
      </Scene>
    );
  }
}

LoaderScene.propTypes = {
  getUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired
};

export default connect(() => ({ }), { getUser, updateUser })(LoaderScene);

const AppStartComponent = (props) => {
  // eslint-disable-next-line react/prop-types
  const {onUserChanged, language, handleAppStart, font_size} = props;
  return(
    <View style={{margin:15}}>
      <Option title={strings.chooseYourLanguage}>
        <Picker
          items={constant.lang}
          onValueChange={(value) => onUserChanged('language', value)}
          value={language}
          style={{ iconContainer:{ top: 5 }, inputIOS:{ paddingVertical:10, color:colors.white }, inputAndroid:{ color:colors.white} }}
          Icon={() => (<Icon style={{fontFamily:'meinobjekt', fontSize:24, color:colors.white}}>c</Icon>)}
          useNativeAndroidPickerStyle={false}
        />
      </Option>
      <Option title={strings.fontSizeLabel} style={{marginTop:5}}>
        <Picker
          items={constant.fontSizes}
          onValueChange={(value) => onUserChanged('font_size',value)}
          value={font_size}
          style={{ iconContainer:{ top: 5 }, inputIOS:{ paddingVertical:10, color:colors.white }, inputAndroid:{ color:colors.white} }}
          Icon={() => (<Icon style={{fontFamily:'meinobjekt', fontSize:24, color:colors.white}}>c</Icon>)}
          useNativeAndroidPickerStyle={false}
        />
      </Option>
      <Button containerStyle={{backgroundColor:colors.green, marginVertical:10}} onPress={handleAppStart} title={strings.appStart} />
    </View>
  )
}

AppStartComponent.propTypes = {
  onUserChanged: PropTypes.func.isRequired,
  handleAppStart: PropTypes.func.isRequired,
  language: PropTypes.string,
  font_size: PropTypes.string,
};

AppStartComponent.defaultProps = {
  language: strings.getLanguage(),
  font_size: "normal",
}