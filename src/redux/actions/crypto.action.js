import { 
  GET_CRYPTO_LIST,
  GET_CURRENT_CRYPTO,
  GET_ASSET_LIST,
  GET_WATCH_LIST,
  SET_USD_BALANCE,
} from "@redux/types";
import marketDataService from '../../services/marketData';

function isObject(value) {
  return value !== null && typeof value === 'object';
}

export const pingMarketData = () => {
  marketDataService.pingMarket()
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

export const setAssetBalance = (balance, dispatch) => {
  dispatch({
    type: SET_USD_BALANCE,
    payload: balance,
  });
};

export const getCoinById = async (coinId, dispatch) => {
  let data;

  marketDataService.getCoinById(coinId)
    .then(res => {
      if (res && isObject(res)) {
        data = res;
      } else {
        data = {};
      }
    })
    .catch(err => console.log(err))
    .finally(() => {
      dispatch({ type: GET_CURRENT_CRYPTO, payload: data });
    })

    return data;
};

export const getCoinChartOHLC = async (coinId, range = 1) => {
  const params = {
    vs_currency: 'USD',
    days: range,
  };

  let data;

  await marketDataService.getCoinChart(coinId, params)
    .then(res => {
      if (res) {
        data = res;
      } else {
        data = [];
      }
    })
    .catch(err => {
      console.log(err);
      data = [];
    });
  
  return data;
};

export const getCoinList = () => {
  marketDataService.getCoinList()
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

export const getCoinMarketById = async (list, isWatchlist, dispatch) => {
  const params = {
    vs_currency: 'usd',
    ids: list,
    page: 1,
    price_change_percentage: '1h',
    locale: 'en',
  };

  let data;
  let actionType = isWatchlist ? GET_WATCH_LIST : GET_ASSET_LIST;

  marketDataService.getCoinMarketList(params)
    .then(res => {
      if (res.length > 0) {
        data = res;
      } else {
        data = [];
      }
    })
    .catch(err => {
      console.log(err);
      data = [];
    })
    .finally(() => {
      dispatch({ type: actionType, payload: data });
    });

    return data;
};

export const getCoinMarketList = async ({ page }, dispatch) => {
  const params = {
    vs_currency: 'usd',
    per_page: 10,
    page,
  };

  let data;

  marketDataService.getCoinMarketList(params)
    .then(res => {
      if (res.length > 0) {
        data = res;
      } else {
        data = [];
      }
    })
    .catch(err => console.log(err))
    .finally(() => {
      dispatch({ type: GET_CRYPTO_LIST, payload: data });
    });
};

