import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Confetti from 'react-native-confetti';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import Scene from "../../components/Scene";
import Text from "../../components/Text";
import CongratulationsDialog from "../../components/Dialogs/CongratulationsDialog";
import Dialog from "../../components/Dialogs/Dialog";
import Toaster, {ToasterTypes} from "../../components/Popup";
import styles, { colors } from '../../config/styles';
import { convertToArray, getLocalization, getImage, showToast, showToObject, getStorageItem } from '../../config/helpers';
import { getObjects } from '../../db/controllers/museums';
import { getCollections, createCollection } from '../../actions/collections';
import { getUser, updateUser } from '../../actions/user';
import strings from '../../config/localization';
import Tips from '../../components/Tips';

const MAX_OPENING = 2;

class CollectionScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories:[],
      user:{},
      categoryID:'',
      congratulationsDialog:false,
      isModalOpen:false,
      confetti:false,
      position: {
        horizontal: 1,
        vertical: 1
      },
      isVisible: false,
      title: ''
    }
    this.dialog = { isActive:true }
  }
  
  async componentWillMount() {
    const { getCollections, createCollection, image, object, getUser, settings, categories } = this.props;
    const collections = getCollections();
    const user = getUser();
    const categoriesCollectionArray = [];
    const maxCategoryLevel = Math.max(...categories.map(category => category.category_level));
    let level = user.level;
    for(let i=0; i < categories.length; i++){
      const object_ids = convertToArray(categories[i].sync_object_ids);
      let category_id = null, newCollection = null;
      if(object && image && object_ids) category_id = object_ids.find(item => item === object.sync_id);   
      categories[i].collections = collections.filter(collection => collection.category_id === categories[i].sync_id); 
      if(category_id) newCollection = await createCollection({image, object_id: object.sync_id, category_id: categories[i].sync_id});
      if(newCollection) categories[i].collections.push(newCollection);
      if(newCollection && categories[i].collections.length === 3) this.setState({congratulationsDialog:true});
      if(categories[i].collections.length >= 3) {
        level++;
        if(newCollection) {
          this.updateUserLevel(user, level)
          
          if(level <= maxCategoryLevel)
          this.setState({
            isVisible: true,
            title: strings.newCategoryUnlocked,
            position: {
              horizontal: 1,
              vertical: 0.7
            }
          });
        }
      }
      for(let c = categories[i].collections.length; c < 3; c++) categories[i].collections.push({sync_id:c});
      
      if(categories[i].category_level <= user.level) categoriesCollectionArray.push(categories[i]);
    }

    const redirection_timout = settings.redirection_timout*1000;
    
    let sorted_categories = categoriesCollectionArray.sort(
      (a, b) => b.category_level - a.category_level
    )
    if(object){
      const rightCategory = sorted_categories.filter(category => convertToArray(category.sync_object_ids).includes(object.sync_id))[0]
      sorted_categories = [rightCategory, ...sorted_categories.filter(category => !convertToArray(category.sync_object_ids).includes(object.sync_id))]
    }

    setTimeout(() => this.dialog.isActive && this.setState({isModalOpen:true}), redirection_timout || 5000)
    this.setState({
      categories: sorted_categories,
      user,
      categoryID: user.category,
    });
    
    this.showToast()
  }

  startConfetti() {
    if(this._confettiView) {
      this._confettiView.startConfetti();
    }
  }

  componentWillUnmount ()
  {
      if (this._confettiView)
      {
          this._confettiView.stopConfetti();
      }
  }

  showFirstCollectionTips(){
    setTimeout(() => {
      getStorageItem('tappingTip').then(value => {
        this.setState({
          isVisible: typeof value !== 'string',
          title: strings.tappingOnTheObject
        });
      });
      setTimeout(() => {
        getStorageItem('allObjectsBelongTip').then(value => {
          this.setState({
            isVisible: typeof value !== 'string',
            title: strings.allObjectsBelong
          });
        });
      }, 5500)
    }, 5500)
  }

  showTwoObjectsInCategoryTips(){
    getStorageItem('twoObjectsTip').then(value => {
      this.setState({
        isVisible: typeof value !== 'string',
        title: strings.youHaveTwoObjects
      });
    });
    setTimeout(() => {
      getStorageItem('collectMoreTip').then(value => {
        this.setState({
          isVisible: typeof value !== 'string',
          title: strings.toCollectMore
        });
      });
    }, 5500)
  }

  async showToast(){
    let {categories} = this.state;
    categories = convertToArray(categories)
    
    let x = 0;
    let y = convertToArray(categories[x].collections).findIndex(collection => !collection.category_id);

    this.setState({position: {vertical: x + 1, horizontal: y}});
    
    // First time adding an object to a collection
    if(!await getStorageItem('firstCollection')){
      this.showFirstCollectionTips();
    } 

    // First object in a new category
    if (y == 1) {
      this.setState({
        isVisible: true,
        title: strings.startCollection,
      });
    }

    // Second object in a category (1 more and level up)
    if(y === 2){
      this.showTwoObjectsInCategoryTips();
    }
  }

  updateUserLevel(user, level){
    const { updateUser } = this.props;
    updateUser({ ...user, level, levelup:true });
  }

  componentWillUnmount(){
    const { updateUser, getCollections, getUser } = this.props;
    const collections = getCollections();
    const user = getUser();
    this.dialog.isActive = false;
    updateUser({ ...user, collections });
  }

  hundleCheckBoxPress(categoryID, checked, title){
    const { updateUser } = this.props;
    const { user } = this.state;
    if(!checked) {showToast('firstFilterTip', strings.greatYouSelected); Toaster.showMessage(`${strings.filterFor} ${title} ${strings.set}`, ToasterTypes.SUCCESS)}
    updateUser({ ...user, category:categoryID });
    this.dialog.isActive = false;
    this.setState({ categoryID })
  } 
  // eslint-disable-next-line
  handleCollectionButtonPress(collection){
    const objects = convertToArray(getObjects());
    const object = objects.find(object=>object.sync_id===collection.object_id);
    this.dialog.isActive = false;
    if(collection.image && object) Actions.ObjectInfoScene({collection, object})
  }

  render() {
    const {categories, categoryID, user, congratulationsDialog, isModalOpen, confetti, isVisible, title, position} = this.state;
    return (
      <Scene label={strings.collection} isFooterShow index={4}>
        {isVisible ? <Tips title={title} visible={isVisible} onRequestClose={() => this.setState({isVisible: false, confetti: true}, () => this.startConfetti())} screen='collection' position={position} /> : null}
        <CongratulationsDialog visible={congratulationsDialog} onRequestClose={()=>this.setState({congratulationsDialog:!congratulationsDialog})} />
        {AsyncStorage.getItem('toObject').then(value => value) <= MAX_OPENING ? <Dialog visible={isModalOpen} onRequestClose={()=>{this.setState({isModalOpen:false}); showToObject();}} onPress={Actions.TinderScene} bodyText={strings.youWill} btnTetx={strings.toObject} /> : null}
          {confetti && 
            <View pointerEvents='none' style={{position:'absolute', zIndex: 1000, width: '100%', height: '100%'}}>
              <Confetti ref={(node) => this._confettiView = node} duration={5000} timeout={20} confettiCount={100}/>
            </View>
          }
        <ScrollView>
          {categories.map( category => {
            const complieted = typeof category.collections === 'object' && category.collections.filter(item=>item.image).length;
            const checked = categoryID === category.sync_id;
            return(
              <View key={category.sync_id} style={[complieted >= 3 && {backgroundColor:'rgba(42,158,99,0.2)'}, {borderBottomWidth:0.5, borderColor:colors.dark}]}>
                <View style={styles.main.collectionTitleContainer}>
                  <Text style={styles.chat.optionsTitle}>{getLocalization(category.localizations, user.language, 'title')}</Text>
                  {complieted >= 3 ?
                    <View style={styles.main.collectionCompletedContainer}><Text style={styles.main.collectionCompletedLabel}>{strings.completed.toUpperCase()}</Text></View>
                    :<CheckBox value={checked} onValueChange={() => this.hundleCheckBoxPress( checked ? '' : category.sync_id, checked, getLocalization(category.localizations, user.language, 'title') )} />}
                </View>

                <ScrollView horizontal contentContainerStyle={{alignItems:'center'}} style={styles.main.collectionContainer}>
                  {category.collections.map(collection => (
                    <TouchableOpacity style={{margin:15}} key={collection.sync_id} onPress={() => {this.handleCollectionButtonPress(collection)}}>
                      <Image style={styles.main.collectionImage} source={collection.image ? {uri: getImage(collection.image)} : require('../../assets/images/object.png')} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )
          })}
        </ScrollView> 
      </Scene>
    );
  }
}

CollectionScene.propTypes = {
  getCollections: PropTypes.func.isRequired,
  createCollection: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  object: PropTypes.object,
  image: PropTypes.string
};

CollectionScene.defaultProps = {
  object:null,
  image:null
}

export default connect(({ user, museums }) => ({ settings: user.settings, categories: museums.categories  }) , {getCollections, createCollection, updateUser, getUser})(CollectionScene);

export const CheckBox = (props)=>{
  const {value, onValueChange} = props;
  return(
    <TouchableOpacity {...props} onPress={onValueChange}>
      {value ? <Icon color={colors.green} name="check-circle" size={24} /> : <View style={{width:24, height:24, borderRadius:12, backgroundColor:colors.darkGrey}} /> }
    </TouchableOpacity>
  )
}
CheckBox.propTypes = {
  value: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired
};