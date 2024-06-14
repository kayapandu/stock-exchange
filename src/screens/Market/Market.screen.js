import React , { useEffect, useMemo, useCallback, useState } from 'react';
import { View, Image, SafeAreaView, RefreshControl, FlatList } from 'react-native';
import { Text, List, Surface } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getCoinMarketList, getCoinById } from '@redux/actions/crypto.action';

import styles from './Market.screen.styles';

const Market = function() {
  const dispatch = useDispatch();
  const cryptoList = useSelector(state => state.cryptoList);
  const { navigate, isFocused } = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getCoinMarketList(dispatch);
  }, [isFocused]);

  const handleOnDetail = useCallback(item => {
    getCoinById(item.id, dispatch);
    navigate('Detail');
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getCoinMarketList({page}, dispatch);
    setRefreshing(false);
  }, [page]);

  const getCryptoList = useCallback(async () => {
    setPage(page + 1);
    onRefresh();
  }, [page]);

  const renderValuePercentage = useCallback((percentage) => {
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
          size={14}
        />
        <Text variant={'titleSmall'}>
          {percentage} %
        </Text>
      </Surface>
    )
  }
  ,[]);

  const renderLeftIcon = useCallback(icon => <Image source={{ uri: icon}} style={{ alignSelf: 'center', width: 30, height: 30 }} />,[])

  const renderRightIcon = useCallback((currentPrice, percentage) => (
    <View style={{ display: 'flex', alignItems: 'flex-end' }}>
      <Text variant='titleSmall' style={{ fontWeight: '800' }}>$ {currentPrice}</Text>
      {renderValuePercentage(percentage?.toFixed(2), true)}
    </View>
  ), []);

  const renderItem = useCallback(({item}) => {
    console.log(item);
  return (
    <List.Item
      id={`item_${item?.symbol}`}
      key={`key_${item?.symbol}`}
      title={item?.symbol?.toUpperCase()}
      description={item?.name?.toUpperCase()}
      titleStyle={styles.listCardTitle}
      descriptionStyle={styles.listCardDesc}
      right={() => renderRightIcon(item?.current_price, item?.price_change_percentage_24h)}
      left={() => renderLeftIcon(item?.image)}
      onPress={() => handleOnDetail(item)}
      style={styles.listCard}
    />
  )}, []);

  const renderNoData = useMemo(() => (
    <View 
      style={{ 
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      top: 150,
      }}>
      <MaterialCommunityIcons 
        name='book-cancel'
        color='black'
        size={20}
      />
      <Text style={{ marginLeft: 5, fontWeight: '800' }} variant='labelMedium'>Oops, there's no lists yet</Text>
    </View>
  ), []);

  const renderListMarket = useMemo(() => (
    <FlatList
      data={cryptoList}
      renderItem={renderItem}
      key={item => item.id}
      keyExtractor={item => item.id}
      onEndReached={getCryptoList}
      refreshing={refreshing}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={renderNoData}
    />
  ), [cryptoList])

  console.log(cryptoList)

  return (
    <SafeAreaView
      style={styles.container}
    >
      {renderListMarket}
    </SafeAreaView>
  )
};

export default Market;