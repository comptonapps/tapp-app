import {
    PLACES_REQUEST,
    PLACES_INSERT_RECORD,
    PLACES_SUCCESS,
    PLACES_CREATE_SUCCESS,
    PLACES_ERROR,
    PLACES_LIMIT_CHANGE,
    PLACES_SORT_CHANGE,
    PLACES_MAX,
    PLACES_EDIT_SUCCESS
} from '../action/types/places';

import {
    AUTH_SUCCESS,
    REFRESH_SUCCESS,
    PLACE_CREATE_RATING_SUCCESS,
    PLACE_UPDATE_RATING_SUCCESS,
    PLACE_DELETE_RATING_SUCCESS
} from '../action/types/session';

import { CHANGE_LOCATION } from '../action/types/global';

const INITIAL_STATE = { 
    sortedResults: [], 
    places: {}, 
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

const placeReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case PLACES_INSERT_RECORD:
            return { ...state, places: {...state.places, ...action.payload}};
        case PLACES_SUCCESS:
            return { ...state, currentPage: state.currentPage + 1, sortedResults: [...state.sortedResults, ...action.payload.sortedIdArray], places: { ...state.places, ...action.payload.places}};
        case PLACES_CREATE_SUCCESS:
            return { ...state, places: {...state.places, [action.payload.place.id]: action.payload.place}}
        case PLACES_MAX:
            return { ...state, hasMore: false };
        case PLACES_EDIT_SUCCESS:
            return { ...state, places: {...state.places, [action.payload.id]: {...state.places[action.payload.id], ...action.payload.place}}}
        case PLACE_CREATE_RATING_SUCCESS:
            const place = {...state.places[action.payload.place_id]};
            const ratingsTotal = getRatingsTotal(place);
            const newTotal = getNewRatingsTotal(ratingsTotal, action.payload.rating);
            const newAverageRating = getNewAvgRating(newTotal, +place.num_ratings, true);
            place.rating = newAverageRating;
            place.num_ratings = +place.num_ratings + 1;
            return { ...state, places: {...state.places, [action.payload.place_id]: place}};
        case PLACE_UPDATE_RATING_SUCCESS:
            const plc = { ...state.places[action.payload.place_id]};
            const rtgsTotal = getRatingsTotal(plc);
            const updatedTotal = getNewRatingsTotal(rtgsTotal, action.payload.rating, action.payload.old_rating);
            plc.rating = getNewAvgRating(updatedTotal, +plc.num_ratings);
            return { ...state, places: { ...state.places, [action.payload.place_id]: plc}};
        case PLACE_DELETE_RATING_SUCCESS:
            const pl = { ...state.places[action.payload.place_id]};
            const rtgTotal = getRatingsTotal(pl) - action.payload.rating;
            const newAvg = rtgTotal - (+pl.num_ratings - 1);
            pl.rating = newAvg;
            pl.num_ratings = pl.num_ratings - 1;
            return { ...state, places: { ...state.places, [action.payload.place_id]: pl}};
        case AUTH_SUCCESS:
        case REFRESH_SUCCESS:
            const userPlaces = action.payload.places;
            const newPlaces = {};
            Object.keys(userPlaces).forEach(id => {
                if (!state.places[id]) {
                    newPlaces[id] = userPlaces[id];
                }
            })
            return { ...state, places: {...state.places, ...newPlaces}};
        case CHANGE_LOCATION:
            return {...state, hasMore: true, sortedResults: [], currentPage: 0};
        default: 
            return state;
    };
};

function getNewAvgRating(total, numRatings, newRating=false) {
    let devisor = numRatings;
    if (newRating) {
        devisor += 1;
    }
    return total / devisor;
}


function getRatingsTotal(place) {
    return +place.num_ratings * Number(place.rating);
}

function getNewRatingsTotal(total, rating, oldRating=0) {
    return total + rating - oldRating;
}

export default placeReducer;