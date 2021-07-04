import {config} from '../../../config/config';
import Web3 from "web3";

const initialLanguage = () => {
    const storage = localStorage.getItem('site_language');
    return storage === null ? 'en' : storage;
}

const initialCurrency = () => {
    const storage = localStorage.getItem('site_currency');
    return storage === null ? 'usd' : storage;
}

const initialNetwork = () => {
    const storage = localStorage.getItem('network');
    return storage === null ? 'bsc' : storage;
}

const initialRpc = () => {
    const rpc = [];

    for(let network in config) {
        const c = config[network].rpc;
        rpc[network] = new Web3(c[~~(c.length * Math.random())]);
    }

    return rpc;
}

const initialAction = () => {
    return {result: null, data: null};
}

const initialExplorer = () => {
    const explorers = [];

    for(let key in config) {
        explorers[key] = config[key].explorerUrl;
    }

    return explorers;
}

const initialState = {
    network: initialNetwork(),
    language: initialLanguage(),
    currency: initialCurrency(),
    rpc: initialRpc(),
    web3modal: null,
    address: null,
    pending: false,
    explorer: initialExplorer(),
    action: initialAction(),
}

const walletReducer = (state = initialState, action) => {
    switch(action.type){
        case "WALLET_DISCONNECT":
            return {
                ...state,
                address: null,
            }
        case "WALLET_CONNECT_BEGIN":
            return {
                ...state,
                pending: true,
            }
        case "WALLET_CONNECT_DONE":
            return {
                ...state,
                pending: false,
                address: action.payload.address,
            }
        case "WALLET_CREATE_MODAL":
            return {
                ...state,
                web3modal: action.payload.data,
            }
        case "SET_NETWORK":
            return {
                ...state,
                network: action.payload.network,
                clients: action.payload.clients,
                rpc: false,
            }
        case "SET_LANGUAGE":
            return {
                ...state,
                language: action.payload.language,
            }
        case "SET_CURRENCY":
            return {
                ...state,
                currency: action.payload.currency,
            }
        case "WALLET_ACTION":
            return {
                ...state,
                action: {result: action.payload.result, data: action.payload.data},
            }
        case "WALLET_ACTION_RESET":
            return {
                ...state,
                action: initialAction(),
            }
        default:
            return state
    }
}

export default walletReducer;
