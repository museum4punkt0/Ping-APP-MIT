import {  
    getCollections as getCollectionsFromDB,
    setCollection
} from '../db/controllers/user';
import { userTypes } from './types';

export const setCurrentSemanticRelations = (currentSemanticRelations) => ({
    type: userTypes.SET_CURRENT_SEMANTIC_RELATIONS,
    payload: currentSemanticRelations,
})

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

