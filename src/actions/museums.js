import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios/index';
import RNFS from 'react-native-fs';
import { museumsTypes } from './types';
import remote from '../config/constants';
import strings from '../config/localization';
import {setSettings, updateUser} from './user';
import {
  setMuseums,
  getMuseums,
  setTensor,
  setMuseumsList,
  getMuseumsList as getMuseumsListFromDB,
} from '../db/controllers/museums';
import {
  calculateTotalObjectsToLoad,
  convertToArray,
  chunkArray,
} from '../config/helpers';

global.Buffer = global.Buffer || require('buffer').Buffer

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
  const path = `${RNFS.DocumentDirectoryPath}/images/${sync_id}.jpg`
  return await RNFS.exists(path).then(async exists => {
    if(exists) {
      const isSameImage = await RNFS.readFile(path, "base64").then(
        (data) =>
          axios
            .get(image, {
              responseType: "arraybuffer",
            })
            .then((response) => 
              Buffer.from(response.data, 'binary').toString('base64')
            )
            .then((base64) => base64 === data)
            .catch(() => true)
      );
      if(isSameImage) return sync_id;
    }
    return RNFS.downloadFile({
      fromUrl: image,
      toFile: path,
    }).promise.then(() => sync_id);
  })
};

export const WriteAndSaveOrientation = async (img, sync_id) => {
  const imgBase64 = (Platform.OS === 'android') ? await RNFS.readFile(img.uri, 'base64') : img.base64
  return WriteBase64Image(imgBase64, sync_id)
} 

export const WriteBase64Image = async (img, sync_id) => {
  const path = RNFS.DocumentDirectoryPath + "/images/" + sync_id + ".jpg";  
  await RNFS.writeFile(path, img, 'base64')
  return sync_id
};

export const CopyImage = async (image, sync_id) => {
  const img = await RNFS.readFile(image, 'base64')
  return WriteBase64Image(img, sync_id)
} 


export const TensorCache = async (file, sync_id) => {
  if (!file) {
    throw new Error('Invalid tensor model files');
  }
  await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/tensor`)
  const path = RNFS.DocumentDirectoryPath + "/tensor/" + sync_id;  

  return await RNFS.downloadFile({
    fromUrl: file,
    toFile: path,
  }).promise.then(() =>
    Platform.OS === "android" ? "file://" + path : "" + path
  );
};

const getRemoteDialogue = (path) =>
  axios.get(path)
    .then(response => Promise.resolve(response.data))
    .catch(() => Promise.resolve(null));

export const saveDataToStorage = async (museums = [], settings = [], incrementTotal) => { 
  await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/images`)
  const objectsChunks = chunkArray(museums.objects, 5);

  const objects = await Promise.all(objectsChunks.map(async (objectsChunk) => {
    const objectsPart = await Promise.all(
      objectsChunk.map(async (item) => {
        const avatar = await ImageCache(item.avatar, item.sync_id);
        incrementTotal();

        let cropped_avatar = avatar;
        if (item.cropped_avatar) {
          incrementTotal();
          cropped_avatar = await ImageCache(
            item.cropped_avatar,
            `cropped_avatar_${item.sync_id}`
          );
        }

        const images = await Promise.all(
          item.images.map(async (image) => {
            incrementTotal();
            const path = await ImageCache(image.image, image.sync_id);
            return { ...image, image: path };
          })
        );

        const localizations = await Promise.all(
          item.localizations.map(async (localization) => {
            incrementTotal();
            const conversation = await getRemoteDialogue(
              localization.conversation
            );
            return { ...localization, conversation };
          })
        );

        return {
          ...item,
          avatar,
          cropped_avatar,
          images,
          localizations,
          positionX: parseFloat(item.positionX),
          positionY: parseFloat(item.positionY),
        };
      })
    );

    return objectsPart;
  }));
  
  const images = await Promise.all(
    museums.images.map(async item => {
      incrementTotal()
      const image = await ImageCache(item.image, item.sync_id);
      return { ...item, image };
    })
  )

  const sections = await Promise.all(
    museums.sections.map(async (item) => {
      incrementTotal();
      const map = await ImageCache(item.map, item.sync_id);
      return { ...item, map };
    })
  );
  const predefined_avatars = await Promise.all(
    settings.predefined_avatars.map(async (item, i) => {
      incrementTotal();
      const path = await ImageCache(item, `avatar${i}`);
      return path;
    })
  );
  return { objects: objects.flat(), predefined_avatars, images, sections  }
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

export const setAllData = (id, updateTotal, incrementTotal) => (dispatch) => getRemoteData(id)
.then( async (response) => { 
  const total = calculateTotalObjectsToLoad(response.museums, response.settings)
  updateTotal(total);

  const data = await saveDataToStorage(response.museums, response.settings, incrementTotal);
  await setUser(response.users)(dispatch)
  await setSettings({...response.settings, predefined_avatars: data.predefined_avatars })(dispatch);
  await setTensorFile({...response.museums.tensor[0], museum_id:response.museums.sync_id});
  const tensor = response.museums.tensor[0]
  return setMuseums({ ...response.museums, objects:data.objects, images:data.images, tensor, sections: data.sections })
  .then((data) => {
    dispatch({ type: museumsTypes.CATEGORIES_LOADED, payload: convertToArray(data.categories) });
    dispatch({ type: museumsTypes.OBJECTS_LOADED, payload: convertToArray(data.objects) });
    dispatch({ type: museumsTypes.MUSEUMS_LOADED, payload: data });
    return data    
  })  
});