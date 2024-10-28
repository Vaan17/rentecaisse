import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../reducers/counter'; 

const store = configureStore({
  reducer: counterReducer, 
});

export default store;