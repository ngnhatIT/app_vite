import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers, configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import themeReducer from "../features/setting/ThemeSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // chỉ lưu auth
};

const rootReducer = combineReducers({ auth: authReducer, theme: themeReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
