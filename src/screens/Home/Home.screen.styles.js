import { StyleSheet } from 'react-native';

import { COLOR } from '@constants/constants';

const percentageBox = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: 5,
  marginVertical: 4,
  borderRadius: 4,
  borderWidth: 0.5,
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLOR.softCyan,
    padding: 10,
  },
  cardContainer: {
    backgroundColor: COLOR.yellow,
    marginVertical: 10,
  },
  cardText: {
    color: COLOR.gray,
  },
  profitContainer: {
    ...percentageBox,
    backgroundColor: COLOR.lightGreen,
    borderColor: COLOR.brightCyan,
  },
  lossContainer: {
    ...percentageBox,
    backgroundColor: COLOR.lightRed,
    borderColor: COLOR.red,
  },
  balanceContainer: {
    display: 'flex', 
    flexDirection: 'row',
  },
  balanceTextContainer: {
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  profitDesc: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    padding: 5,
    marginVertical: 4,
    borderRadius: 4,
    backgroundColor: COLOR.lightGreen,
    borderWidth: 0.5,
    borderColor: COLOR.brightCyan,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  listCard: {
    padding: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.brightCyan,
  },
  listCardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  listCardDesc: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '400',
  }
});

export default styles;
