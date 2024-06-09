import ApiService from "src/utils/api";

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY2 = 'CG-9EuYj2nMbTHTb9Tj4CSMmEC2';

const keyParams = {
  'x-cg-pro-api-key': API_KEY2,
};

const client = new ApiService({ baseURL: BASE_URL });
const marketDataService = {};

marketDataService.pingMarket = () => client.get(`/ping`, {params: keyParams});
marketDataService.getCoinById = (coinId) => client.get(`/coins/${coinId}`, { params: keyParams});
marketDataService.getCoinChart = (coinId, queryParams) => client.get(`/coins/${coinId}/ohlc`, { params: {...keyParams, ...queryParams}});
marketDataService.getCoinList = () => client.get(`/coins/list`, {params: {...keyParams}});
marketDataService.getCoinMarketList = queryParams => client.get(`/coins/markets`, { params: {...queryParams, ...keyParams}});


export default marketDataService;
