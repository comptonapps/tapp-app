import {
    DRINKS_REQUEST,
    DRINKS_SINGLE_RECORD_REQUEST,
    DRINKS_SINGLE_SUCCESS,
    DRINKS_SUCCESS,
    DRINKS_ERROR,
    DRINKS_LIMIT_CHANGE,
    DRINKS_SORT_CHANGE,
    DRINKS_MAX
} from '../action/types/drinks';

import {
    AUTH_SUCCESS,
    REFRESH_SUCCESS,
    DRINK_CREATE_RATING_SUCCESS,
    DRINK_UPDATE_RATING_SUCCESS,
    DRINK_DELETE_RATING_SUCCESS
} from '../action/types/session';
import Drink from '../components/Drink/Drink';

const INITIAL_STATE = { 
    sortedResults: [], 
    drinks: {}, 
    currentSort: {
        term: "name",
        asc: false
    }, 
    hasMore: true, 
    requests: 0, 
    error: null,
    currentPage: 0,
    limit: 25 
};

const drinkReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case DRINKS_REQUEST:
            return state;
        case DRINKS_SINGLE_SUCCESS:
            return { ...state, drinks: { ...state.drinks, [action.payload.id]: action.payload}}
        case DRINKS_SUCCESS:
            return {...state, currentPage: state.currentPage + 1, sortedResults: [...state.sortedResults, ...action.payload.sortedIdArray], drinks: {...state.drinks, ...action.payload.drinks} };
        case DRINKS_MAX:
            return {...state, hasMore: false};
        case DRINK_CREATE_RATING_SUCCESS:
            return { ...state, drinks: { ...state.drinks, [action.payload.drink_id]: handleRatingCreation(state.drinks[action.payload.drink_id], action.payload.rating)} }
        case DRINK_UPDATE_RATING_SUCCESS:
            return {...state, drinks: { ...state.drinks, [action.payload.drink_id]: handleRatingUpdate(state.drinks[action.payload.drink_id], action.payload.rating, action.payload.old_rating)}};
        case DRINK_DELETE_RATING_SUCCESS:
            return { ...state, drinks: { ...state.drinks, [action.payload.drink_id]: handleRatingDelete(state.drinks[action.payload.drink_id], action.payload.old_rating )}};
        case AUTH_SUCCESS:
        case REFRESH_SUCCESS:
            const newDrinks = {};
            Object.values(action.payload.drinks).forEach(d => {
                if (!state.drinks[d.id]) {
                    newDrinks[d.id] = d;
                }
            });
            return {...state, drinks: {...state.drinks, ...newDrinks }};
        default: 
            return state;
    };
};

function handleRatingCreation(drink, rating) {
    const numberOfRatings = +drink.num_ratings + 1;
    const totalRatingScore = Number(drink.rating) * +drink.num_ratings + rating;
    const drkCopy = { ...drink, rating: totalRatingScore/numberOfRatings, num_ratings: numberOfRatings } 
    return drkCopy;
};

function handleRatingUpdate(drink, rating, oldRating) {
    const numberOfRatings = +drink.num_ratings;
    const totalRatingScore = Number(drink.rating) * +drink.num_ratings + rating - oldRating;
    const drkCopy = { ...drink, rating: totalRatingScore / numberOfRatings};
    return drkCopy;
}

function handleRatingDelete(drink, oldRating) {
    const totalRatingScore = Number(drink.rating) * +drink.num_ratings - oldRating;
    const numberOfRatings = +drink.num_ratings - 1;
    const drkCopy = { ...drink, rating: totalRatingScore / numberOfRatings, num_ratings: numberOfRatings };
    return drkCopy;

    
}

// function getDrinkDataAfterDelete(drink, oldRating) {

// }

export default drinkReducer;