import {
    SHOW_WRONG_CHAIN_MODAL,
    HIDE_MODAL,
} from "../constants";

const showWrongChainModal = () => {
    console.log("showModal executed");
    return {type: SHOW_WRONG_CHAIN_MODAL};
}

const hideModal = () => {
    console.log("hideModal executed");
    return {type: HIDE_MODAL};
}

const obj = {
    showWrongChainModal,
    hideModal
}

export default obj