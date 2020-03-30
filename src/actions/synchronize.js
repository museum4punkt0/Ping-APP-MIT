import axios from 'axios/index';
import DeviceInfo from 'react-native-device-info';
import remote from '../config/constants';
import { museumsTypes } from './types';
import {syncMuseums, syncSettings, syncUser} from '../services/synchronize';
import { saveDataToStorage} from './museums';
import { setObjects, setCategories, setMuseums, remove } from '../db/controllers/museums';
import { setSettings } from './user';
import { updateItemOrPush, convertToArray } from '../config/helpers';

export const fetch = (museum_id) =>
    axios.get(remote.api + 'fetch/', { params: { user_id: DeviceInfo.getUniqueId(), museum_id }})
        .then(response => Promise.resolve(response.data))
        .catch(() => Promise.resolve(null));

export const synchroniseRemote = (data, museum_id) =>
        axios({
            method: 'post',
            url: `${remote.api}synchronise/?user_id=${DeviceInfo.getUniqueId()}&museum_id=${museum_id}`,
            data, config: { headers: {'Content-Type': 'multipart/form-data' }}
            })
          .then(response => Promise.resolve(response.data))
          .catch((error) => Promise.reject(error));

export const removeItem = async (deleted, array, shema = 'Categories', key = 'sync_id') => await deleted.forEach( async item => {
    const itemToDelete = array.find(arrayItem => arrayItem[key] === item);
    // console.warn('deleted',deleted)
    if(itemToDelete) await remove(itemToDelete.sync_id, shema)
})

export const updateAllData = (response, museum, deleted = {}) => async (dispatch) => {
    // console.warn('response:',response)
    const data = await saveDataToStorage(response.museums || [], response.settings || {predefined_avatars:[]});
    if(response.settings) await setSettings({...response.settings, predefined_avatars: data.predefined_avatars })(dispatch);
    await Promise.all(
        data.objects.map(item => setObjects(item).then(object => {
            museum.objects = updateItemOrPush(museum.objects, item);
            dispatch({ type: museumsTypes.OBJECTS_UPDATE, payload: object })
        })),
        response.museums.categories.map(item => setCategories(item).then(category => {
            museum.categories = updateItemOrPush(museum.categories, item);
            dispatch({ type: museumsTypes.CATEGORIES_UPDATE, payload: category })
        })),
        removeItem(deleted.categories, museum.categories, 'Categories'),
        removeItem(deleted.objects, museum.objects, 'Votings', 'object_id'),
        removeItem(deleted.objects, museum.objects, 'Objects')
    );
    await setMuseums(museum)
    .then(updatedMuseum => {
        // dispatch({ type: museumsTypes.CATEGORIES_LOADED, payload: convertToArray(updatedMuseum.categories) });
        dispatch({ type: museumsTypes.OBJECTS_LOADED, payload: convertToArray(updatedMuseum.objects) });
        dispatch({ type: museumsTypes.MUSEUMS_LOADED, payload: updatedMuseum });
        return data    
      }) 
};


export const sync = (data) => (dispatch) => fetch(data.museum.sync_id) 
    .then( async fetch => { 
        let json = { "add": {}, "update": {}, "delete": {}, "get": {} }  
        json = {...syncMuseums(fetch.museums, json)};
        json = {...syncSettings(fetch.settings, json)};
        const user = await syncUser(fetch.users, data.user, json, [], fetch.deleted)
        json = {...user.json};

        const formdata = new FormData();
        formdata.append('data', JSON.stringify(json));
        user.images.forEach(item => item.path && formdata.append(item.path, {uri:item.img, name:item.path, type: 'image/jpeg'}));
        // console.warn('ID:',data.museum.sync_id, 'data:',json.add.collections)
        return await synchroniseRemote(formdata, data.museum.sync_id)
        .then(async response => await updateAllData(response, {...data.museum}, fetch.deleted)(dispatch))
        // .catch((err) => console.warn('Synchronise Remote Error:',err))
});
