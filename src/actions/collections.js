import AsyncStorage from '@react-native-community/async-storage';
import {  
    getCollections as getCollectionsFromDB,
    setCollection
} from '../db/controllers/user';
import { userTypes } from './types';


export const getCollections = () => (dispatch) => {
    const collections = getCollectionsFromDB();
    dispatch({ type: userTypes.COLLECTIONS_LOADED, payload: collections });
    return collections;
}

export const createCollection = (params) => (dispatch) => new Promise((resolve, reject) => {
    setCollection(params)
        .then((collection) => {
            dispatch({ type: userTypes.COLLECTION_CREATED, payload: collection });
            return resolve(collection);
        })
        .catch((error) => reject(error))
})

export const  toObjectCounter = () => (dispatch) => {
    dispatch({ type: userTypes.TO_OBJECT_COUNTER });
}

export const getInitialCounter = () => (dispatch) => {
    AsyncStorage.getItem('counter').then(value => {
        if (value) {
            dispatch({
                type: userTypes.GET_INITIAL_TO_OBJECT_COUNTER,
                payload: JSON.parse(value)
            });
        } else {
            AsyncStorage.setItem('counter', JSON.stringify(0));
            dispatch({
                type: userTypes.GET_INITIAL_TO_OBJECT_COUNTER,
                payload: 0
            });
        }
    });
}
