import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import {
  combineReducers,
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/setting/ThemeSlice";
import userReducer from "../features/users/userSlice";
import profileReducer from "../features/profile/profileSlice";
import auditReducer from "../features/audit_log/auditLogSlice";
import incidentReducer from "../features/secutiry/securitySlice";
import statictifyReducer from "../features/static/statictifySlice";
import workspaceMNGReducer from "../features/workspace_management/workspaceSlice";
import workspaceReducer from "../features/workspace/workspaceSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // chỉ lưu auth
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  user: userReducer,
  profile: profileReducer,
  auditLog: auditReducer,
  incident: incidentReducer,
  statictify: statictifyReducer,
  workspaceMng: workspaceMNGReducer,
  workspace: workspaceReducer,
});
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
