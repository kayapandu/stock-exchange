import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { Appbar } from 'react-native-paper';

import StackNavigation from './stack';
import TabNavigation from './tabNavigator';

const AppStack = function() {
  return (
    <NavigationContainer>
      <Appbar />
      <StackNavigation />
    </NavigationContainer>
  );
};

export default AppStack;