import {
    SHOW_MODAL,
    HIDE_MODAL,
} from "../constants";

const initialState = {
    isOpen: false,
}

const modalReducer = (state = initialState, action) => {
    switch(action.type){
        case SHOW_MODAL:
            return {
                ...state,
                isOpen: true
            }
        case HIDE_MODAL:
            return {
                ...state,
                isOpen: false
            }
        default:
            return state
    }
}


export default modalReducer;