import axios from 'axios';
import nftPromoClaimAbi from '../../config/abi/nftPromoClaim.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { networkById } from '../../config/networks';
import { getWalletWeb3 } from '../wallet/instances';

export const NFT_PROMO_CLAIM_PENDING = 'NFT_PROMO_CLAIM_PENDING';
export const NFT_PROMO_CLAIM_COMPLETE = 'NFT_PROMO_CLAIM_COMPLETE';

// TODO use new way to get web3 instance
export const fetchEligibleInfo = createAsyncThunk(
  'promo/fetchEligibleInfo',
  async (promoId, { getState }) => {
    const state = getState();
    const { address, network } = state.wallet;
    const web3 = getWalletWeb3();
    const contractAddress = networkById[network].nftPromoClaimAddress;

    if (address && web3) {
      const claimContract = new web3.eth.Contract(nftPromoClaimAbi, contractAddress);
      return await claimContract.methods.userEligibleInfo(promoId, address).call();
    }
  }
);

export const fetchPromoCodes = createAsyncThunk(
  'promo/fetchPromoCodes',
  async (promo, { getState }) => {
    const state = getState();
    const { address } = state.wallet;
    const web3 = getWalletWeb3();

    if (address && web3) {
      let dataToSign = web3.utils.utf8ToHex(promo.message);
      let signature = await web3.eth.personal.sign(dataToSign, address, '');
      const request = await axios.get(
        `https://api.moonpot.com/promocodes?promo=${promo.name}&signature=${signature}`,
        {
          timeout: 10000,
        }
      );
      return request.status === 200 ? request.data.data : [];
    }
  }
);

export function claimTokenId(promoId, tokenId) {
  return async (dispatch, getState) => {
    const state = getState();
    const { address, network } = state.wallet;
    const web3 = getWalletWeb3();
    const contractAddress = networkById[network].nftPromoClaimAddress;

    if (address && web3) {
      const claimContract = new web3.eth.Contract(nftPromoClaimAbi, contractAddress);
      claimContract.methods
        .claim(promoId, tokenId)
        .send({ from: address })
        .on('transactionHash', function (hash) {
          dispatch({ type: NFT_PROMO_CLAIM_PENDING });
        })
        .on('receipt', function (receipt) {
          dispatch(fetchEligibleInfo(promoId));
        })
        .on('error', function (error) {
          dispatch({ type: NFT_PROMO_CLAIM_COMPLETE });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
}
