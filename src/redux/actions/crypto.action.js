import { PING_CRYPTO_LIST, GET_CRYPTO_LIST } from "@redux/types";
import marketDataService from '../../services/marketData';

export const pingMarketData = () => {
  marketDataService.pingMarket()
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

export const getCoinById = coinId => {
  marketDataService.getCoinById(coinId)
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

export const getCoinList = () => {
  marketDataService.getCoinList()
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

export const getCoinMarketList = () => {
  const params = {
    vs_currency: 'USD',
    per_page: 10,
    page: 1,
  };

  marketDataService.getCoinMarketList(params)
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

