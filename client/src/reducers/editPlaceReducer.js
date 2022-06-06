import { PLACES_EDIT_SUCCESS } from '../action/types/places'

const INITIAL_STATE = {
    place: {},
    draughts: {},
    requests: false,
    error: null
};

const EDIT_PLACE_REQUEST = 'EDIT_PLACE_REQUEST';
const EDIT_PLACE_SUCCESS = 'EDIT_PLACE_SUCCESS';
const EDIT_DRAUGHT_SUCCESS = 'EDIT_DRAUGHT_SUCCESS';
const EDIT_PLACE_ERROR = 'EDIT_PLACE_ERROR';
const DELETE_DRAUGHT_SUCCESS = 'DELETE_DRAUGHT_SUCCESS';
const NEW_DRAUGHT_SUCCESS = 'NEW_DRAUGHT_SUCCESS';
const RESET_EDIT_STATE = 'RESET_EDIT_STATE';

const editPlaceReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case PLACES_EDIT_SUCCESS:
            return { ...state, place: action.payload.place }
        case EDIT_PLACE_REQUEST:
            return { ...state, error: null, requests: true };
        case EDIT_PLACE_SUCCESS:
            return { ...state, requests: false, place: action.payload.place, draughts: action.payload.draughts };
        case EDIT_DRAUGHT_SUCCESS:
            const newData = action.payload;
            const draught = state.draughts[newData.drink_id];
            draught.active = newData.active;
            const newState = { ...state, requests: false, draughts: { ...state.draughts, [newData.drink_id]: draught}};
            return newState;
        case DELETE_DRAUGHT_SUCCESS:
            const draughtsCopy = { ...state.draughts };
            delete draughtsCopy[action.payload.id];
            return { ...state, requests: false, draughts: draughtsCopy }
        case EDIT_PLACE_ERROR:
            return { ...state, requests: false, error: action.error };
        case NEW_DRAUGHT_SUCCESS:
            return { ...state, draughts: {...state.draughts, ...action.payload} };
        case RESET_EDIT_STATE: 
            return INITIAL_STATE;
        default: 
            return state;
    }
};

export default editPlaceReducer;