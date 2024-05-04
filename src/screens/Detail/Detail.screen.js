import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, View, Image, ScrollView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Surface, Text, Button, PaperProvider, Portal, Modal, TextInput } from 'react-native-paper';
import { CandlestickChart } from 'react-native-wagmi-charts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { FILTER_DAYS } from '@constants/constants';
import FilterComponent from '@components/Filter/Filter.component';
import { getCoinChartOHLC } from '@redux/actions/crypto.action';
import { COLOR } from "@constants/constants";
import { getAssetListData, setAssetListData } from "src/utils/storage";
import { countCoinBalance } from "src/utils/assets";

export const {width: SIZE} = Dimensions.get('window');

import styles from "./Detail.screen.styles";


const Detail = function() {
  const { goBack } = useNavigation();

  const cryptoData = useSelector(state => state.currentCrypto);

  const [selectedRange, setSelectedRange] = useState('1');
  const [coinMarketData, setCoinMarketData] = useState([]);
  const [coinValue, setCoinValue] = useState('0');
  const [usdValue, setUsdValue] = useState('1');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [assetList, setAssetList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { market_data } = cryptoData;

  useEffect(() => {
    setCoinValue(market_data?.current_price?.usd.toString());
    setUsdValue('1');
    fetchCoinMarket(selectedRange);
  }, [cryptoData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCoinMarket(selectedRange);
    setRefreshing(false);
  }, []);


  const fetchCoinMarket = async (range) => {
    setLoading(true);
    if (cryptoData) {
      const coinId = cryptoData?.id;
      const fetchedCoinMarketData = await getCoinChartOHLC(
        coinId,
        range,
      );
  
      const assetListData = await getAssetListData();
  
      setAssetList(assetListData);
      setCoinMarketData(fetchedCoinMarketData);
    }

    setLoading(false);
  };

  const onSelectedRangeChange = value => {
    setSelectedRange(value)
    fetchCoinMarket(value);
  };

  const changeCoinValue = value => {
    setCoinValue(value);
    const floatValue = parseFloat(value) || 0;
    setUsdValue((floatValue * market_data?.current_price?.usd).toFixed(6).toString());
  };

  const changeUsdValue = value => {
    setUsdValue(value);
    const floatValue = parseFloat(value) || 0;
    setCoinValue((floatValue / market_data?.current_price?.usd).toFixed(6).toString());
  };

  const onBuyCoin = useCallback(async () => {
    const coinAssetsIdx = assetList?.findIndex(item => item.id === cryptoData?.id );

    let coinTrade = [...assetList];
    if (coinAssetsIdx >= 0) {
      let newTransaction = [...coinTrade[coinAssetsIdx].transaction];

      newTransaction.push({
        usd: usdValue,
        coin: coinValue,
        price: market_data?.current_price?.usd,
        type: 'buy',
      });

      coinTrade[coinAssetsIdx].transaction = newTransaction;
    } else {
      coinTrade = [
        ...assetList,
      {
        id: cryptoData?.id,
        transaction: [
          {
            usd: usdValue,
            coin: coinValue,
            price: market_data?.current_price?.usd,
            type: 'buy',
          }
        ]
      }];
    };

    try {
      await setAssetListData(coinTrade);
    } catch (error) {
      console.log(error)
    } finally {
      fetchCoinMarket();
      setVisible(false);
      goBack();
    };
  })

  const COIN_PRICES = useMemo(() => {
    const data = coinMarketData?.map(price => ({ 
      timestamp: price[0],
      open: price[1],
      high: price[2],
      low: price[3],
      close: price[4],
    }));

    return data;
  }, [coinMarketData, fetchCoinMarket, setCoinMarketData]);

  const COIN_ASSETS = useMemo(() => {
    if (cryptoData) {
      const coinAssets = assetList?.find(item => item.id === cryptoData?.id );
      if (coinAssets !== undefined && coinAssets !== null) {
        const coinConvert = countCoinBalance(coinAssets.transaction, market_data?.current_price?.usd);

        return {
          coin: coinConvert.totalCoin,
          balance: coinConvert.totalBalance.toFixed(2),
        };
      } else {
        return {
          coin: 0,
          balance: 0,
        }
      }
    };

    return {
      coin: 0,
      balance: 0,
    }    
  }, [assetList, cryptoData]);

  const COIN_DESC = useMemo(() => {
    const description = cryptoData?.description?.en?.split("\n");

    return description?.length > 0 ? description[0] : 'No Coin Description Yet';
  }, [cryptoData])

  const renderValuePercentage = useMemo(() =>  {
    const percentage = cryptoData?.market_data?.price_change_percentage_1h_in_currency?.usd;
    const isUp = percentage > 0;
    return (
      <Surface 
        style={isUp ? styles.profitContainer : styles.lossContainer}
        elevation={2}
      >
        <MaterialCommunityIcons name={isUp ? 'chevron-up' : 'chevron-down'} color='black' size={30} />
        <Text variant='titleMedium'>{percentage?.toFixed(2)} %</Text>
      </Surface>
    )
  }       
  ,[cryptoData]);
  
  const renderLoading = useMemo(() => (
    <Portal>
      <ActivityIndicator style={{ top: 160}} animating={true} size='large' color={COLOR.black } />
    </Portal>
  ), [loading])

  const renderCoinInfo = useMemo(() => (
    <View style={styles.coinInfoContainer}>
      <View
        style={{
          ...styles.coinInfoContainer,
          justifyContent: 'flex-start',
          padding: 5,
        }}
      >
        <Image source={{ uri: cryptoData?.image?.thumb}} style={{ width: 30, height: 30, marginRight: 10 }} />
        <View style={styles.coinPriceContainer}>
          <Text style={{ fontWeight: '400', color: COLOR.black }} variant='titleMedium'>{cryptoData?.name}</Text>
          <Text style={{ fontWeight: 'bold' }} variant='titleLarge'>$ {cryptoData?.market_data?.current_price?.usd.toFixed(2)}</Text>
        </View>
      </View>

      {renderValuePercentage}
    </View>
  ), [cryptoData]);

  const renderCandleChart = useMemo(() => (
    <CandlestickChart.Provider data={COIN_PRICES}>
      <CandlestickChart>
        <CandlestickChart.Candles />
      </CandlestickChart>
    </CandlestickChart.Provider>
  ), [COIN_PRICES]);

  const renderFilter = useMemo(() => (
    <View style={styles.filterContainer}>
      {FILTER_DAYS.map(day => (
        <FilterComponent
          filterDay={day.filterDay}
          filterText={day.filterText}
          selectedRange={selectedRange}
          setSelectedRange={onSelectedRangeChange}
          key={day.filterText}
        />
      ))}
    </View>
  ), [selectedRange]);

  const renderCoinBalance = useMemo(() => (
    <View style={styles.balanceContainer}>
      <Text
        style={{ fontWeight: '600' }}
        variant='titleMedium'
      >
        {cryptoData?.name || 'Coin' } Balance
      </Text>
      <View>
        <Text
          style={{ fontWeight: '800', alignSelf: 'flex-end' }}
          variant='titleLarge'
        >
          {`${cryptoData?.symbol?.toUpperCase()} ${COIN_ASSETS?.coin}`}
        </Text>
        <Text
          style={{ fontWeight: '400', alignSelf: 'flex-end' }}
          variant='titleSmall'
        >
          {`$ ${COIN_ASSETS?.balance}`}
        </Text>
      </View>
    </View>
  ), [cryptoData, COIN_ASSETS]);

  const renderCoinAbout = useMemo(() => (
    <View style={styles.sectionContainer}>
      <Text style={styles.infoText} variant='titleMedium'>
        About
      </Text>
      <Text variant='labelLarge'>{COIN_DESC}</Text>
    </View>
  ), [cryptoData]);

  const renderMarketStatistic = useMemo(() => (
    <View style={styles.sectionContainer}>
        <Text variant='titleMedium' style={styles.infoText}>
          Market Statistic
        </Text>
        <View style={styles.infoWrapper}>
          <Text variant='titleSmall'>Total Supply</Text>
          <Text style={{ fontWeight: 'bold' }} variant='titleMedium'>{cryptoData?.market_data?.total_supply}</Text>
        </View>
    </View>
  ), [cryptoData]);

  const renderCoinDescription = React.useMemo(() => (
    <View style={styles.descContainer}>
      {renderCoinBalance}
      {renderCoinAbout}
      {renderMarketStatistic}
    </View>
  ), [cryptoData, renderCoinAbout, renderMarketStatistic,]);

  const renderFooter = useMemo(() => (
    <View style={styles.footerContainer}>
      <Button 
        mode="elevated"
        buttonColor={COLOR.green}
        textColor={COLOR.white}
        labelStyle={styles.buttonText}
        onPress={() => setVisible(true)}
      >
        Buy
      </Button>
      <Button 
        mode="elevated"
        buttonColor={COLOR.brightRed}
        textColor={COLOR.white}
        labelStyle={styles.buttonText}
        disabled
      >
        Sell
      </Button>
    </View>
  ), []);

  const renderModalTradeSection = useMemo(() => (
    <>
      <View style={{
        ...styles.infoWrapper,
        justifyContent: 'space-between',
        paddingVertical: 5,
        }}>
        <View style={{...styles.sectionContainer, borderBottomWidth: 1.5, width: '40%'}}>
          <Text variant='titleMedium' style={styles.infoText}>USD</Text>
        </View>
        <TextInput
          value={usdValue}
          style={styles.inputContainer}
          onChangeText={changeUsdValue}
        />
      </View>
      <View style={{...styles.infoWrapper, justifyContent: 'space-between' }}>
        <View style={{...styles.sectionContainer, borderBottomWidth: 1.5, width: '40%'}}>
          <Text variant='titleMedium' style={styles.infoText}>
            {`${cryptoData?.symbol?.toUpperCase()}`}
          </Text>
        </View>
        <TextInput
          value={coinValue}
          style={styles.inputContainer}
          onChangeText={changeCoinValue}
        />
      </View>
    </>
  ), [usdValue, coinValue, changeCoinValue, changeUsdValue])

  const renderModalButton = useMemo(() => (
    <View style={styles.modalButtonContainer}>
      <Button 
        mode="elevated"
        buttonColor={COLOR.green}
        textColor={COLOR.white}
        labelStyle={styles.buttonText}
        onPress={onBuyCoin}
      >
        Buy
      </Button>
      <Button 
        mode="elevated"
        buttonColor={COLOR.gray}
        textColor={COLOR.white}
        labelStyle={styles.buttonText}
        onPress={() => setVisible(false)}
      >
        Cancel
      </Button>
    </View>
  ), [setVisible, onBuyCoin]);

  const renderTradeModal = useMemo(() => (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={styles.modalContainerStyle}
      >
        <View>
          <Text style={{...styles.infoText, fontWeight: 'bold', alignSelf: 'center'}} variant='titleLarge'>
            {`${cryptoData?.symbol?.toUpperCase()} / USD `}
          </Text>
          <View style={{
            ...styles.infoWrapper,
            justifyContent: 'space-between',
            paddingVertical: 5,
            }}>
            <View style={{...styles.sectionContainer, borderBottomWidth: 1.5, width: '100%'}}>
              <Text variant='titleMedium' style={styles.infoText}>
                Your Balance: $ {market_data?.current_price?.usd}
              </Text>
            </View>
          </View>
          <View style={{
            ...styles.infoWrapper,
            justifyContent: 'space-between',
            paddingVertical: 5,
            }}>
            <View style={{...styles.sectionContainer, borderBottomWidth: 1.5, width: '100%'}}>
              <Text variant='titleMedium' style={styles.infoText}>
                1 {cryptoData?.symbol?.toUpperCase()} = $ {market_data?.current_price?.usd}
              </Text>
            </View>
          </View>
          {renderModalTradeSection}
          {renderModalButton}
        </View>
      </Modal>
    </Portal>
  ), [visible, setVisible, cryptoData, renderModalTradeSection]);

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
  ), []);

  if (!cryptoData) { return renderNoData}

  return (
    <PaperProvider theme={{ colors: { primary: COLOR.black }}}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={styles.container}/>}>
        <Surface style={styles.surfaceContainer} elevation={2}>
          {renderCoinInfo}
          {renderCandleChart}
          {renderFilter}
        </Surface>
        {renderCoinDescription}
      </ScrollView>
      {renderFooter}
      {renderTradeModal}
      {loading && renderLoading}
    </PaperProvider>
  )
};

export default Detail;