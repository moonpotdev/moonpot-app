import {
    SHOW_MODAL,
    HIDE_MODAL,
} from "../constants";

const initialState = {
    isOpen: false,
    modalType: null,
}

const modalReducer = (state = initialState, action) => {
    switch(action.type){
        case SHOW_MODAL: 
            return {
                ...state,
                isOpen: true,
                modalType: action.payload,
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