import { 
    setSettings as setSettingsToBD,
    getSettings as getSettingsFromDB
} from '../db/controllers/settings';
import {  
    getLanguageStyles,
    updateLanguageStyles,
    getUser as getUserFromDB,
    updateUser as updateUserFromDB,
    resetUser as resetUserFromDB,
    vote as voteToDB,
    getVotes as getVotesFromBD
} from '../db/controllers/user';
import { settingsTypes, userTypes, voteTypes } from './types';
import strings from '../config/localization';

export const setSettings = (settings) => (dispatch) => setSettingsToBD(settings)
    .then((settings) => {
        
        dispatch({ type: settingsTypes.SETTINGS_LOADED, payload: settings });
        return settings;
    })
    .catch((error) => Promise.reject(error));

export const getSettings = () => (dispatch) => {
    const settings = getSettingsFromDB();
    if(!settings[0]) return {};
    dispatch({ type: settingsTypes.SETTINGS_LOADED, payload: settings[0] });
    return settings[0];
}


export const getUser = () => (dispatch) => {
    let user = getUserFromDB();
    if(!user[0]) return {};
    user = user[0];
    if(user.language) strings.setLanguage(user.language)
    dispatch({ type: userTypes.USER_LOADED, payload: user });
    return user;
}

export const updateUser = (user) => (dispatch) => updateUserFromDB({...user, updated_at: new Date()})
    .then((user)=>{
        dispatch({ type: userTypes.USER_LOADED, payload: user });
        return Promise.resolve(user);
    })
    .catch((error) => Promise.reject(error));


export const resetUser = () => (dispatch) => new Promise((resolve, reject) => {
    resetUserFromDB()
        .then(() => {
            dispatch({ type: userTypes.USER_LOADED, payload: {} });
            dispatch({ type: userTypes.CHATS_LOADED, payload: [] });
            dispatch({ type: userTypes.COLLECTIONS_LOADED, payload: [] });
            return resolve('Clear');
        })
        .catch((error) => reject(error))
});

export const voteUpdate = (params) => (dispatch) => voteToDB(params)
    .then((vote)=>{
        const language_style = getLanguageStyles();
        const index = language_style.findIndex(i => i.style === params.style);
        if(index !== -1) language_style[index] = {...language_style[index],  score: language_style[index].score + (params.vote ? 1 : -1) };
        
        updateLanguageStyles(language_style[index])
        .then(()=>{
            dispatch({ type: voteTypes.VOTE_UPDATE, payload: vote });
            return Promise.resolve(vote);
        }).catch((error) => Promise.reject(error));
    })
    .catch((error) => Promise.reject(error));

export const getVotes = () => (dispatch) => {
        const vote = getVotesFromBD();
        dispatch({ type: voteTypes.VOTE_LOADED, payload: vote });
        return vote;
    }

export const setPlanMode = (plan) => (dispatch) => dispatch({ type: settingsTypes.PLAN_UPDATE, payload: plan});

export const setTour = (plan) => (dispatch) => dispatch({ type: settingsTypes.TOUR_LOADED, payload: plan})