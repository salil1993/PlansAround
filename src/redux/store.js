import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import UserSlice from "./Slices/UserSlice";
import authSlice from "./Slices/UserSlice";
import {
  persistStore, persistReducer, FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from "redux-persist/lib/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

let persistConfig = {
  key: 'root',
  storage: AsyncStorage,

}
let rootReducer = combineReducers({
  authSlice
})


let persistedReducer = persistReducer(persistConfig, rootReducer);



export const myStore = configureStore({

  reducer: { persistedReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),


})