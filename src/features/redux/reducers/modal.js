import {
    SHOW_WRONG_CHAIN_MODAL,
    HIDE_MODAL,
} from "../constants";

const initialState = {
    isOpen: false,
    type: null,
}

const modalReducer = (state = initialState, action) => {
    switch(action.type){
        case SHOW_WRONG_CHAIN_MODAL:
            return {
                ...state,
                isOpen: true,
                modalType: 'SHOW_WRONG_CHAIN_MODAL',
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