import { Platform } from 'react-native';
import { getByPrimary } from '../db/controllers/museums';
import {getImage} from '../config/helpers';

export const syncMuseums = (fetch, json) => {
    const objects = [], images = [], categories= [];
    if(fetch.objects) fetch.objects.forEach(object => {
        const isExist = getByPrimary('Objects', object.sync_id);
        if(!isExist || new Date(object.updated_at).getTime() !== new Date(isExist.updated_at).getTime()) objects.push(object.sync_id);
    });
    if(fetch.categories) fetch.categories.forEach(category => {
        const isExist = getByPrimary('Categories', category.sync_id);
        if(!isExist || new Date(category.updated_at).getTime() !== new Date(isExist.updated_at).getTime()) categories.push(category.sync_id);
    });
    if(fetch.images) fetch.images.forEach(image => {
        const isExist = getByPrimary('Images', image.sync_id);
        if(!isExist || new Date(image.updated_at).getTime() !== new Date(isExist.updated_at).getTime()) images.push(image.sync_id);
    });
    json.get = {...json.get, objects, images, categories}
    return json
};

export const syncSettings = (setting, json) => {
    const settings = [];
    if(setting) {
        const isExist = getByPrimary('Settings', setting.sync_id);
        if(!isExist || new Date(setting.updated_at).getTime() !== new Date(isExist.updated_at).getTime()) settings.push(setting.sync_id);
    }
    json.get = {...json.get, settings}
    return json
};


export const syncUser = async (fetch, user, json, images, deleted = {}) => {
    const chatsUpdate = [], chatsAdd = [], voteUpdate = [], voteAdd = [], collectionsUpdate = [], collectionsAdd = [];
    const { objects } = deleted;
    
    if(new Date(user.updated_at).getTime() !== new Date(fetch.updated_at).getTime()) {
        const updateUser = {...user}
        delete updateUser.votings;
        delete updateUser.collections;
        delete updateUser.chats;
        images.push({path:updateUser.avatar, img:getImage(updateUser.avatar)})
        updateUser.language_style = Array.from(updateUser.language_style);
        
        json.update = {...json.update, user:updateUser};
    }

    if(user.chats && fetch.chats) user.chats.forEach(item => {
        const chat = {...item, object_sync_id:item.object_id}
        const isExist = fetch.chats.find(item => item.sync_id === chat.sync_id);   
        if(objects.find(object => object === item.object_id)) return      
        if(!isExist) chatsAdd.push(chat);
        if(isExist && new Date(chat.updated_at).getTime() !== new Date(isExist.updated_at).getTime()) chatsUpdate.push(chat);
    });
    
    if(user.votings && fetch.votings) user.votings.forEach(item => {
        const vote = {...item, object_sync_id:item.object_id}
        const isExist = fetch.votings.find(item => item.sync_id === vote.sync_id);
        if(objects.find(object => object === item.object_id)) return 
        if(!isExist) voteAdd.push(vote);
        if(isExist && new Date(vote.updated_at).getTime() !== new Date(isExist.updated_at).getTime()) voteUpdate.push(vote);
    });

    if(user.collections && user.collections[0] && fetch.collections) await Promise.all(user.collections.map(async item => {
        const collection = {...item, object_sync_id:item.object_id, categories:item.category_id}
        const isExist = fetch.collections.find(item => item.sync_id === collection.sync_id);
        const path = Platform.OS === 'ios' ? getImage(collection.image).replace('file:///', '') : getImage(collection.image);
        images.push({path:collection.image, img:path})
        
        if(!isExist) collectionsAdd.push(collection);
        if(isExist && new Date(collection.updated_at).getTime() !== new Date(isExist.updated_at).getTime()) collectionsUpdate.push(collection);
    }));

    json.update = {...json.update, collections:collectionsUpdate,  votings:voteUpdate, chats:chatsUpdate}
    json.add = {...json.add, collections:collectionsAdd, votings:voteAdd, chats:chatsAdd}
    return {json,images};
}