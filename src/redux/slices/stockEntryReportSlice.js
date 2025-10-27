import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Async thunk to fetch stock entry report
export const fetchStockEntryReport = createAsyncThunk(
  "stockEntryReport/fetch",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // Check if token exists
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      // Create FormData object with correct parameter names
      const data = new FormData();
      data.append("project_id", formData.project_id);
      data.append("from_date", formData.from_date); // Fixed parameter name
      data.append("to_date", formData.to_date); // Fixed parameter name
      data.append("search", formData.search);

      const response = await axios.post(
        `${API_BASE}/profile/stock_entry_report`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.status) {
        return rejectWithValue(
          response.data.message || "Failed to fetch stock entry report"
        );
      }

      return response.data.data;
    } catch (err) {
      // Handle token expiration or invalid token
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        return rejectWithValue("Session expired. Please login again.");
      }

      return rejectWithValue(
        err.response?.data?.message || "Error fetching report"
      );
    }
  }
);

const stockEntryReportSlice = createSlice({
  name: "stockEntryReport",
  initialState: {
    reportData: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearStockEntryReport(state) {
      state.reportData = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockEntryReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockEntryReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(fetchStockEntryReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStockEntryReport } = stockEntryReportSlice.actions;
export default stockEntryReportSlice.reducer;
