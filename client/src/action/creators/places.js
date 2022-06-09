import Axios from "../../helpers/Axios";

import {
  PLACES_REQUEST,
  PLACES_CREATE_SUCCESS,
  PLACES_SINGLE_RECORD_REQUEST,
  PLACES_SUCCESS,
  PLACES_ERROR,
  PLACES_LIMIT_CHANGE,
  PLACES_SORT_CHANGE,
  PLACES_MAX,
  PLACES_EDIT_SUCCESS
} from "../types/places";

import CONSTANTS from "../../constants";
const { API_BASE_URL, API_PLACE_ENDPOINT } = CONSTANTS;

export const getPlaces = () => {
  return async function(dispatch, getState) {
    try {
      //dispatch({type: PLACES_REQUEST});
      const { currentPage: page, limit } = getState().placeState;
      const { preferredLocation } = getState().sessionState;
      const response = await Axios.get(
        `/api${API_PLACE_ENDPOINT}?city=${preferredLocation.city}&state=${
          preferredLocation.state
        }&page=${page + 1}&limit=${limit}`
      );
      dispatch(gotPlaces(response.data.places));
    } catch (e) {}
  };
};

export const createPlace = (placeData, completion) => {
  return async function(dispatch, getState) {
    try {
      const userId = getState().sessionState.user.id;
      dispatch({ type: PLACES_REQUEST });
      const response = await Axios.post(`/api/user/${userId}/place`, placeData);
      dispatch(createdPlace(response.data));
      return completion(response.data.place.id);
    } catch (e) {
      console.log(e);
    }
  };
};

function createdPlace(data) {
  data.place.num_ratings = 0;
  data.place.rating = 0;
  return {
    type: PLACES_CREATE_SUCCESS,
    payload: { place: data.place, place_owner: data.place_owner }
  };
}

function gotPlaces(placeArray) {
  if (!placeArray.length) {
    return { type: PLACES_MAX };
  }
  const places = {};
  const sortedIdArray = [];
  placeArray.forEach(p => {
    places[p.id] = p;
    p.num_ratings = +p.num_ratings;
    p.rating = Number(p.rating);
    sortedIdArray.push(p.id);
  });
  return { type: PLACES_SUCCESS, payload: { places, sortedIdArray } };
}

export const gotPlace = placeData => {};

export const updatePlace = (placeId, placeData, completion) => {
  return async function(dispatch, getState) {
    try {
      const userId = getState().sessionState.user.id;
      dispatch({ type: PLACES_REQUEST });
      const response = await Axios.patch(
        `/api${API_PLACE_ENDPOINT}/${placeId}`,
        placeData
      );
      dispatch(updatedPlace(response.data.place));
      completion(response.data, response, null);
    } catch (e) {
      console.log(e.response);
      completion(null, e.response, e);
    }
  };
};

function updatedPlace(place) {
  return { type: PLACES_EDIT_SUCCESS, payload: { id: place.id, place } };
}
