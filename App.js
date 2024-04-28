import React from 'react';
import { Provider } from 'react-redux'

import store from '@redux/store';
import AppStack from '@navigation/navigation';


export default function App() {
  return (
    <Provider store={store}>
      <AppStack />
    </Provider>
  );
}
