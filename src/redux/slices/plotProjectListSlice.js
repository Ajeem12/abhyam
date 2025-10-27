import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Async thunk to fetch plot project list
export const fetchPlotProjectList = createAsyncThunk(
  "plotProjects/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/profile/plot_project_list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch plot project list"
      );
    }
  }
);

// Slice example
const plotProjectSlice = createSlice({
  name: "plotProjects",
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlotProjectList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlotProjectList.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchPlotProjectList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default plotProjectSlice.reducer;
