import React from 'react';
import { View, Modal, Image, TouchableOpacity,Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageZoom from 'react-native-image-pan-zoom';
import PropTypes from 'prop-types';
import Text from "../Text"
import strings from '../../config/localization';
import { colors, IOSpadding } from '../../config/styles';
import { ToastView } from '../Popup';
import { getStorageItem } from '../../config/helpers';
import { SafeAreaView } from 'react-native';

class ZoomImageDialog extends React.Component {
  state = {
    isShowToast: false,
  }

  componentDidMount = () => {
    getStorageItem('zoomIn').then(value => {
      this.setState({
        isShowToast: !value,
      });
    })
  }

  render() {
    const {image, imageView, visible, onRequestClose} = this.props;
    const {isShowToast} = this.state;
    return (
      <Modal visible={visible} onRequestClose={onRequestClose} transparent={false}>
        <SafeAreaView style={{backgroundColor:colors.black}} onTouchStart={() => this.setState({isShowToast: false})}>
          <TouchableOpacity onPress={onRequestClose} style={{backgroundColor:'rgba(0,0,0,0.5)', width:'100%', flexDirection:'row', alignItems:'center', paddingVertical:10}}>
            <Icon color={colors.white} name="arrow-back" size={24} style={{marginHorizontal:10}} />
            <Text style={{color:colors.white}}>{strings.back}</Text>
          </TouchableOpacity>
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height}
            enableSwipeDown
            onSwipeDown={onRequestClose}
            imageWidth={Dimensions.get('window').width}
            imageHeight={Dimensions.get('window').height}
          >
            {image ? <Image style={{flex:1}} resizeMode="contain" source={{uri:image}} /> : imageView}
          </ImageZoom>
        </SafeAreaView>
        {isShowToast ? <ToastView message={strings.zoomIn} style={{position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: colors.green}} /> : null}
      </Modal>
    )
  }
}

    
ZoomImageDialog.propTypes = {
    image: PropTypes.string,
    imageView: PropTypes.node,
    visible: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired
};
ZoomImageDialog.defaultProps = {
  image: null,
  imageView:null
};
  
export default ZoomImageDialog;

export const ZoomImage = (props) => {
  const {image, imageView} = props;
  return (
    <View style={{flex:1, borderWidth:2, borderColor:'red'}}>      
      <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        enableSwipeDown={false}
        imageWidth={Dimensions.get('window').width}
        imageHeight={Dimensions.get('window').height}
      >
        {image ? <Image style={{flex:1}} resizeMode="contain" source={{uri:image}} /> : imageView}
      </ImageZoom>
    </View>
  )
}

  
ZoomImage.propTypes = {
  image: PropTypes.string,
  imageView: PropTypes.node
};
ZoomImage.defaultProps = {
  image: null,
  imageView:null
};