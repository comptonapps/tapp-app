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
} from "../types/session";

import Axios from "../../helpers/Axios";

import { notify } from "../../helpers/notify";

import CONSTANTS from "../../constants";

const {
  API_LOGIN_ENDPOINT,
  API_REGISTER_ENDPOINT,
  API_USER_ENDPOINT
} = CONSTANTS;

export const loginUser = loginData => {
  return async function(dispatch) {
    try {
      dispatch({ type: AUTH_REQUEST });
      const response = await Axios.post(`/api${API_LOGIN_ENDPOINT}`, loginData);
      dispatch(loggedInUser({ ...response.data }));
      notify(`Welcome back, ${response.data.user.username}!`, dispatch);
    } catch (e) {
      if (e.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          message: "Incorrect Username or Password"
        });
      } else {
        dispatch({ type: AUTH_ERROR, message: "error logging in user" });
      }
    }
  };
};

export const registerUser = registerData => {
  return async function(dispatch) {
    try {
      dispatch({ type: AUTH_REQUEST });
      const response = await Axios.post(
        `/api${API_REGISTER_ENDPOINT}`,
        registerData
      );
      dispatch(loggedInUser(response.data));
      notify(`Welcome, ${response.data.user.username}!`, dispatch);
    } catch (e) {
      dispatch({ type: AUTH_ERROR, message: "error registering user" });
    }
  };
};

export const refreshSessionUser = () => {
  return async function(dispatch, getState) {
    try {
      dispatch({ type: AUTH_REQUEST });
      const id = getState().sessionState.user.id;
      const response = await Axios.get(`/api${API_USER_ENDPOINT}/${id}`);
      dispatch(refreshedUser(response.data.user));
    } catch (e) {
      console.log("ERROR", e.request);
    }
  };
};

export const createPlaceRating = (rating, place_id) => {
  return async function(dispatch, getState) {
    try {
      dispatch({ type: AUTH_REQUEST });
      const userId = getState().sessionState.user.id;
      const response = await Axios.post(
        `/api/user/${userId}/rating/place/${place_id}`,
        { rating }
      );
      dispatch({
        type: PLACE_CREATE_RATING_SUCCESS,
        payload: response.data.place_rating
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const updatePlaceRating = (newRating, oldRating, id) => {
  return async function(dispatch, getState) {
    try {
      dispatch({ type: AUTH_REQUEST });
      const userId = getState().sessionState.user.id;
      const response = await Axios.patch(
        `/api/user/${userId}/rating/place/${id}`,
        {
          rating: newRating
        }
      );
      const rating = response.data.place_rating;
      rating["old_rating"] = oldRating;
      dispatch({ type: PLACE_UPDATE_RATING_SUCCESS, payload: rating });
    } catch (e) {
      console.log(e);
    }
  };
};

export const deletePlaceRating = (rating, id) => {
  return async function(dispatch, getState) {
    try {
      dispatch({ type: AUTH_REQUEST });
      const userId = getState().sessionState.user.id;
      await Axios.delete(`/api/user/${userId}/rating/place/${id}`);
      dispatch({
        type: PLACE_DELETE_RATING_SUCCESS,
        payload: { place_rating: rating, place_id: id }
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const createDrinkRating = (rating, id) => {
  return async function(dispatch, getState) {
    try {
      dispatch({ type: AUTH_REQUEST });
      const userId = getState().sessionState.user.id;
      const response = await Axios.post(
        `/api${API_USER_ENDPOINT}/${userId}/rating/drink/${id}`,
        { rating }
      );
      dispatch({
        type: DRINK_CREATE_RATING_SUCCESS,
        payload: response.data.drink_rating
      });
    } catch (e) {
      dispatch({ type: AUTH_ERROR, message: "error creating drink rating" });
    }
  };
};

export const updateDrinkRating = (rating, oldRating, id) => {
  return async function(dispatch, getState) {
    try {
      dispatch({ type: AUTH_REQUEST });
      const userId = getState().sessionState.user.id;
      const response = await Axios.patch(
        `/api${API_USER_ENDPOINT}/${userId}/rating/drink/${id}`,
        { rating }
      );
      dispatch({
        type: DRINK_UPDATE_RATING_SUCCESS,
        payload: { ...response.data.drink_rating, old_rating: oldRating }
      });
    } catch (e) {
      dispatch({ type: AUTH_ERROR, message: "error updating drink rating" });
    }
  };
};

export const deleteDrinkRating = (oldRating, id) => {
  return async function(dispatch, getState) {
    try {
      dispatch({ type: AUTH_REQUEST });
      const userId = getState().sessionState.user.id;
      await Axios.delete(
        `/api${API_USER_ENDPOINT}/${userId}/rating/drink/${id}`
      );
      dispatch({
        type: DRINK_DELETE_RATING_SUCCESS,
        payload: { old_rating: oldRating, drink_id: id }
      });
    } catch (e) {
      dispatch({ type: AUTH_ERROR, message: "error deleting drink" });
    }
  };
};

function refreshedUser(user) {
  const drinks = {};
  const places = {};
  const placesOwned = {};
  const placeRatings = {};
  const drinkRatings = {};
  if (user.drink_ratings && user.drink_ratings.length) {
    user.drink_ratings.forEach(dr => {
      drinks[dr.drink_id] = dr.drink;
      delete dr.drink;
      drinkRatings[dr.drink_id] = dr;
    });
  }
  if (user.place_ratings && user.place_ratings.length) {
    user.place_ratings.forEach(pr => {
      places[pr.place_id] = pr.place;
      delete pr.place;
      placeRatings[pr.place_id] = pr;
    });
  }
  if (user.places_owned && user.places_owned.length) {
    user.places_owned.forEach(po => {
      places[po.place_id] = po.place;
      delete po.place;
      placesOwned[po.place_id] = po;
    });
  }
  return {
    type: REFRESH_SUCCESS,
    payload: {
      user: {
        ...user,
        places_owned: placesOwned,
        place_ratings: placeRatings,
        drink_ratings: drinkRatings
      },
      places,
      drinks
    }
  };
}

function loggedInUser(payload) {
  const userCopy = { ...payload.user };
  let placeRatings = {};
  let drinkRatings = {};
  let placesOwned = {};
  const drinks = {};
  const places = {};
  if (payload.user.place_ratings && payload.user.place_ratings.length) {
    payload.user.place_ratings.forEach(pr => {
      places[pr.place_id] = pr.place;
      delete pr.place;
      placeRatings[pr.place_id] = pr;
    });
  }
  userCopy.place_ratings = placeRatings;
  if (payload.user.drink_ratings && payload.user.drink_ratings.length) {
    payload.user.drink_ratings.forEach(pr => {
      drinks[pr.drink_id] = pr.drink;
      delete pr.drink;
      drinkRatings[pr.drink_id] = pr;
    });
  }
  userCopy.drink_ratings = drinkRatings;
  if (payload.user.places_owned && payload.user.places_owned.length) {
    payload.user.places_owned.forEach(po => {
      places[po.place_id] = po.place;
      delete po.place;
      placesOwned[po.place_id] = po;
    });
  }
  userCopy.places_owned = placesOwned;
  payload.user = userCopy;
  payload.drinks = drinks;
  payload.places = places;
  return { type: AUTH_SUCCESS, payload };
}
