import axios from 'axios';
import Web3 from 'web3';
import nftPromoClaimAbi from '../../config/abi/nftPromoClaim.json';
import { config } from '../../config/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const NFT_PROMO_CLAIM_PENDING = 'NFT_PROMO_CLAIM_PENDING';
export const NFT_PROMO_CLAIM_COMPLETE = 'NFT_PROMO_CLAIM_COMPLETE';

export const fetchEligibleInfo = createAsyncThunk(
  'promo/fetchEligibleInfo',
  async (promoId, { getState }) => {
    const state = getState();
    const { address, network } = state.walletReducer;
    const provider = await state.walletReducer.web3modal.connect();
    const contractAddress = config[network].nftPromoClaimAddress;

    if (address && provider) {
      const web3 = new Web3(provider);
      const claimContract = new web3.eth.Contract(nftPromoClaimAbi, contractAddress);
      return await claimContract.methods.userEligibleInfo(promoId, address).call();
    }
  }
);

export const fetchPromoCodes = createAsyncThunk(
  'promo/fetchPromoCodes',
  async (promo, { getState }) => {
    const state = getState();
    const { address } = state.walletReducer;
    const provider = await state.walletReducer.web3modal.connect();

    if (address && provider) {
      const web3 = new Web3(provider);
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
    const { address, network } = state.walletReducer;
    const provider = await state.walletReducer.web3modal.connect();
    const contractAddress = config[network].nftPromoClaimAddress;

    if (address && provider) {
      const web3 = new Web3(provider);
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
