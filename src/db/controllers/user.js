
import uuidv1 from 'uuid/v1';
import realm from '../models/index';

export const  getUser = () => realm.objects('User');
export const  getChats = () => Array.from(realm.objects('Chats'));
export const  getCollections = () => Array.from(realm.objects('Collections'));
export const  getVotes = () => Array.from(realm.objects('Votings'));
export const  getLanguageStyles = () => Array.from(realm.objects('Language_style'));

export const updateUser = (user) => new Promise((resolve, reject) => {
    try{
        realm.write(() => resolve(realm.create('User', user, true)));
    } catch (error) {
        reject(error);
    }
});

export const  updateChat = (chat) => new Promise((resolve, reject) => {
    try{
        realm.write(() => resolve(realm.create('Chats', chat, true)));
    } catch (error) {
        reject(error);
    }
});

export const  setChat = (object) => new Promise((resolve, reject) => {
    try{
        const chats = getChats();
        const isExist = chats.find(item => item.object_id === object.sync_id);
        if(isExist) return resolve(isExist);

        const chat = {     
            sync_id: uuidv1(),
            object_id: object.sync_id,
            last_step: 0,
            finished: false,
            planned:object.planned,
            history: '',
            created_at: new Date(),
            updated_at: new Date()
        }
        realm.write(() => resolve(realm.create('Chats', chat)));
    } catch (error) {
        reject(error);
    }
});

export const  setCollection = (params) => new Promise((resolve, reject) => {
    try{
        const collection = { 
            object_id: params.object_id,
            image: params.image,
            category_id: params.category_id,  
            // sync_id: uuidv1(),      
            sync_id: params.image,      
            created_at: new Date(),
            updated_at: new Date()
        }
        realm.write(() => resolve(realm.create('Collections', collection)));
    } catch (error) {
        reject(error);
    }
});

export const resetUser = () => new Promise((resolve, reject) => {
    try{
        realm.write(() => {
            realm.delete(getCollections())
            realm.delete(getChats())
            realm.delete(getUser())
            realm.delete(getVotes())
            resolve('')
        });
    } catch (error) {
        reject(error);
    }
});

export const  vote = (params) => new Promise((resolve, reject) => {
    try{
        let data = { object_id: params.object_id, vote: params.vote, updated_at: new Date() }
        const votings = getVotes();
        const vote = votings.find(item => item.object_id === params.object_id)
        if(vote) data = {...data, sync_id:vote.sync_id, created_at:vote.created_at}
        if(!vote) data = {...data, sync_id:uuidv1(), created_at:new Date()}
        realm.write(() => resolve(realm.create('Votings', data, true)));
    } catch (error) {
        reject(error);
    }
});

export const  updateLanguageStyles = (params) => new Promise((resolve, reject) => {
    try{ 
        realm.write(() => resolve(realm.create('Language_style', params, true)));
    } catch (error) {
        reject(error);
    }
});