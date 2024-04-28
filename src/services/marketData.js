import ApiService from "src/utils/api";

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = '2792c11a-6c45-470e-9fd8-c9339b22dc3e';
const API_KEY2 = 'CG-9EuYj2nMbTHTb9Tj4CSMmEC2';

const defaultHeaders = {
  'accept': 'application/json',
  'x-cg-pro-api-key': API_KEY2,
}

const keyParams = {
  'x-cg-pro-api-key': API_KEY2,
};

const client = new ApiService({ baseURL: BASE_URL });
const marketDataService = {};

marketDataService.pingMarket = () => client.get(`/ping`, {params: keyParams});
marketDataService.getCoinById = (coinId) => client.get(`/coins/01coin`);
marketDataService.getCoinList = () => client.get(`/coins/list`, {params: {...keyParams}});
marketDataService.getCoinMarketList = queryParams => client.get(`/coins/markets`, { params: {...queryParams, ...keyParams}});


export default marketDataService;
