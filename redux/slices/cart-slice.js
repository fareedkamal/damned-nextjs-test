'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openCart: false,
  cartLoading: false,
};

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    setCartOpen: (state) => {
      state.openCart = true;
    },
    setCartClose: (state) => {
      state.openCart = false;
    },
    setCartLoading: (state, action) => {
      state.cartLoading = action.payload;
    },
  },
});

export const { setCartOpen, setCartClose, setCartLoading } = cartSlice.actions;

export default cartSlice.reducer;
