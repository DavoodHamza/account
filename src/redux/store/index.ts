import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import Slices from "../slices";
 
const persistConfig = {
  key: "taxgo",
  storage: storage,
  whitelist: [
    "User",
    "BusinessCategory",
    "Country",
    "language",
    "retailExpress",
    "endofyear",
    "temp",
    "paystack"
  ],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, Slices);

const middleWareConfigs = {
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
};

const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(middleWareConfigs),
  ],
});
const PersistedStore = persistStore(Store);
export { Store, PersistedStore };
