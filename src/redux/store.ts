import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './slice/authSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  authSlice: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Optional types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;