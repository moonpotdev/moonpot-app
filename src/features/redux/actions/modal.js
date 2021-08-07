import {
    SHOW_MODAL,
    HIDE_MODAL,
} from "../constants";

const showModal = () => {
    console.log("showModal executed");
    return {type: SHOW_MODAL};
}

const hideModal = () => {
    console.log("hideModal executed");
    return {type: HIDE_MODAL};
}

const obj = {
    showModal,
    hideModal
}

export default obj