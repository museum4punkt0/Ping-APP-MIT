import realm from '../models/index';

export const setSettings = (settings) => new Promise((resolve, reject) => {
    try{
        realm.write(() => resolve(realm.create('Settings', settings, true)));
    } catch (error) {  
        reject(error);
    }
});


export const  getSettings = () => realm.objects('Settings');