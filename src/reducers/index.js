import { combineReducers } from "redux";

import chats from './chats';
import museums from './museums';
import user from './user';
import vote from './vote';
import plan from './settings';
import collections from './collections';

export default combineReducers({ chats, museums, user, vote, plan, collections });