import realm from '../models/index';

export const setMuseums = (museums, update_data) => new Promise((resolve, reject) => {
    try{
        if(update_data) {
            realm.write(() => {
                for(const [key, value] in Object.entries(update_data)) {
                    museums[key] = value;
                }
            })
            resolve(museums)
        }
        else realm.write(() => resolve(realm.create('Museums', museums)));
    } catch (error) {
        reject(error);
    }
});

export const setObjects = (objects, update_data) => new Promise((resolve, reject) => {
    try{
        if(update_data) {
            realm.write(() => {
                for(const [key, value] in Object.entries(update_data)) {
                    objects[key] = value;
                }
            })
            resolve(objects)
        }
        else realm.write(() => resolve(realm.create('Objects', objects)));
    } catch (error) {
        reject(error);
    }
});

export const setCategories = (categories, update_data) => new Promise((resolve, reject) => {
    try{
        if(update_data) {
            realm.write(() => {
                for(const [key, value] in Object.entries(update_data)) {
                    categories[key] = value;
                }
            })
            resolve(categories)
        }
        else realm.write(() => resolve(realm.create('Categories', categories)));
    } catch (error) {
        reject(error);
    }
});

export const setTensor = (tensor, update_data) => new Promise((resolve, reject) => {
    try{
        if(update_data) {
            realm.write(() => {
                for(const [key, value] in Object.entries(update_data)) {
                    tensor[key] = value;
                }
            })
            resolve(tensor)
        }
        else realm.write(() => resolve(realm.create('Tensor', categories)));
    } catch (error) {
        reject(error);
    }
});

export const setMuseumsList = (museumsList, update_data) => new Promise((resolve, reject) => {
    try{
        if(update_data) {
            realm.write(() => {
                for(const [key, value] in Object.entries(update_data)) {
                    museumsList[key] = value;
                }
            })
            resolve(museumsList)
        }
        else realm.write(() => resolve(realm.create('Museums_list', museumsList)));
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