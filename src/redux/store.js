// src/pages/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import profileReducer from "./slices/profileSlice";
import changePasswordReducer from "./slices/changePasswordSlice";
import stockEntryReducer from "./slices/stockEntrySlice";
import materialReducer from "./slices/materialSlice";
import stockEntryReportReducer from "./slices/stockEntryReportSlice";
import dayCloseReducer from "./slices/dayCloseSlice";
import currentDayStockReducer from "./slices/currentDayStockSlice";
import locationReducer from "./slices/locationSlice";
import plotProjectsReducer from "./slices/plotProjectListSlice";
import plotByIdReducer from "./slices/plotByIdSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    profile: profileReducer,
    changePassword: changePasswordReducer,
    stock: stockEntryReducer,
    materials: materialReducer,
    stockEntryReport: stockEntryReportReducer,
    dayClose: dayCloseReducer,
    currentDayStock: currentDayStockReducer,
    location: locationReducer,
    plotProjects: plotProjectsReducer,
    plotById: plotByIdReducer,
  },
});
