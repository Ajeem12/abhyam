import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

// 🔹 Fetch Day Closing Stock
export const fetchDayClosingStock = createAsyncThunk(
  "dayClose/fetchDayClosingStock",
  async (projectId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Authorization token not found");

      const formData = new FormData();
      formData.append("project_id", projectId);

      const res = await axios.post(
        `${API_BASE}/profile/dayClosingStockdata`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.status) {
        return rejectWithValue(res.data.message || "Failed to fetch data");
      }

      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Network error");
    }
  }
);

// 🔹 Submit Day Closing
export const submitDayClosing = createAsyncThunk(
  "dayClose/submitDayClosing",
  async (closingData, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Authorization token not found");

      const formData = new FormData();
      formData.append("project_id", closingData.project_id);
      formData.append("closing_date", closingData.closing_date);
      formData.append(
        "material_data",
        JSON.stringify(
          closingData.material_data.map((i) => ({
            material_id: i.material_id,
            stock_close: i.stock_close,
            current_stock: i.stock,
          }))
        )
      );

      const res = await axios.post(`${API_BASE}/profile/dayclosing`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.status) {
        return rejectWithValue(res.data.data || res.data || "Failed to submit");
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error while submitting"
      );
    }
  }
);

const dayCloseSlice = createSlice({
  name: "dayClose",
  initialState: {
    items: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearDayCloseState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    updateConsumeValue: (state, { payload }) => {
      const item = state.items.find(
        (i) => i.material_id === payload.material_id
      );
      if (item) {
        item.consume = payload.consume;
        item.balance = item.stock - payload.consume;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDayClosingStock
      .addCase(fetchDayClosingStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDayClosingStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload.map((i) => ({
          ...i,
          consume: 0,
          balance: i.stock,
        }));
      })
      .addCase(fetchDayClosingStock.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.items = [];
      })

      // submitDayClosing
      .addCase(submitDayClosing.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitDayClosing.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage =
          payload.message || payload.data.data || "Submitted successfully!";
      })
      .addCase(submitDayClosing.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.successMessage = null;
      });
  },
});

export const { clearDayCloseState, updateConsumeValue } = dayCloseSlice.actions;
export default dayCloseSlice.reducer;
