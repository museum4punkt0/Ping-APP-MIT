import {  
    setChat, 
    getChats as getChatsFromDB,
    updateChat as updateChatFromDB
} from '../db/controllers/user';
import { userTypes } from './types';


export const createChat = (object) => (dispatch) => setChat(object)
    .then((chat)=> {        
        dispatch({ type: userTypes.CHAT_CREATED, payload: chat });
        return chat;
    })
    .catch((error)=>Promise.reject(error))

export const getChats = () => (dispatch) => {
    const chat = getChatsFromDB();
    dispatch({ type: userTypes.CHATS_LOADED, payload: chat });
    return chat;
}

export const updateChat = (params) => (dispatch) => updateChatFromDB({...params, updated_at: new Date()})
    .then((chat)=> {      
        dispatch({ type: userTypes.CHAT_UPDATE, payload: chat });
        return Promise.resolve(chat);
    })
    .catch((error)=>Promise.reject(error))