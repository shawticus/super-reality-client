import Immutable from "immutable";
import { UserSeed } from "../../../common/interfaces/User";
import { IdentityProviderSeed } from "../../../common/interfaces/IdentityProvider";
import { AuthUserSeed } from "../../../common/interfaces/AuthUser";
import {
  AuthProcessingAction,
  LoginResultAction,
  AuthResultAction,
  RegistrationResultAction,
  LoadDataResultAction,
  AvatarUpdatedAction,
  UsernameUpdatedAction,
  UserUpdatedAction,
  UserSettingsUpdatedAction,
  UserAvatarIdUpdatedAction,
} from "./actions";

import {
  LOGIN_USER_BY_GITHUB_SUCCESS,
  LOGIN_USER_BY_GITHUB_ERROR,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER,
  REGISTER_USER_BY_EMAIL_SUCCESS,
  ACTION_PROCESSING,
  DID_VERIFY_EMAIL,
  REGISTER_USER_BY_EMAIL_ERROR,
  RESTORE,
  LOADED_USER_DATA,
  AVATAR_UPDATED,
  USERNAME_UPDATED,
  USER_UPDATED,
  UPDATE_USER_SETTINGS,
  USERAVATARID_UPDATED,
} from "../actions";
import { getStoredState } from "../persisted.store";

export const initialState = {
  isLoggedIn: false,
  isProcessing: false,
  error: "",
  authUser: AuthUserSeed,
  user: UserSeed,
  identityProvider: IdentityProviderSeed,
};

const immutableState = Immutable.fromJS(initialState);

const authReducer = (state = immutableState, action: any): any => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case ACTION_PROCESSING:
      return state
        .set("isProcessing", (action as AuthProcessingAction).processing)
        .set("error", "");
    case LOGIN_USER_SUCCESS:
      // console.log('*****************Logged in****************');
      return state
        .set("isLoggedIn", true)
        .set("authUser", (action as LoginResultAction).authUser);
    case LOGIN_USER_ERROR:
      return state.set("error", (action as LoginResultAction).message);
    case LOGIN_USER_BY_GITHUB_SUCCESS:
      break;
    case LOGIN_USER_BY_GITHUB_ERROR:
      return state.set("error", (action as LoginResultAction).message);
    case REGISTER_USER_BY_EMAIL_SUCCESS:
      return state.set(
        "identityProvider",
        (action as RegistrationResultAction).identityProvider
      );
    case REGISTER_USER_BY_EMAIL_ERROR:
      break;
    case LOGOUT_USER:
      return state
        .set("isLoggedIn", false)
        .set("user", undefined)
        .set("authUser", undefined);
    case DID_VERIFY_EMAIL:
      return state.set("isVerified", (action as AuthResultAction).result);

    case LOADED_USER_DATA: {
      const { user } = action as LoadDataResultAction;

      return state.set("user", user);
    }
    case RESTORE: {
      const stored = getStoredState("auth");

      if (stored) {
        return state
          .set("isLoggedIn", stored.isLoggedIn)
          .set("authUser", stored.authUser)
          .set("identityProvider", stored.identityProvider);
      }
      return state;
    }
    case AVATAR_UPDATED: {
      const updatedUser = {
        ...state.get("user"),
        avatarUrl: (action as AvatarUpdatedAction).url,
      };
      return state.set("user", updatedUser);
    }
    case USERNAME_UPDATED: {
      const updatedUser = {
        ...state.get("user"),
        name: (action as UsernameUpdatedAction).name,
      };
      return state.set("user", updatedUser);
    }
    case USERAVATARID_UPDATED: {
      const updatedUser = {
        ...state.get("user"),
        avatarId: (action as UserAvatarIdUpdatedAction).avatarId,
      };
      return state.set("user", updatedUser);
    }
    case USER_UPDATED: {
      const updatedUser = {
        ...state.get("user"),
        ...(action as UserUpdatedAction).user,
      };
      return state.set("user", updatedUser);
    }
    case UPDATE_USER_SETTINGS: {
      const updatedUser = {
        ...state.get("user"),
        user_setting: (action as UserSettingsUpdatedAction).data,
      };
      return state.set("user", updatedUser);
    }
  }

  return state;
};

export default authReducer;
