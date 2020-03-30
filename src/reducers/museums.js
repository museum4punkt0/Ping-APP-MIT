import { museumsTypes } from "../actions/types";
import { updateItemOrPush } from '../config/helpers'

const INITIAL_STATE = {
  museums: {},
  categories: [],
  objects: [],
  object:{}
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
      
    case museumsTypes.MUSEUMS_LOADED:
      return { ...state, museums: action.payload };
      
    case museumsTypes.CATEGORIES_LOADED:
      return { ...state, categories: action.payload };

    case museumsTypes.OBJECTS_LOADED:
    return { ...state, objects: action.payload };

    case museumsTypes.OBJECT_LOADED:
    return { ...state, object: action.payload };
      
    case museumsTypes.MUSEUMS_UPDATE:
      return { ...state, museums: updateItemOrPush(state.museums, action.payload) };
      
    case museumsTypes.CATEGORIES_UPDATE:
      return { ...state, categories: updateItemOrPush(state.categories, action.payload) };

    case museumsTypes.OBJECTS_UPDATE:
    return { ...state, objects: updateItemOrPush(state.objects, action.payload)  };

    default:
      return state;
  }
}