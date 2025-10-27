import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const fetchCurrentDayStock = createAsyncThunk(
  "currentDayStock/fetchCurrentDayStock",
  async (project_id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.post(
        `${API_BASE}/profile/current_day_stock`,
        { project_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch current day stock"
      );
    }
  }
);

const currentDayStockSlice = createSlice({
  name: "currentDayStock",
  initialState: {
    currentDayStock: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentDayStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentDayStock.fulfilled, (state, action) => {
        state.currentDayStock = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentDayStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default currentDayStockSlice.reducer;
