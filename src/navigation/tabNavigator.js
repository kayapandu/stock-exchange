import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '@screens/Home/Home.screen';
import MarketScreen from '@screens/Market/Market.screen';
import HistoryScreen from '@screens/History/History.screen';

import { COLOR } from '@constants/constants';

const Tab = createMaterialBottomTabNavigator();

function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      activeColor={COLOR.black}
      barStyle={{ backgroundColor: COLOR.brightCyan }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarLabel: 'Market',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation