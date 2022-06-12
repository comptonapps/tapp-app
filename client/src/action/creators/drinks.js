import Axios from "../../helpers/Axios";

import {
  DRINKS_REQUEST,
  DRINKS_SINGLE_SUCCESS,
  DRINKS_SUCCESS,
  DRINKS_MAX
} from "../types/drinks";

import CONSTANTS from "../../constants";
const { API_DRINK_ENDPOINT } = CONSTANTS;

export const getDrinks = () => {
  return async function(dispatch, getState) {
    try {
      dispatch({ type: DRINKS_REQUEST });
      const { currentPage, limit } = getState().drinkState;
      const response = await Axios.get(
        `/api${API_DRINK_ENDPOINT}?limit=${limit}&page=${currentPage +
          1}&sort=name`
      );
      dispatch(gotDrinks(response.data.drinks));
    } catch (e) {
      console.log(e);
    }
  };
};

function gotDrinks(drinksArray) {
  if (!drinksArray.length) {
    return { type: DRINKS_MAX };
  }
  const drinks = {};
  const sortedIdArray = [];
  drinksArray.forEach(d => {
    drinks[d.id] = d;
    d.num_ratings = +d.num_ratings;
    d.rating = Number(d.rating);
    sortedIdArray.push(d.id);
  });
  return { type: DRINKS_SUCCESS, payload: { drinks, sortedIdArray } };
}

// function gotPlaces(placeArray) {
//     if (!placeArray.length) {
//         return { type: PLACES_MAX };
//     }
//     const places = {};
//     const sortedIdArray = [];
//     placeArray.forEach(p => {
//         places[p.id] = p;
//         p.num_ratings = +p.num_ratings;
//         p.rating = Number(p.rating);
//         sortedIdArray.push(p.id);
//     });
//     return { type: PLACES_SUCCESS, payload: {places, sortedIdArray} };
// };

export const gotDrink = drink => {
  return { type: DRINKS_SINGLE_SUCCESS, payload: drink };
};
