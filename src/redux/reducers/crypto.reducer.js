import {
  GET_CRYPTO_LIST
} from '../types';

const initialState = {
  cryptoList: [],
  assetsList: [],
  watchList: [],
  loading: false,
};

export default (state = initialState, action = { type: 'default' }) => {
  switch (action.type) {
    case GET_CRYPTO_LIST :
      return {
        ...state,
        loading: action.payload.loading,
        cryptoList: action.payload,
      }
    default:
      return state;
  }
};

