export const selectWalletNetwork = state => state.wallet.network;
export const selectWalletAddress = state => state.wallet.address;
export const selectWalletStatus = state => state.wallet.status;
export const selectWalletConnectedAddress = state =>
  state.wallet.status === 'connected' && state.wallet.address ? state.wallet.address : null;
