import { Platform, NativeModules, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs'
import {PERMISSIONS} from 'react-native-permissions';
import Toaster, {ToasterTypes} from "../components/Popup";
import strings from "./localization"
import variables from "./constants"

export const convertToArray = ( object ) => {
  let array = object || [];
  if(typeof object === 'object') array = Array.from(object);
  return array;
}

export const calculateTotalObjectsToLoad = (museum, settings) => {
  let total = museum
    ? museum.objects.length +
      museum.objects.filter(item => item.cropped_avatar).length +
      museum.objects.reduce((sum, item) => item.images ? sum + item.images.length : sum , 0) +
      museum.objects.reduce((sum, item) => item.localizations ? sum + item.localizations.length : sum, 0) +
      museum.images.length +
      museum.sections.length
    : 0;

  total += settings
    ? settings.predefined_avatars.length
    : 0;

  return total
}

export const updateArrayItem = (array, item, key = 'sync_id') => {
  const result = [...array];
  const index = result.findIndex(i => i[key] === item[key]);
  if(index !== -1) result[index] = {...result[index], ...item};
  return result;
};

export const chunkArray = (myArray, chunk_size) => {
  const tempArray = [];
  
  for (let index = 0; index < myArray.length; index += chunk_size) {
      myChunk = myArray.slice(index, index+chunk_size);
      tempArray.push(myChunk);
  }
  return tempArray;
}

export const updateItemOrPush = (array, item, key = 'sync_id') => {
  const result = [...array];
  const index = result.findIndex(i => i[key] === item[key]);
  if(index !== -1) result[index] = {...result[index], ...item};
  if(index === -1) result.push(item);
  return result
};

export const getLocalization = (object, lang, key = 'title') => {
  let result = null;
  let array = object || [];
  if(typeof object === 'object') array = Array.from(object);
  const localization = array.find(item => item.language === lang)
  if(localization) return localization[key];
  if(array[0]) result = array[0][key];
  return result;
};

export const showToast = async (item = '', string) => {
  const storageItem = await AsyncStorage.getItem(item);
  if(storageItem) return false;
  Toaster.showMessage(string, ToasterTypes.SUCCESS);
  AsyncStorage.setItem(item,'true');
  return true
}

export const getStorageItem = async (item = '') => {
  const storageItem = await AsyncStorage.getItem(item);
  if(!storageItem) AsyncStorage.setItem(item,'true');
  return storageItem;
}

export const showToObject = async () => {
  let currentValue = await AsyncStorage.getItem('toObject');
  currentValue = +JSON.parse(currentValue) + 1;
  await AsyncStorage.setItem('toObject', JSON.stringify(currentValue));
}

export const getImage = (sync_id) => Platform.OS === 'android' ? 
'file://' + RNFS.DocumentDirectoryPath + "/images/" + sync_id + ".jpg" 
: RNFS.DocumentDirectoryPath + "/images/" + sync_id + ".jpg";

export const calculateMessageDelay = (message = '', minimumDelay, divider = 4) => {
  // calculate delay to show the next messages (reading delay)
  const wordCount = message.split(' ').length;
  const messageDelay = (wordCount / divider * 1000) < minimumDelay ? minimumDelay : (wordCount / divider * 1000);
  return messageDelay;
}

export const planString = (plan, isFromPlanScene=false) => {
  switch(plan){   
      case variables.planMode: return isFromPlanScene ? strings.completePlan : strings.quitPlan;
      case variables.tourMode: return strings.quitTour;
      case variables.discoverMode: return strings.quitDiscovery;
      case variables.plannedTourMode: return strings.quitPlannedTour;
      default: return strings.quit;      
  }
};

export const getDeviceLocale = () => Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLanguages ? NativeModules.SettingsManager.settings.AppleLanguages[0].split('-')[0] : 'en'
    : NativeModules.I18nManager.localeIdentifier.split('-')[0].split('_')[0]; 

export const getPermission = (type = 'location') => {
  switch (type) {
    case 'location': return   Platform.select({
      ios:PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    })
    case 'camera': return   Platform.select({
      ios:PERMISSIONS.IOS.CAMERA,
      android:PERMISSIONS.ANDROID.CAMERA
    });
    case 'photo': return   Platform.select({
      ios:PERMISSIONS.IOS.PHOTO_LIBRARY,
      android:PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
    });
    default: return   Platform.select({
      ios:PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    });
  }
}

export const getTourLocalization = (plan) => {
  const currentLanguage = strings.getLanguage();
  switch(plan){
      case 1:
          return {localizations:[{title:strings.planMode, language:currentLanguage}]}
      case 2:
          return {localizations:[{title:null, language:currentLanguage}]}
      case 3:
          return {localizations:[{title:strings.discover, language:currentLanguage}]}
      case 4:
          return {localizations:[{title:strings.plannedTour, language:currentLanguage}]}
      default:
          return {localizations:[{title:strings.discover, language:currentLanguage}]}
  }
}

export const scale = size => {
  const { width, height } = Dimensions.get("window");
  const guidelineBaseWidth = 350;
  return width / guidelineBaseWidth * size;
}
export const getOptions = () => ({
  lang: [
    { label: "English", value: "en", key: "en" },
    { label: "Deutsch", value: "de", key: "de" },
  ],
  fontSizes: [
    { label: strings.fontSizesNormal, value: "normal", key: "normal" },
    { label: strings.fontSizesBig, value: "big", key: "big" },
    { label: strings.fontSizesLarge, value: "large", key: "large" },
  ],
  chatInterval: [
    { label: strings.chatInervalsAuto, value: "", key: "auto" },
    { label: strings.chatInervalsSlow, value: "2300", key: "slow" },
    { label: strings.chatInervalsNormal, value: "1500", key: "normal" },
    { label: strings.chatInervalsFast, value: "800", key: "fast" },
    { label: strings.chatInervalsVeryFast, value: "300", key: "very fast" },
  ],
});

export const format_url_for_linking = url => url.startsWith('http') ? url : 'http://' + url