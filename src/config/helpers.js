import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from "rn-fetch-blob";
import {PERMISSIONS} from 'react-native-permissions';
import Toaster, {ToasterTypes} from "../components/Popup";

export const convertToArray = ( object ) => {
  let array = object || [];
  if(typeof object === 'object') array = Array.from(object);
  return array;
}

export const updateArrayItem = (array, item, key = 'sync_id') => {
  const result = [...array];
  const index = result.findIndex(i => i[key] === item[key]);
  if(index !== -1) result[index] = {...result[index], ...item};
  return result;
};

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
'file://' + RNFetchBlob.fs.dirs.DocumentDir + "/images/" + sync_id + ".jpg" 
: RNFetchBlob.fs.dirs.DocumentDir + "/images/" + sync_id + ".jpg";

export const calculateMessageDelay = (message = '', minimumDelay, divider = 4) => {
  // calculate delay to show the next messages (reading delay)
  const wordCount = message.split(' ').length;
  const messageDelay = (wordCount / divider * 1000) < minimumDelay ? minimumDelay : (wordCount / divider * 1000);
  return messageDelay;
}

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

export const format_url_for_linking = url => url.startsWith('http') ? url : 'http://' + url