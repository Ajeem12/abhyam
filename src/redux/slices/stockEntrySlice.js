import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/apiClient";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const token = localStorage.getItem("token");

export const fetchStockEntries = createAsyncThunk(
  "stock/fetchStockEntries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/profile/stock_entry`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stock entries"
      );
    }
  }
);

export const addStockEntry = createAsyncThunk(
  "stock/addStockEntry",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/profile/stock_entry`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data.status) {
        return rejectWithValue(res.data.message || "Error while adding entry");
      }

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add stock entry"
      );
    }
  }
);

export const fetchStockList = createAsyncThunk(
  "stock/fetchStockList",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      const res = await axiosInstance.post(
        `/profile/stock_entry_project_list`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.data.status) {
        return rejectWithValue(
          res.data.message || "Failed to fetch stock list"
        );
      }

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error while fetching stock list"
      );
    }
  }
);

export const fetchVendorList = createAsyncThunk(
  "stock/fetchVendorList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/profile/fetch_vendor_list`);

      if (!res.data.status) {
        return rejectWithValue(
          res.data.message || "Failed to fetch vendor list"
        );
      }

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error while fetching vendor list"
      );
    }
  }
);

const stockEntrySlice = createSlice({
  name: "stock",
  initialState: {
    entries: [],
    stockList: [],
    vendors: [],
    loading: false,
    error: null,
    success: false,
    stockListLoading: false,
    stockListError: null,
    vendorLoading: false,
    vendorError: null,
  },

  reducers: {
    clearStockSuccess(state) {
      state.success = false;
    },
    clearStockError(state) {
      state.error = null;
    },
    clearVendorError(state) {
      state.vendorError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchStockEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addStockEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addStockEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.push(action.payload);
        state.success = true;
      })
      .addCase(addStockEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(fetchStockList.pending, (state) => {
        state.stockListLoading = true;
        state.stockListError = null;
      })
      .addCase(fetchStockList.fulfilled, (state, action) => {
        state.stockListLoading = false;
        state.stockList = action.payload;
      })
      .addCase(fetchStockList.rejected, (state, action) => {
        state.stockListLoading = false;
        state.stockListError = action.payload;
      })

      .addCase(fetchVendorList.pending, (state) => {
        state.vendorLoading = true;
        state.vendorError = null;
      })
      .addCase(fetchVendorList.fulfilled, (state, action) => {
        state.vendorLoading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendorList.rejected, (state, action) => {
        state.vendorLoading = false;
        state.vendorError = action.payload;
      });
  },
});

export const { clearStockSuccess, clearStockError, clearVendorError } =
  stockEntrySlice.actions;
export default stockEntrySlice.reducer;
