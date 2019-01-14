import { ReduxAction, ActionTypes } from "./actions";
import { combineReducers } from "redux";

export interface StoreState {
  user: firebase.User
}

const initialState: StoreState = {
  user: null
}

function userRdc(userState:firebase.User, action:ReduxAction<firebase.User>) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return action.data as firebase.User;
      break;
  
    default:
      return userState || null;
      break;
  }
}

export const combinedReducers = combineReducers({
  user:userRdc
});