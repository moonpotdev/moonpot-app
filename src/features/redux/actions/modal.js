import {
    SHOW_MODAL,
    HIDE_MODAL,
} from "../constants";

const showModal = (modalType) => {
    return {type: SHOW_MODAL, payload: modalType};
}

const hideModal = () => {
    return {type: HIDE_MODAL};
}

const obj = {
    showModal,
    hideModal
}

export default obj