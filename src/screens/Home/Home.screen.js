import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Animated, View, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { Card, Text, List } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useSelector } from 'react-redux';

import { getCoinList, getCoinMarketList, pingMarketData } from '@redux/actions/crypto.action';

import styles from './Home.screen.styles';

const Home = function() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'assets', title: 'Assets' },
    { key: 'watchlist', title: 'Watchlist' },
  ]);

  const cryptoList = useSelector(state => state.cryptoList);

  console.log(cryptoList)
  
  useEffect(() => {
    getCoinMarketList();
  }, []);

  const renderPortofolio = useMemo(() => (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <Text variant='titleMedium'>Total Balance</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'baseline' }}>
          <Text style={{ fontWeight: 'bold'}} variant='displaySmall'>100.00</Text>
          <Text style={{ marginLeft: 4 }} variant='titleMedium'>USD</Text>
        </View>
      </Card.Content>
    </Card>
  ), []);

  const renderItem = useCallback(item => 
    <List.Item
      title={item.symbol}
      description={item.ath_change_percentage}
      titleStyle={styles.listCardTitle}
      descriptionStyle={styles.listCardDesc}
      right={() => <Text>{item.current_price}</Text>}
      left={() => renderLeftIcon(item.image)}
      onPress={() => {}}
      style={styles.listCard}
    />
  , [])

  const renderLeftIcon = useCallback(icon => <Image source={{ uri: icon}} width={30} height={30} />,[])

  const renderListAssets = useCallback(() => (
    <View style={{ padding: 10 }}>
      {renderItem(mockItem)}
      {renderItem(mockItem)}
      {renderItem(mockItem)}
    </View>
  ), []);

  const mockItem = {
    id: "bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    symbol: "btc",
    ath_change_percentage: -13.9324,
    current_price: 6.3334,
  };

  const renderListWatchlist = useCallback(() => (
    <View style={{ padding: 10 }}>
      <List.Item
        title="Coin B"
        description="Gain"
        titleStyle={styles.listCardTitle}
        descriptionStyle={styles.listCardDesc}
        right={() => <Text>10</Text>}
        left={() => <Text>Icon</Text>}
        onPress={() => {}}
        style={styles.listCard}
      />
    </View>
  ), []);

  const renderScene = SceneMap({
    assets: renderListAssets,
    watchlist: renderListWatchlist,
  });

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

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
              style={styles.tabItem}
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
  ), [index, routes]);

  return (
    <View style={styles.container}>
      {renderPortofolio}
      {renderAssetsTab}
    </View>
  )
};

export default Home;