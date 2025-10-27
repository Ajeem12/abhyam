import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ✅ Async thunk to fetch materials
export const fetchMaterials = createAsyncThunk(
  "materials/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/profile/fetch_material`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data; // assuming API returns an array of materials
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch materials"
      );
    }
  }
);

// ✅ Material slice
const materialSlice = createSlice({
  name: "materials",
  initialState: {
    materials: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default materialSlice.reducer;
