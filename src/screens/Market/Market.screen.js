import React from 'react';
import { View, Text, Image } from 'react-native';

import beachImage from '../../../assets/beach.png';

const Market = function() {

  return (
    <View>
      <Text>This is Market</Text>
      <Image source={beachImage} style={{ width: 20, height: 30 }} />
    </View>
  )
};

export default Market;