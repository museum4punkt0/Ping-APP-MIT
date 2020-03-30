import { voteTypes } from "../actions/types";
import { updateItemOrPush } from '../config/helpers'

const INITIAL_STATE = {
  votes: []
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
      
    case voteTypes.VOTE_LOADED:
      return { ...state, votes: action.payload };

    case voteTypes.VOTE_UPDATE:
        return { ...state, votes: updateItemOrPush(state.votes, action.payload) };

    default:
      return state;
  }
}