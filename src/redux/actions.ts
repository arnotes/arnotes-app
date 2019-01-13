/*
 * action types
 */
export enum ActionTypes {
  SET_USER = 'SET_USER'
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