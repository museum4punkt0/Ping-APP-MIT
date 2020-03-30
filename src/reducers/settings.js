import { settingsTypes } from "../actions/types";

const INITIAL_STATE = {
    // 1:plan mode, 2:tour mode, 3:discovery mode.
    plan:3,
    tour:{}
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
      
    case settingsTypes.PLAN_UPDATE:
      return { ...state, plan: action.payload };

    case settingsTypes.TOUR_LOADED:
      return { ...state, tour: action.payload };

    default:
      return state;
  }
}