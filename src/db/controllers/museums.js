import realm from '../models/index';

export const setMuseums = (museums) => new Promise((resolve, reject) => {
    try{
        realm.write(() => resolve(realm.create('Museums', museums, true)));
    } catch (error) {
        reject(error);
    }
});

export const setObjects = (objects) => new Promise((resolve, reject) => {
    try{
        realm.write(() => resolve(realm.create('Objects', objects, true)));
    } catch (error) {
        reject(error);
    }
});

export const setCategories = (categories) => new Promise((resolve, reject) => {
    try{
        realm.write(() => resolve(realm.create('Categories', categories, true)));
    } catch (error) {
        reject(error);
    }
});

export const setTensor = (tensor) => new Promise((resolve, reject) => {
    try{
        realm.write(() => resolve(realm.create('Tensor', tensor, true)));
    } catch (error) {
        reject(error);
    }
});

export const setMuseumsList = (museumsList) => new Promise((resolve, reject) => {
    try{
        realm.write(() => resolve(realm.create('Museums_list', museumsList, true)));
    } catch (error) {
        reject(error);
    }
});

export const  getMuseums = () => realm.objects('Museums');

export const  getTensor = () => realm.objects('Tensor');

export const  getObjects = () => realm.objects('Objects');

export const  getCategories = () => Array.from(realm.objects('Categories'));

export const  getByPrimary = (key, id) => realm.objectForPrimaryKey(key, id);

export const  getMuseumsList = () => realm.objects('Museums_list');

export const remove = (id, key = 'Categories') => new Promise((resolve, reject) => {
    try{
        const object = getByPrimary(key, id)
        realm.write(() => resolve(realm.delete(object)));
    } catch (error) {
        reject(error);
    }
});