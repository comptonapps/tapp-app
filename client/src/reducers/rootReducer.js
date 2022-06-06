import { combineReducers } from 'redux';
import sessionReducer from './sessionReducer';
import drinkReducer from './drinkReducer';
import placeReducer from './placeReducer';
import editPlaceReducer from './editPlaceReducer';
import notificationReducer from './notificationReducer';

const rootReducer = combineReducers({
    sessionState: sessionReducer,
    drinkState: drinkReducer,
    placeState: placeReducer,
    editPlaceState: editPlaceReducer,
    notificationState: notificationReducer
});  

export default rootReducer;