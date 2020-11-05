import React, {Component,} from 'react';
import { TouchableOpacity, Image, View, ImageBackground, Platform } from 'react-native';
import PropTypes from 'prop-types';
// import n_mark from '../assets/images/chatObj.png';
// import c_mark from '../assets/images/collectionObj.png';
// import s_mark from '../assets/images/semanticObj.png';
// import object from '../assets/images/object.png';
import {getImage} from '../config/helpers';
import { colors } from '../config/styles';

class MapImage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        ratio:0,
        width:0,
        height:0,
        random: new Date(),
      }
    }

    onViewLayout = (event) => {
      const {width, height } = event.nativeEvent.layout;
      // eslint-disable-next-line no-invalid-this
      const { map } = this.props;
      Image.getSize(getImage(map.image), (w, h) => {        
        const kofX = width / w, kofY = height / h;
        const ratio = Math.min(kofX, kofY);
        const imgWidth = w*ratio, imgHeight = h*ratio;
        // eslint-disable-next-line no-invalid-this
        this.setState({width:imgWidth, height:imgHeight, ratio })
      })
    }

    getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))
  
    render(){
      const {map, handleOpenInfoPage} = this.props;
      const { width, height, ratio} = this.state;
      // const getPosition = (position) => { switch (position) { case 0: return 'center'; case 1: return 'flex-end'; case 2: return 'flex-start'; default: return 'center' } };
      // console.warn(map.markers )
      const markerImage = (marker) => {
        const {cropped_avatar, avatar} = marker;
        switch (marker.type) {
          case 1: return <View style={{ width:40, height:40, backgroundColor:colors.greenWithOpacity, borderColor:colors.green, borderWidth:4, borderRadius:25 }} />;// Searched Object
          // case 1: return <View style={{ width:50, height:50, backgroundColor:'rgba(42,158,99,0.5)', borderRadius:25}} />;
          //case 1: return <Image source={{uri: getImage(cropped_avatar || avatar)}} style={{width:30, height:30, borderColor:colors.green, borderRadius:15, borderWidth:4}} />; // Searched Object
          // case 2: return <ImageBackground source={c_mark} style={{ width:30, height:30, alignItems:'center' }}><Image source={object} style={{ width:12, height:12, marginTop:5}} /></ImageBackground>;
          case 2: return <Image source={{uri: getImage(avatar)}} style={{ width:30, height:30, borderColor:colors.gray, borderRadius:15, borderWidth:2 }} /> // Object in collection
          //case 3: return <View style={{ width: 40, height: 40, backgroundColor: colors.yellow, activeOpacity: 0.3, borderColor: colors.yellow, borderWidth:2, borderRadius: 25}} />;
          case 3: return <Image source={{uri: getImage(cropped_avatar || avatar)}} style={{ width:30, height:30, borderColor:colors.yellow, borderRadius:15, borderWidth:2}} /* source={s_mark}*/ />; // Semantic relation object 
        }
      };
      const searchedObject = map.markers.find(obj=>obj.type === 1)
      const marker = (object) =>(
        <TouchableOpacity onPress={() => handleOpenInfoPage(object)} style={{ position:'absolute',  right:10, top:10}}>
          <Image source={{uri: getImage(object.cropped_avatar || object.avatar)}} style={{width:70, height:70, borderColor:colors.green, borderWidth:4}} resizeMode='cover' />
        </TouchableOpacity>
      )
      return(
        <View onLayout={this.onViewLayout} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <ImageBackground source={{uri: getImage(map.image) + (Platform.OS === 'ios' ? '' : '?' + this.state.random)}} style={{ width, height }}>
            {searchedObject && marker(searchedObject)}
            {map.markers && map.markers.map(marker => (
              <TouchableOpacity
                key={marker.sync_id} onPress={() => handleOpenInfoPage(marker)} activeOpacity={0.1}
                style={{ position:'absolute', width:30, height:30, left:marker.positionX*ratio - 15, top:marker.positionY*ratio - 15}}
              >
                {markerImage(marker)}
              </TouchableOpacity>
            ))}
          </ImageBackground>
        </View>
      )
    }
}
  
MapImage.propTypes = {
    map: PropTypes.object.isRequired,
    handleOpenInfoPage:PropTypes.func.isRequired
};
export default MapImage;