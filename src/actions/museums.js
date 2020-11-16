import { Platform } from 'react-native';
import RNFetchBlob from "rn-fetch-blob";
import DeviceInfo from 'react-native-device-info';
import axios from 'axios/index';
import { museumsTypes } from './types';
import remote from '../config/constants';
import strings from '../config/localization';
import {setSettings, updateUser} from './user';
import { setMuseums, getMuseums, setTensor, setMuseumsList, getMuseumsList as getMuseumsListFromDB } from '../db/controllers/museums';
import {convertToArray} from '../config/helpers';

export const getMuseum = (museum_id) => (dispatch) => {
  const museums = convertToArray(getMuseums());
  const museum = museums.find(museum => museum.sync_id === museum_id) || {};
  
  dispatch({ type: museumsTypes.CATEGORIES_LOADED, payload: convertToArray(museum.categories) });
  dispatch({ type: museumsTypes.OBJECTS_LOADED, payload: convertToArray(museum.objects) });
  dispatch({ type: museumsTypes.MUSEUMS_LOADED, payload: museum });
  return museum;
}

export const getMuseumsList = (lat = '', lon = '') =>
  axios.get(`${remote.api}museums/`, { params: { lat, lon }})  
    .then(response => {
      response.data.forEach(museum => setMuseumsList(museum))
      return Promise.resolve(response.data)
    })
    .catch(error => {
      const list = convertToArray(getMuseumsListFromDB());
      if(list.length !== 0) return Promise.resolve(list)
      return Promise.reject(error)
    });

export const setObject = (object) => (dispatch) => dispatch({ type: museumsTypes.OBJECT_LOADED, payload: object });

export const Recognize = (data, museum_id) =>
  axios.post(`${remote.api}recognize/?user_id=${DeviceInfo.getUniqueId()}&museum_id=${museum_id}`, data, {timeout: 6000} )
    .then(response => Promise.resolve(response.data))
    // .catch((error) => console.warn(`Error: ${error}`));
    
export const getRemoteData = (museum_id) =>
  axios.get(remote.api + 'synchronise/', { params: { user_id: DeviceInfo.getUniqueId(), museum_id }})
    .then(response => Promise.resolve(response.data))
    .catch(() => Promise.resolve(null));

export const ImageCache = async (image, sync_id) => {
  if(!image) image = 'https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png';
  const path = RNFetchBlob.fs.dirs.DocumentDir + "/images/" + sync_id + ".jpg";
  return await RNFetchBlob.fs.exists(path).then(async exists => {
    if(exists) {
      const isSameImage = await RNFetchBlob.fs.readFile(path, 'base64')
      .then(data => RNFetchBlob.fetch( 'GET', image )
      .then(response => response.data === data));
      if(isSameImage) return sync_id;
    }

    return await RNFetchBlob.fetch( 'GET', image )
    .then(response => RNFetchBlob.fs.writeFile(path, response.data, 'base64')
    .then(() => sync_id));
  });
};

export const WriteAndSaveOrientation = async (img, sync_id) => {
  let imgBase64 = (Platform.OS === 'android') ? await RNFetchBlob.fs.readFile(img.uri, 'base64') : img.base64
  return WriteBase64Image(imgBase64, sync_id)
} 

export const WriteBase64Image = async (img, sync_id) => {
  const path = RNFetchBlob.fs.dirs.DocumentDir + "/images/" + sync_id + ".jpg";  
  await RNFetchBlob.fs.writeFile(path, img, 'base64')
  return sync_id
};

export const CopyImage = async (image, sync_id) => {
  const img = await RNFetchBlob.fs.readFile(image, 'base64')
  return WriteBase64Image(img, sync_id)
} 


export const TensorCache = async (file, sync_id) => {
  const path = RNFetchBlob.fs.dirs.DocumentDir + "/tensor/" + sync_id;  
    return await RNFetchBlob.config({ fileCache : true, path })
            .fetch("GET", file, {})
            .then(() => Platform.OS === 'android' ? 'file://' + path : '' + path)
};

const getRemoteDialogue = (path) =>
  axios.get(path)
    .then(response => Promise.resolve(response.data))
    .catch(() => Promise.resolve(null));

export const saveDataToStorage = async (museums = [], settings = []) => { 
  const objects = [], predefined_avatars = [], images = [];
  await Promise.all(
    museums.objects.map(async item => {
      const avatar = await ImageCache(item.avatar, item.sync_id);
      let cropped_avatar = avatar;
      if(item.cropped_avatar) cropped_avatar = await ImageCache(item.cropped_avatar, `cropped_avatar_${item.sync_id}`);
      const object_map = await ImageCache(item.object_map, `map-${item.sync_id}`);
      const images = [], localizations = [];

      await Promise.all(item.images.map(async image => {
        const path = await ImageCache(image.image, image.sync_id);
        images.push({...image, image:path})
      }));
      
      await Promise.all(item.localizations.map(async localization => {
        const conversation = await getRemoteDialogue(localization.conversation);
        localizations.push({...localization, conversation})
      }));
      
      objects.push({...item, avatar, cropped_avatar, images, object_map, localizations, positionX:parseFloat(item.positionX), positionY:parseFloat(item.positionY)});
    }),
    museums.images.map(async item => {
      const image = await ImageCache(item.image, item.sync_id);
      images.push({...item, image});
    }),
    settings.predefined_avatars.map(async (item, i) => {
      const path = await ImageCache(item, `avatar${i}`);
      predefined_avatars.push(path);
    })
  );
  return { objects, predefined_avatars, images  }
};

export const setUser = users => async dispatch => {
    const user = {...users}; 
    if(!user.votings) delete user.votings; 
    if(!user.collections) delete user.collections;
    if(!user.chats) delete user.chats;
    if(!user.language_style) delete user.language_style;
    
    if(user.avatar) user.avatar = await ImageCache(user.avatar, user.sync_id);
    if(user.collections) await Promise.all(user.collections.map(async (collection, i) => {
      const path = await ImageCache(collection.image, collection.sync_id);
      user.collections[i] = {...collection, image:path}
    }));
    const language = strings.getLanguage();
    
    await updateUser({...user, language, positionX:parseFloat(user.positionX), positionY:parseFloat(user.positionY)})(dispatch);
}

export const setTensorFile = async (tensor) => {
  tensor.tensor_flow_model = await TensorCache(tensor.tensor_flow_model, `model_${tensor.sync_id}.pb`);
  tensor.tensor_flow_lables = await TensorCache(tensor.tensor_flow_lables, `lables_${tensor.sync_id}.txt`);
  setTensor(tensor);
}

export const setAllData = (id) => (dispatch) => getRemoteData(id)
.then( async (response) => { 
  const data = await saveDataToStorage(response.museums, response.settings);
  await setUser(response.users)(dispatch)
  await setSettings({...response.settings, predefined_avatars: data.predefined_avatars })(dispatch);
  setTensorFile({...response.museums.tensor[0], museum_id:response.museums.sync_id});
  const tensor = response.museums.tensor[0]
  return setMuseums({ ...response.museums, objects:data.objects, images:data.images, tensor })
  .then((data) => {
    dispatch({ type: museumsTypes.CATEGORIES_LOADED, payload: convertToArray(data.categories) });
    dispatch({ type: museumsTypes.OBJECTS_LOADED, payload: convertToArray(data.objects) });
    dispatch({ type: museumsTypes.MUSEUMS_LOADED, payload: data });
    return data    
  })  
});