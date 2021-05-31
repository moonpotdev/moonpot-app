const initialLanguage = () => {
    const storage = localStorage.getItem('site_language');
    return storage === null ? 'en' : storage;
}

const initialCurrency = () => {
    const storage = localStorage.getItem('site_currency');
    return storage === null ? 'usd' : storage;
}

const initialState = {
    network: 'bsc',
    language: initialLanguage(),
    currency: initialCurrency(),
    rpc: null,
    web3modal: null,
    address: null,
    pending: false,
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
        case "WALLET_RPC":
            return {
                ...state,
                rpc: action.payload.rpc,
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
        default:
            return state
    }
}

export default walletReducer;
