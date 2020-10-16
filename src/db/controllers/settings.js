import realm from '../models/index';

export const setSettings = (settings, update_data) => new Promise((resolve, reject) => {
    try{
        realm.write(() => {
            for(const [key, value] in Object.entries(update_data)) {
                settings[key] = value;
            }
        })
        resolve(settings)
    } catch (error) {
        reject(error);
    }
});


export const  getSettings = () => realm.objects('Settings');