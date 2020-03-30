import { userTypes } from "../actions/types";

const INITIAL_STATE = {
    collections: []
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
      
    case userTypes.COLLECTIONS_LOADED:
      return { ...state, collections: action.payload };

    case userTypes.COLLECTION_CREATED:
        return { ...state, collections:  [...state.collections, action.payload] };

    default:
      return state;
  }
}