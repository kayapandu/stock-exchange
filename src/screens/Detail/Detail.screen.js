import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, View, Image, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Surface, Text, Button, PaperProvider, Portal, Modal, TextInput } from 'react-native-paper';
import { CandlestickChart } from 'react-native-wagmi-charts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { FILTER_DAYS } from '@constants/constants';
import FilterComponent from '@components/Filter/Filter.component';
import { getCoinChartOHLC } from '@redux/actions/crypto.action';
import { COLOR } from "@constants/constants";

export const {width: SIZE} = Dimensions.get('window');

import styles from "./Detail.screen.styles";


const Detail = function() {
  const cryptoData = useSelector(state => state.currentCrypto);

  const [selectedRange, setSelectedRange] = useState('1');
  const [coinMarketData, setCoinMarketData] = useState([]);
  const [coinValue, setCoinValue] = useState('1');
  const [usdValue, setUsdValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setUsdValue(cryptoData?.market_data?.current_price?.usd.toString());
    fetchCoinMarket(selectedRange);
  }, [cryptoData]);

  const fetchCoinMarket = async (range) => {
    setLoading(true);
    const coinId = cryptoData?.id;
    const fetchedCoinMarketData = await getCoinChartOHLC(
      coinId,
      range,
    );

    setCoinMarketData(fetchedCoinMarketData);
    setLoading(false);
  };

  console.log('xxx crypto', cryptoData);

  const onSelectedRangeChange = value => {
    setSelectedRange(value)
    fetchCoinMarket(value);
  };

  const changeCoinValue = value => {
    setCoinValue(value);
    const floatValue = parseFloat(value) || 0;
    setUsdValue((floatValue * current_price.usd).toFixed(6).toString());
  };

  const changeUsdValue = value => {
    setUsdValue(value);
    const floatValue = parseFloat(value.replace(',', '.')) || 0;
    setCoinValue((floatValue / current_price.usd).toFixed(6).toString());
  };

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
          <Text style={{ fontWeight: '400' }} variant="titleMedium">{cryptoData?.name}</Text>
          <Text style={{ fontWeight: 'bold' }} variant="titleLarge">$ {cryptoData?.market_data?.current_price?.usd.toFixed(2)}</Text>
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
          {`${cryptoData?.symbol?.toUpperCase()} 12`}
        </Text>
        <Text
          style={{ fontWeight: '400', alignSelf: 'flex-end' }}
          variant='titleSmall'
        >
          $ 120
        </Text>
      </View>
    </View>
  ), [cryptoData]);

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
  ), [cryptoData, renderCoinAbout, renderMarketStatistic]);

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
                Your Balance: $ {cryptoData?.market_data?.current_price?.usd}
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
                1 {cryptoData?.symbol?.toUpperCase()} = $ {cryptoData?.market_data?.current_price?.usd}
              </Text>
            </View>
          </View>
          <View style={{
            ...styles.infoWrapper,
            justifyContent: 'space-between',
            paddingVertical: 5,
            }}>
            <View style={{...styles.sectionContainer, borderBottomWidth: 1.5, width: '40%'}}>
              <Text variant='titleMedium' style={styles.infoText}>USD</Text>
            </View>
            <TextInput style={styles.inputContainer} value={usdValue} />
          </View>
          <View style={{...styles.infoWrapper, justifyContent: 'space-between' }}>
            <View style={{...styles.sectionContainer, borderBottomWidth: 1.5, width: '40%'}}>
              <Text variant='titleMedium' style={styles.infoText}>
                {`${cryptoData?.symbol?.toUpperCase()}`}
              </Text>
            </View>
            <TextInput style={styles.inputContainer} value={coinValue}/>
          </View>
          <View style={styles.modalButtonContainer}>
            <Button 
              mode="elevated"
              buttonColor={COLOR.green}
              textColor={COLOR.white}
              labelStyle={styles.buttonText}
              onPress={() => setVisible(false)}
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
        </View>
      </Modal>
    </Portal>
  ), [visible, setVisible, cryptoData]);

  return (
    <PaperProvider>
    <View style={styles.container}>
      <ScrollView>
        <Surface style={styles.surfaceContainer} elevation={2}>
          {renderCoinInfo}
          {renderCandleChart}
          {renderFilter}
        </Surface>
        {renderCoinDescription}
      </ScrollView>
      {renderFooter}
      {renderTradeModal}
    </View>
    </PaperProvider>
  )
};

export default Detail;