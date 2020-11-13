import React, {Component} from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Scene from '../../components/Scene'
import Text from '../../components/Text'
import Swiper from '../../components/Tinder/Swiper'
import ZoomImageDialog from '../../components/Dialogs/ZoomImageDialog'
import MapImage from '../../components/Map'
import StartChatDialog from "../../components/Chat/StartChatDialog";
import { getCollections, setCurrentSemanticRelations } from '../../actions/collections';
import { createChat } from "../../actions/chats";
import styles, {Shadow, colors} from '../../config/styles'
import {convertToArray, getStorageItem} from '../../config/helpers'
import strings from '../../config/localization';
import Tips from '../../components/Tips';

class DiscoverScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images:[],
      floor:1,
      isZoomImageDialogShow:false,
      image:{image:''},
      startChatDialog:false,
      object:{},
      isModalOpen: false,
      swipeModalTitles: [
        strings.youCanSwipe,
        <>
          <Image style = {{alignSelf: 'center', width: 200, height: 200, resizeMode : 'stretch' }} source={{uri: 'https://hub.teamvoy.com/mein-object/board/uploads/1a736b775a48a77e433369099f08b173/tenor.gif'}} /> 
          <Text style={styles.main.dialogContentText}>{strings.youCanZoom}</Text>
        </>
      ],
      swipeModalPositions: [
        { vertical: 0, horizontal: 600},
        { vertical: 200, horizontal: 400}
      ],
      swipeModalPosition: { vertical: 0, horizontal: 600 },
      swipeModalTitle: strings.youCanSwipe,
      isSwipeModalOpen: false,
      position: {
        vertical: 0,
        horizontal: 0
      }
    }
  }

  componentWillMount(){
    const {museums, searchedObject, getCollections, objects, object, currentSemanticRelations, setCurrentSemanticRelations} = this.props;
    let images = [];
    const collections = getCollections();

    museums.images.forEach(item => {
      const image = {...item}
      const floorArray = image.image_type.split('_')[0]
      if(floorArray.length > 2) return true;      
      const floor = parseInt(image.image_type.split('_')[0]), type = image.image_type.split('_')[1];
            
      const collectionArr = [];
      collections.forEach(collection => {
        const obj = objects.find(object => (object.floor === floor && object.sync_id === collection.object_id))
        if(obj) collectionArr.push({...obj, collection, type:2})
      });

      if(searchedObject && searchedObject.floor === floor){
        collectionArr.push({...searchedObject, type:1});
        const semanticRelations = []
        if(searchedObject.semantic_relations) convertToArray(searchedObject.semantic_relations)
          .forEach(item => {
            const object = objects.find(object => object.sync_id === item.object_item_id);
            if(object && (!collectionArr.find(object => object.sync_id === item.object_item_id)))
            semanticRelations.push({ description:item.localization, type:3, ...object});
          })
        setCurrentSemanticRelations(semanticRelations)
      }
      images.push({...image, floor, type, markers:collectionArr.concat(Object.keys(searchedObject).length || object ? [] : currentSemanticRelations)});
    });

    if(object) {
      this.setState({images: images.sort((a, b) => Math.abs((a.floor - object.floor)) - Math.abs((b.floor - object.floor)))});
    } else {
      this.setState({images: images.sort((a, b) => a.floor - b.floor)});
    }

    getStorageItem('firstDiscoverySwipe').then(value => {
      this.setState({
        isSwipeModalOpen: typeof value !== 'string',
      });
    })
    

    if (object) {
      let position = {};
      images.map(i => i.markers.map(m =>  {
        position = {
          horizontal: m.positionX,
          vertical: m.positionY
        }
        return true;
      }));
      getStorageItem('firstDiscovery').then(value => {
        this.setState({
          isModalOpen: typeof value !== 'string',
          position
        });
      });
    }
  }

  showFoundButton() {
    const {object, chatID} = this.props;
    if (object && chatID) {
      return (
        <View style={{ backgroundColor: colors.black, paddingVertical:7, borderTopWidth:0.5 }}>
          <TouchableOpacity style={[styles.chat.chatButton, Shadow]} onPress={() => Actions.ChatsScene({object, chatID, from: 'MAP'})}>
            <Text style={styles.chat.optionsTitle}>{strings.iFound}</Text>
          </TouchableOpacity> 
        </View>
      )
    }
  }

  handleOpenInfoPage(marker){
    if(marker.type === 1) return this.setState({image: {image: marker.cropped_avatar || marker.avatar, markers: []}, isZoomImageDialogShow:true})
    if(marker.type === 2) Actions.ObjectInfoScene({collection:marker.collection, object:marker});
    if(marker.type === 3) this.setState({object:marker, startChatDialog:true});
    this.setState({isZoomImageDialogShow:false})
  }

  handleNextSwipeMessage(index) {
    const { swipeModalTitles, swipeModalPositions } = this.state;
    if(index == swipeModalTitles.length - 1) {
      return this.setState({isSwipeModalOpen: false})
    }
    return this.setState({isSwipeModalOpen: false}, () => setTimeout(() => this.setState({isSwipeModalOpen: true, swipeModalTitle: swipeModalTitles[index + 1], swipeModalPosition: swipeModalPositions[index + 1]}), 50))
  }

  async handleStartConversationPress(object){
    const { createChat, chats } = this.props;
    let chat = {};
    chat = chats.find(item => item.object_id === object.sync_id);
    if(!chat) chat = await createChat(object);
    this.setState({startChatDialog:false})
    Actions.ChatsScene({ chatID:chat.sync_id, object:{...object, from:'TinderScene'} })
  }

  render() {
    const {images, floor, isZoomImageDialogShow, image, startChatDialog, object, isModalOpen, position, isSwipeModalOpen, swipeModalTitle, swipeModalTitles, swipeModalPosition} = this.state;
    const currentSelectIndex = (floor <= images.length) ? floor - 1 : -1;
    return (
      <Scene label={strings.discover} isFooterShow index={3}>    
        {isModalOpen ? <Tips screen='discoverRooms' visible={isModalOpen} onRequestClose={()=>this.setState({isModalOpen:false})} title={strings.youAreInvited} position={position} /> : null}
        {isSwipeModalOpen ? <Tips screen='discoverRooms' visible={isSwipeModalOpen} onRequestClose={()=>this.handleNextSwipeMessage(swipeModalTitles.indexOf(swipeModalTitle))} title={swipeModalTitle} position={swipeModalPosition} /> : null}

        <Swiper           
          style={{ flex: 1 }}
          currentSelectIndex={currentSelectIndex}
          swipeData={images}
          renderSwipeItem={(map) => (
            <TouchableOpacity style={{flex:1}} onPress={() => this.setState({image:map, isZoomImageDialogShow:true})} activeOpacity={0.8}>
              <MapImage map={map} handleOpenInfoPage={(marker) => this.handleOpenInfoPage(marker)} />
            </TouchableOpacity>
          )}
        />
        <ZoomImageDialog
          visible={isZoomImageDialogShow}
          onRequestClose={() => this.setState({isZoomImageDialogShow:!isZoomImageDialogShow})}
          imageView={(<MapImage map={image} handleOpenInfoPage={(marker) => this.handleOpenInfoPage(marker)} />)}
        />
        <StartChatDialog 
          visible={startChatDialog} 
          onRequestApply={() => this.handleStartConversationPress(object)}
          onRequestClose={() => this.setState({startChatDialog:!startChatDialog})}
          object={object}
          title={strings.startChat}
        />
        { this.showFoundButton() }
      </Scene>
    );
  }
}


export default connect(({
  museums,
  chats,
  collections
}) => ({
  museums: museums.museums,
  objects: museums.objects,
  searchedObject: museums.object,
  chats: chats.chats,
  currentSemanticRelations: collections.currentSemanticRelations,
}), {
  getCollections,
  createChat,
  setCurrentSemanticRelations,
})(DiscoverScreen);


DiscoverScreen.propTypes = {
  museums: PropTypes.object.isRequired,
  getCollections: PropTypes.func.isRequired,
  objects: PropTypes.array.isRequired,
  createChat:PropTypes.func.isRequired,
  chats: PropTypes.array.isRequired,
  searchedObject: PropTypes.object,
  object: PropTypes.object,
  chatID: PropTypes.string,
  currentSemanticRelations: PropTypes.array.isRequired,
  setCurrentSemanticRelations: PropTypes.func.isRequired,
};

DiscoverScreen.defaultProps = {
  searchedObject:null,
  object: null,
  chatID:null
};
  
