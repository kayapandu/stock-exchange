import { 
  PING_CRYPTO_LIST,
  GET_CRYPTO_LIST,
  GET_CURRENT_CRYPTO,
  GET_ASSET_LIST,
  GET_WATCH_LIST,
} from "@redux/types";
import marketDataService from '../../services/marketData';


export const pingMarketData = () => {
  marketDataService.pingMarket()
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

export const getCoinById = async (coinId, dispatch) => {
  let data;

  marketDataService.getCoinById(coinId)
    .then(res => {
      if (res) {
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
        console.log('xxxhre');
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

export const getCoinMarketList = async dispatch => {
  const params = {
    vs_currency: 'usd',
    per_page: 10,
    page: 1,
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

