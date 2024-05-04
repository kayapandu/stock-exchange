import {
  GET_CRYPTO_LIST,
  GET_CURRENT_CRYPTO,
  GET_ASSET_LIST,
  GET_WATCH_LIST,
  SET_USD_BALANCE,
} from '../types';

const initialState = {
  cryptoList: [],
  assetList: [],
  watchList: [],
  loading: false,
  currentCrypto: {},
  usdBalance: 0,
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
        assetList: action.payload,
      }
    case GET_WATCH_LIST :
      return {
        ...state,
        loading: action.payload.loading,
        watchList: action.payload,
      }
    case SET_USD_BALANCE :
      return {
        ...state,
        usdBalance: action.payload,
      }
    default:
      return state;
  }
};

