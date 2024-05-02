import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAssetListData = async () => {
  let data = [];
  try {
    const jsonValue = await AsyncStorage.getItem('@assetlist_coins');
    data = jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.log('error!!', error);
  }

  return data;
};

export const getWatchListData = async () => {
  let data = [];
  try {
    const jsonValue = await AsyncStorage.getItem('@watchlist_coins');
    data = jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.log('error!!', error);
  }

  return data;
};

export const setAssetListData = async (item) => {
  const assets = await getAssetListData();
  try {
    const assetList = [...assets, item];
    const jsonValue = JSON.stringify(assetList);
    await AsyncStorage.setItem('@assetlist_coins', jsonValue);
  } catch (error) {
    console.log(error);
  }
};

export const setWatchListData = async (item) => {
  const data = await getWatchListData();
  try {
    const watchList = [...data, item];
    const jsonValue = JSON.stringify(watchList);
    await AsyncStorage.setItem('@watchlist_coins', jsonValue);
  } catch (error) {
    console.log(error);
  }
};