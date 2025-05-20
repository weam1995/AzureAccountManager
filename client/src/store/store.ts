import { configureStore } from '@reduxjs/toolkit';
import accountsReducer from './accountsSlice';

export const store = configureStore({
  reducer: {
    accounts: accountsReducer
  }
});

// Export types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;