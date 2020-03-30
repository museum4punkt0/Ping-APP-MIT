import { settingsTypes, userTypes } from "../actions/types";

const INITIAL_STATE = {
    settings: {},
    user: {}
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
      
    case settingsTypes.SETTINGS_LOADED:
      return { ...state, settings: action.payload };
      
    case userTypes.USER_LOADED:
        return { ...state, user: action.payload };  

    case userTypes.USER_UPDATE:
        return { ...state, user: {...state.user, ...action.payload} }; 
        
    default:
      return state;
  }
}