import { ReduxAction, ActionTypes } from "./actions";
import { combineReducers } from "redux";

export interface StoreState {
  user: firebase.User,
  activeNoteID?: string
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

function activeNoteIDRdc(activeNoteIDState:string , action:ReduxAction<string>){
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_NOTE:
      return action.data;
      break;
  
    default:
      return activeNoteIDState || null; 
      break;
  }
}

export const combinedReducers = combineReducers({
  user:userRdc,
  activeNoteID: activeNoteIDRdc
});