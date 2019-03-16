/*
 * action types
 */
export enum ActionTypes {
  SET_USER = 'SET_USER',
  SET_ACTIVE_NOTE = 'SET_ACTIVE_NOTE',
  SET_SEARCHINPUT_FOCUS_STATE = 'SET_SEARCHINPUT_FOCUS_STATE'
}

/*
 * action interface
 * where AD is the action data
 */
export interface ReduxAction<DataType>{
  type: ActionTypes;
  data: DataType
}


export function setUser(user:firebase.User){
  let ra:ReduxAction<firebase.User> = {
    type: ActionTypes.SET_USER,
    data: user
  };
  return ra;
}

export function setActiveNote(noteID:string){
  let ra:ReduxAction<string> = {
    type: ActionTypes.SET_ACTIVE_NOTE,
    data: noteID
  };
  return ra;
}

export function setSearchInputFocusState(isFocused:boolean){
  let ra:ReduxAction<boolean> = {
    type: ActionTypes.SET_SEARCHINPUT_FOCUS_STATE,
    data: isFocused
  };
  return ra;
}