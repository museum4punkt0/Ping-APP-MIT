import React, { Component } from 'react';
import {
  Image,
  View,
  Text as Icon,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import Picker from 'react-native-picker-select';
import Scene from "../components/Scene";
import Text from "../components/Text";
import Button from "../components/Button";
import Option from '../components/Profile/OptionContainer'
import logo from "../assets/images/logo.png";
import styles, { colors } from '../config/styles';
import strings from '../config/localization';
import { getOptions, getOrSetAsyncStorageItem } from '../config/helpers';

class LoaderScene extends Component {
  constructor(props) {
    super(props);

    this.defaultLanguage = strings.getLanguage();
    this.defaultFontSize = 'normal';

    this.state = {
      isAppStart:false,
      language: this.defaultLanguage,
      font_size: this.defaultFontSize,
    }
  }

  async componentWillMount() {
    const first = await AsyncStorage.getItem('firstEntry');
    if (!first) {
      const language = await getOrSetAsyncStorageItem('language', this.defaultLanguage);
      const font_size = await getOrSetAsyncStorageItem('font_size', this.defaultFontSize);

      return this.setState({
        isAppStart: true,
        language,
        font_size
      });
    }

    const chatSpeed = await AsyncStorage.getItem('speed');	
    if(!chatSpeed) AsyncStorage.setItem('speed', '1500');
    
    Actions.DetectLocation();
  }

  onOptionsChange(key, value){
    AsyncStorage.setItem(key,value);
    if(key === 'language') strings.setLanguage(value); 
    this.setState({[key]: value})
  }

  render() {
    const { isAppStart, language, font_size } = this.state;
    return (
      <Scene navigator={false} isHaderShow={false}>
        <View style={{flex:1, justifyContent:'center'}}>
          <Image source={logo} style={{width: 150, height: 150, alignSelf:'center'}} resizeMode="contain"  />
          <Text style={styles.common.preloaderMessageDescription}>Mein Objekt</Text>
          {(isAppStart) && <AppStartComponent onOptionsChange={this.onOptionsChange.bind(this)} language={language} font_size={font_size} handleAppStart={() => Actions.AppGuideScreen()} />}
        </View>
      </Scene>
    );
  }
}

export default LoaderScene;

const AppStartComponent = (props) => {
  // eslint-disable-next-line react/prop-types
  const {onOptionsChange, language, handleAppStart, font_size} = props;
  const options = getOptions()

  return(
    <View style={{margin:15}}>
      <Option title={strings.chooseYourLanguage}>
        <Picker
          items={options.lang}
          onValueChange={(value) => onOptionsChange('language', value)}
          value={language}
          style={{ iconContainer:{ top: 5 }, inputIOS:{ paddingVertical:10, color:colors.white }, inputAndroid:{ color:colors.white} }}
          Icon={() => (<Icon style={{fontFamily:'meinobjekt', fontSize:24, color:colors.white}}>c</Icon>)}
          useNativeAndroidPickerStyle={false}
        />
      </Option>
      <Option title={strings.fontSizeLabel} style={{marginTop:5}}>
        <Picker
          items={options.fontSizes}
          onValueChange={(value) => onOptionsChange('font_size',value)}
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
  handleAppStart: PropTypes.func.isRequired,
  language: PropTypes.string,
  font_size: PropTypes.string,
};

AppStartComponent.defaultProps = {
  language: strings.getLanguage(),
  font_size: "normal",
}