import { StyleSheet } from 'react-native';

import { COLOR } from '@constants/constants';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLOR.softCyan,
  },
  surfaceContainer: {
    backgroundColor: COLOR.white,
  },
  coinInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: COLOR.softYellow,
  },
  coinPriceContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  profitContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '30%',
    padding: 5,
    marginVertical: 4,
    borderRadius: 4,
    backgroundColor: COLOR.lightGreen,
    borderWidth: 0.5,
    borderColor: COLOR.brightCyan,
  },
  lossContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '30%',
    padding: 5,
    marginVertical: 4,
    borderRadius: 4,
    backgroundColor: COLOR.lightRed,
    borderWidth: 0.5,
    borderColor: COLOR.red,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  descContainer: {
    display: 'flex',
    padding: 15,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomColor: COLOR.brightCyan,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
  },
  sectionContainer: {
    display: 'flex',
    paddingVertical: 5,
    borderBottomColor: COLOR.brightCyan,
    borderBottomWidth: 0.5,
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoText: {
    fontWeight: '600',
    paddingVertical: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: COLOR.yellow,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default styles;