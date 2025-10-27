import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Async thunk to send location data (lat, long) and userId
export const sendLocationData = createAsyncThunk(
  "location/sendData",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE}/profile/location_insert`,
        {
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send location data"
      );
    }
  }
);

// Slice example (optional)
const locationSlice = createSlice({
  name: "location",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendLocationData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLocationData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(sendLocationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default locationSlice.reducer;
