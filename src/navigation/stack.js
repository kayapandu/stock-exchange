import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TabNavigation from './tabNavigator';

import HomeScreen from '@screens/Home/Home.screen';

const Stack = createNativeStackNavigator();

const StackNavigation = function(){
  return (
    <Stack.Navigator
      initialRouteName="TabNavigatorScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  )
};

export default StackNavigation;