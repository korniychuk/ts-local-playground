export interface User {
  id: number;
  email: string;
}


export interface Action {
  type: string;
  payload: any;
}

const LOAD_USER_BY_IDS_ACTION = '[Users] Fetch User by IDs';

export interface LoadUserByIdsAction extends Action {
  type: typeof LOAD_USER_BY_IDS_ACTION;
  payload: {
    userIds: number[];
  };
}

const UPDATE_USER_ACTION = '[Users] Update User';

export interface UpdateUserAction extends Action {
  type: typeof UPDATE_USER_ACTION;
  payload: {
    user: User;
  };
}

type UserActions = LoadUserByIdsAction | UpdateUserAction;

export function usersReducer(state: any, action: UserActions): any {

  switch (action.type) {
    case UPDATE_USER_ACTION:
      console.log(action.payload.user);
      console.log(action.payload.userIds);
      break;

    case LOAD_USER_BY_IDS_ACTION:
      console.log(action.payload.userIds);
      break;
  }

}
