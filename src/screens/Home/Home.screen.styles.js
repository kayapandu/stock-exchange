import { StyleSheet } from 'react-native';

import { COLOR } from '@constants/constants';

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
    backgroundColor: COLOR.white,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
  },
  listCardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  listCardDesc: {
    fontSize: 14,
    fontWeight: '400',
  }
});

export default styles;
