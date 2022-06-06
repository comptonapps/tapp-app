import {
    ADD_NOTIFICATION,
    DELETE_NOTIFICATION
} from '../action/types/notification';

export const notify = (msg, dispatch) => {
    dispatch({type: ADD_NOTIFICATION, payload: msg});
    dispatch({type: DELETE_NOTIFICATION});
};