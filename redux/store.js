'use client';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import cartSlice from './slices/cart-slice';
import ordersSlice from './slices/orders-slice';

const store = configureStore({
  reducer: combineReducers({
    cartSlice,
    ordersSlice,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const { dispatch, getState } = store;

export default store;
