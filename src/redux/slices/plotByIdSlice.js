import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Async thunk to fetch plot list by ID
export const fetchPlotById = createAsyncThunk(
  "plotById/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/profile/plot_list/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch plot list"
      );
    }
  }
);

// Slice example
const plotByIdSlice = createSlice({
  name: "plotById",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlotById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlotById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPlotById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default plotByIdSlice.reducer;
