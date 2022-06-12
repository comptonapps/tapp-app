import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  REFRESH_SUCCESS,
  PLACE_CREATE_RATING_SUCCESS,
  PLACE_UPDATE_RATING_SUCCESS,
  PLACE_DELETE_RATING_SUCCESS,
  DRINK_CREATE_RATING_SUCCESS,
  DRINK_UPDATE_RATING_SUCCESS,
  DRINK_DELETE_RATING_SUCCESS
} from "../action/types/session";

import { LOGOUT, CHANGE_LOCATION } from "../action/types/global";

import { PLACES_CREATE_SUCCESS } from "../action/types/places";

import CONSTANTS from "../constants";

import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage
} from "../helpers/localStorage";

const { LS_SESSION_KEY } = CONSTANTS;

const INITIAL_STATE = {
  user: null,
  preferredLocation: null,
  error: null,
  requests: 0,
  token: null
};

const LAUNCH_STATE = getFromLocalStorage(LS_SESSION_KEY) || INITIAL_STATE;

const sessionReducer = (state = LAUNCH_STATE, action) => {
  switch (action.type) {
    case AUTH_REQUEST:
      return { ...state, error: null, requests: state.requests + 1 };
    case AUTH_SUCCESS:
      const user = action.payload.user;
      const token = action.payload.token;
      const location = { city: user.city, state: user.state };
      const newState = {
        ...state,
        user,
        preferredLocation: location,
        token,
        requests: state.requests - 1
      };
      setToLocalStorage(LS_SESSION_KEY, newState);
      return newState;
    case AUTH_ERROR:
      return { ...state, error: action.message, requests: state.requests - 1 };
    case REFRESH_SUCCESS:
      const refreshState = {
        ...state,
        requests: state.requests - 1,
        user: { ...action.payload.user }
      };
      setToLocalStorage(LS_SESSION_KEY, refreshState);
      return refreshState;
    case CHANGE_LOCATION:
      const newLocation = { ...state, preferredLocation: action.payload };
      setToLocalStorage(LS_SESSION_KEY, newLocation);
      return newLocation;
    case PLACES_CREATE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          places_owned: {
            ...state.user.places_owned,
            [action.payload.place_owner.place_id]: action.payload.place_owner
          }
        }
      };
    case PLACE_CREATE_RATING_SUCCESS:
      const placeRatings = {
        ...state.user.place_ratings,
        [action.payload.place_id]: action.payload
      };
      const usr = { ...state.user, place_ratings: placeRatings };
      return { ...state, user: usr, requests: state.requests - 1 };
    case PLACE_UPDATE_RATING_SUCCESS:
      return {
        ...state,
        requests: state.requests - 1,
        user: {
          ...state.user,
          place_ratings: {
            ...state.user.place_ratings,
            [action.payload.place_id]: action.payload
          }
        }
      };
    case PLACE_DELETE_RATING_SUCCESS:
      const uCopy = { ...state.user };
      delete uCopy.place_ratings[action.payload.place_id];
      return { ...state, user: uCopy, requests: state.requests - 1 };
    case DRINK_CREATE_RATING_SUCCESS:
      const drinkRatings = {
        ...state.user.drink_ratings,
        [action.payload.drink_id]: action.payload
      };
      return {
        ...state,
        requests: state.requests - 1,
        user: { ...state.user, drink_ratings: drinkRatings }
      };
    case DRINK_UPDATE_RATING_SUCCESS:
      const drkRatings = {
        ...state.user.drink_ratings,
        [action.payload.drink_id]: action.payload
      };
      return {
        ...state,
        requests: state.requests - 1,
        user: { ...state.user, drink_ratings: drkRatings }
      };
    case DRINK_DELETE_RATING_SUCCESS:
      const dRatings = { ...state.user.drink_ratings };
      delete dRatings[action.payload.drink_id];
      return {
        ...state,
        requests: state.request - 1,
        user: { ...state.user, drink_ratings: dRatings }
      };
    case LOGOUT:
      removeFromLocalStorage(LS_SESSION_KEY);
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default sessionReducer;
