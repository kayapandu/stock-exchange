import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import cryptoReducer from './reducers/crypto.reducer';

const store = createStore(
  cryptoReducer,
  applyMiddleware(thunk),
);

export default store;