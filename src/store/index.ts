// Redux store configuration for Crisp AI Interview Assistant
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import interviewSlice from './slices/interviewSlice';
import candidateSlice from './slices/candidateSlice';

const persistConfig = {
  key: 'crisp-ai-interview',
  storage,
  whitelist: ['auth', 'interview', 'candidates'], // persist these reducers
};

const rootReducer = combineReducers({
  auth: authSlice,
  interview: interviewSlice,
  candidates: candidateSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;