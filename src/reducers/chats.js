import { userTypes } from "../actions/types";
import { updateArrayItem } from '../config/helpers'

const INITIAL_STATE = {
  chats: []
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
      
    case userTypes.CHATS_LOADED:
      return { ...state, chats: action.payload };

    case userTypes.CHAT_CREATED:
        return { ...state, chats:  [...state.chats, action.payload] };

    case userTypes.CHAT_UPDATE:
        return { ...state, chats: updateArrayItem(state.chats, action.payload) };

    default:
      return state;
  }
}