import {
    SHOW_WRONG_CHAIN_MODAL,
    HIDE_MODAL,
} from "../constants";

const showWrongChainModal = () => {
    return {type: SHOW_WRONG_CHAIN_MODAL};
}

const hideModal = () => {
    return {type: HIDE_MODAL};
}

const obj = {
    showWrongChainModal,
    hideModal
}

export default obj