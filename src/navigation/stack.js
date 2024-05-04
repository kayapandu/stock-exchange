import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TabNavigation from './tabNavigator';

import DetailScreen from '@screens/Detail/Detail.screen';

const Stack = createNativeStackNavigator();

const StackNavigation = function(){
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name="Home"
        component={TabNavigation}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          title: 'Coin Detail'
        }}
      />
      
    </Stack.Navigator>
  )
};

export default StackNavigation;