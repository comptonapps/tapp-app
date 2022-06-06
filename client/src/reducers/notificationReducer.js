import {
    ADD_NOTIFICATION,
    DELETE_NOTIFICATION
} from '../action/types/notification'

const INITIAL_STATE = { message: null};

const notificationReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case ADD_NOTIFICATION:
            return { message: action.payload };
        case DELETE_NOTIFICATION:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default notificationReducer;