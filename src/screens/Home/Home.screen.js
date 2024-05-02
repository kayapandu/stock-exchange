import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Animated, View, useWindowDimensions, TouchableOpacity, Image, ScrollView , ImageBackground} from 'react-native';
import { Card, Text, List, Surface } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import beachImage from 'assets/beach.png';

import { getAssetListData, getWatchListData } from 'src/utils/storage';


import { getCoinMarketList, getCoinById, getCoinMarketById } from '@redux/actions/crypto.action';

import styles from './Home.screen.styles';
import { COLOR } from '@constants/constants';

const Home = function() {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const cryptoList = useSelector(state => state.cryptoList);
  const watchListData = useSelector(state => state.watchList);
  const assetListData = useSelector(state => state.assetsList);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'assets', title: 'Assets' },
    { key: 'watchlist', title: 'Watchlist' },
  ]);
  const [watchList, setWatchList] = useState([]);
  const [assetList, setAssetList] = useState([]);

  const handleOnDetail = useCallback(item => {
    getCoinById(item.id, dispatch);
    navigate('Detail');
  }, []);

  const getWatchList = useCallback(async () => {
    const currentWatchlist = await getWatchListData();
    const seedWatchlist = ['bitcoin', 'tether', 'ethereum', 'dogecoin'];

    const listWatch = currentWatchlist.length > 0 ? currentWatchlist : seedWatchlist;
    const list = listWatch.toString();
    console.log('xxx list', list);
    
    await getCoinMarketById(list, true, dispatch);
  }, []);

  const getAssetList = useCallback(async () => {
    const currentAssetlist = await getAssetListData();
    const seedAssetlist = ['bitcoin', 'tether'];

    const listAsset = currentAssetlist.length > 0 ? currentAssetlist : seedAssetlist;
    const list = listAsset.toString();
    console.log('xxx list', list);
    
    await getCoinMarketById(list, false, dispatch);
  }, []);

  useEffect(() => {
    getCoinMarketList(dispatch);
    getWatchList();
    getAssetList();
  }, []);

  console.log('xxx crypto list', cryptoList);
  console.log('xxx watchList', watchListData);

  const renderValuePercentage = useCallback((percentage, isSmall = false) => {
    const isUp = percentage > 0;
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

  const renderBalanceProfit = useMemo(() =>
    <View style={{ flex: 1, flexDirection: 'column'}}>
      <Text style={{ fontWeight: '600'}} variant='titleMedium'>Your Assets</Text>
      <View style={{ ...styles.balanceContainer,  ...styles.balanceTextContainer}}>
        <Text style={{ fontWeight: 'bold'}} variant='displaySmall'>
          100.00
        </Text>
        <Text style={{ marginLeft: 4 }} variant='titleMedium'>USD</Text>
      </View>
    </View>
  ,[]);

  const renderPortofolio = useMemo(() => (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <Text variant='titleSmall'>Hello, Pandu</Text>
        <View style={{ ...styles.balanceContainer, justifyContent: 'space-between', alignItems: 'center' }}>
          {renderBalanceProfit}
          <Image source={beachImage} style={{ width: 130, height: 130}} />
        </View>
        <View style={{ width: '30%' }}>
          {renderValuePercentage(20)}
        </View>
      </Card.Content>
    </Card>
  ),[]);

  const renderLeftIcon = useCallback(icon => <Image source={{ uri: icon}} style={{ alignSelf: 'center' }} width={30} height={30} />,[])

  const renderRightIcon = useCallback((currentPrice, percentage) => (
    <View style={{ display: 'flex', alignItems: 'flex-end' }}>
      <Text variant='titleSmall' style={{ fontWeight: '800' }}>$ {currentPrice}</Text>
      {renderValuePercentage(percentage.toFixed(2), true)}
    </View>
  ), []);

  const renderItem = useCallback(item => 
    <List.Item
      id={`item_${item?.symbol}`}
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
  ))

  const renderListAssets = useCallback(() => (
    <ScrollView style={{ padding: 10 }}>
      {
        assetListData.length > 0 ?
          assetListData?.map(item => renderItem(item)) :
          renderNoData
      }
    </ScrollView>
  ), [cryptoList]);

  const renderListWatchlist = useCallback(() => (
    <ScrollView style={{ padding: 10 }}>
      {
        watchListData.length > 0 ?
          watchListData?.map(item => renderItem(item)) :
          renderNoData
      }
    </ScrollView>
  ), []);

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
  ), [index, routes, cryptoList]);

  return (
    <View style={styles.container}>
      {renderPortofolio}
      {renderAssetsTab}
    </View>
  )
};

export default Home;