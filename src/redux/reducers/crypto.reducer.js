import {
  GET_CRYPTO_LIST,
  GET_CURRENT_CRYPTO,
  GET_ASSET_LIST,
  GET_WATCH_LIST,
} from '../types';

const initialState = {
  cryptoList: [],
  assetsList: [],
  watchList: [],
  loading: false,
  currentCrypto: {},
};

export default (state = initialState, action = { type: 'default' }) => {
  switch (action.type) {
    case GET_CRYPTO_LIST :
      return {
        ...state,
        loading: action.payload.loading,
        cryptoList: action.payload,
      }
    case GET_CURRENT_CRYPTO :
      return {
        ...state,
        loading: action.payload.loading,
        currentCrypto: action.payload,
      }
    case GET_ASSET_LIST :
      return {
        ...state,
        loading: action.payload.loading,
        assetsList: action.payload,
      }
    case GET_WATCH_LIST :
      return {
        ...state,
        loading: action.payload.loading,
        watchList: action.payload,
      }
    default:
      return state;
  }
};

