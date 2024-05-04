import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Animated, View, useWindowDimensions, TouchableOpacity, Image, ScrollView, RefreshControl} from 'react-native';
import { Card, Text, List, Surface } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import beachImage from 'assets/beach.png';

import { 
  getAssetListData,
  getWatchListData,
  removeAssetlistCoinId,
  setDefaultBalance,
  getDefaultBalance,
} from 'src/utils/storage';

import { countPercentage, countTotalBalance } from 'src/utils/assets';

import { 
  getCoinById,
  getCoinMarketById,
  setAssetBalance,
} from '@redux/actions/crypto.action';

import styles from './Home.screen.styles';
import { COLOR } from '@constants/constants';

const Home = function() {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const { navigate, isFocused } = useNavigation();

  const cryptoList = useSelector(state => state.cryptoList);
  const watchListData = useSelector(state => state.watchList);
  const assetListData = useSelector(state => state.assetList);
  const assetBalance = useSelector(state => state.usdBalance);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'assets', title: 'Assets' },
    { key: 'watchlist', title: 'Watchlist' },
  ]);
  const [assetList, setAssetList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleOnDetail = useCallback(async item => {
    await getCoinById(item.id, dispatch);
    navigate('Detail');
  }, []);

  const getWatchList = useCallback(async () => {
    const currentWatchlist = await getWatchListData();
    const seedWatchlist = ['bitcoin', 'tether', 'ethereum', 'dogecoin'];

    const listWatch = currentWatchlist.length > 0 ? currentWatchlist : seedWatchlist;
    const list = listWatch.toString();
    
    await getCoinMarketById(list, true, dispatch);
  }, []);

  const getAssetList = useCallback(async () => {
    const currentAssetlist = await getAssetListData();
    const idAssetList = [];

    if (currentAssetlist.length === 0) { 
      setAssetBalance(1000, dispatch);
      setDefaultBalance(1000);
    } else {
      currentAssetlist.forEach(item => idAssetList.push(item.id));
      setAssetList(currentAssetlist);
      const list = idAssetList.toString();

      await getCoinMarketById(list, false, dispatch);
    };

  }, []);

  useEffect(() => {
    getAssetList();
    getWatchList();

  }, [isFocused]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAssetList();
    await getWatchList();
    setRefreshing(false);
  }, []);

  const renderValuePercentage = useCallback((percentage, isSmall = false) => {
    const isUp = parseFloat(percentage) > 0;
    return (
      <Surface
        style={isUp ? 
            {...styles.profitContainer}
          : 
            {...styles.lossContainer}
        }
        elevation={2}
      >
        <MaterialCommunityIcons 
          name={isUp ? 'chevron-up' : 'chevron-down' }
          color='black'
          size={isSmall ? 14 : 20 }
        />
        <Text variant={isSmall ? 'titleSmall' : 'titleMedium' }>
          {percentage} %
        </Text>
      </Surface>
    )
  }
  ,[]);

  const TOTAL_ASSETS = useMemo(() => countTotalBalance(assetList, assetListData), [assetList, assetListData]);

  const renderBalanceProfit = useMemo(() =>
    <View style={{ flex: 1, flexDirection: 'column'}}>
      <Text style={{ fontWeight: '600'}} variant='titleMedium'>Your Assets</Text>
      <View style={{ ...styles.balanceContainer,  ...styles.balanceTextContainer}}>
        <Text style={{ fontWeight: 'bold'}} variant='displaySmall'>
          {TOTAL_ASSETS.balanceNow || 0}
        </Text>
        <Text style={{ marginLeft: 4 }} variant='titleMedium'>USD</Text>
      </View>
    </View>
  , [assetBalance, isFocused, TOTAL_ASSETS]);

  const renderPortofolio = useMemo(() => (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <Text variant='titleSmall'>Hello, Pandu</Text>
        <View style={{ ...styles.balanceContainer, justifyContent: 'space-between', alignItems: 'center' }}>
          {renderBalanceProfit}
          <Image source={beachImage} style={{ width: 130, height: 130}} />
        </View>
        <View style={{ width: '30%' }}>
          {renderValuePercentage(TOTAL_ASSETS.percentage || 0)}
        </View>
      </Card.Content>
    </Card>
  ), [renderBalanceProfit, isFocused, TOTAL_ASSETS]);

  const renderLeftIcon = useCallback(icon => <Image source={{ uri: icon}} style={{ alignSelf: 'center' }} width={30} height={30} />,[])

  const renderRightIcon = useCallback((currentPrice, percentage) => (
    <View style={{ display: 'flex', alignItems: 'flex-end' }}>
      <Text variant='titleSmall' style={{ fontWeight: '800' }}>$ {currentPrice}</Text>
      {renderValuePercentage(percentage?.toFixed(2), true)}
    </View>
  ), []);

  const renderItem = useCallback(item =>
    <List.Item
      id={`item_${item?.symbol}`}
      key={`key_${item?.symbol}`}
      title={item?.symbol.toUpperCase()}
      description={item?.name.toUpperCase()}
      titleStyle={styles.listCardTitle}
      descriptionStyle={styles.listCardDesc}
      right={() => renderRightIcon(item?.current_price, item?.price_change_percentage_24h)}
      left={() => renderLeftIcon(item?.image)}
      onPress={() => handleOnDetail(item)}
      style={styles.listCard}
    />
  , []);

  const renderNoData = useMemo(() => (
    <View 
      style={{ 
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      }}>
      <MaterialCommunityIcons 
        name='book-cancel'
        color='black'
        size={20}
      />
      <Text style={{ marginLeft: 5, fontWeight: '800' }} variant='labelMedium'>Oops, there's no lists yet</Text>
    </View>
  ));

  const renderListAssets = useCallback(() => (
    <ScrollView 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      style={{ padding: 10 }}>
      {
        assetListData.length > 0 ?
          assetListData?.map(item => {
            const currAsset = assetList.find(val => val.id === item.id);
            const countDiff = countPercentage(currAsset.transaction, item.current_price);

            const newItem = {
              ...item,
              current_price: parseFloat(countDiff.totalNow).toFixed(4),
              price_change_percentage_24h: parseFloat(countDiff.percentage),
            };

            return renderItem(newItem)
          }) :
          renderNoData
      }
    </ScrollView>
  ), [assetListData, assetList]);

  const renderListWatchlist = useCallback(() => (
    <ScrollView
      style={{ padding: 10 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {
        watchListData.length > 0 ?
          watchListData?.map(item => renderItem(item)) :
          renderNoData
      }
    </ScrollView>
  ), [watchListData]);

  const renderScene = SceneMap({
    assets: renderListAssets,
    watchlist: renderListWatchlist,
  });

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const currentIndex = props.navigationState.index;

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              style={{
                ...styles.tabItem,
                borderBottomWidth: currentIndex === i ? 2 : 0.5,
                borderBottomColor: currentIndex === i ? COLOR.yellow : COLOR.green
              }}
              onPress={() => setIndex(i)}>
              <Animated.Text style={{ fontSize: 18, fontWeight: 'bold', opacity }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderAssetsTab = useMemo(() => (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  ), [index, routes, cryptoList, assetList, assetListData]);

  return (
    <View
      style={styles.container}
    >
      {renderPortofolio}
      {renderAssetsTab}
    </View>
  )
};

export default Home;