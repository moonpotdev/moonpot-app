import { SHOW_MODAL, HIDE_MODAL } from '../constants';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  modalType: null,
};

const modalReducer = createReducer(initialState, builder => {
  builder
    .addCase(SHOW_MODAL, (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload;
    })
    .addCase(HIDE_MODAL, (state, action) => {
      state.isOpen = false;
    });
});

export default modalReducer;
