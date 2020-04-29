import AsyncStorage from '@react-native-community/async-storage';
import { userTypes } from "../actions/types";

const INITIAL_STATE = {
    collections: [],
    counter: null
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
      
    case userTypes.COLLECTIONS_LOADED:
      return { ...state, collections: action.payload };

    case userTypes.COLLECTION_CREATED:
        return { ...state, collections:  [...state.collections, action.payload] };

    case userTypes.SET_INITIAL_COUNTER:
      return { ...state, counter: action.payload };

    case userTypes.TO_OBJECT_COUNTER:
      AsyncStorage.setItem('counter', JSON.stringify(state.counter + 1));
      return { ...state, counter: state.counter + 1 };

    case userTypes.GET_INITIAL_TO_OBJECT_COUNTER:
      return { ...state, counter: action.payload };
    default:
      return state;
  }
}