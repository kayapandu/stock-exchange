import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import StackNavigation from './stack';

const AppStack = function() {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default AppStack;