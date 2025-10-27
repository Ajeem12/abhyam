import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Async thunk for fetching profile data
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data.status) {
        return rejectWithValue(res.data.message || "Failed to fetch profile");
      }

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching profile");
    }
  }
);

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API_BASE}/api/profile/update`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data.status) {
        return rejectWithValue(res.data.message || "Update failed");
      }

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error updating profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearProfileMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.successMessage = "Profile updated successfully.";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileMessages } = profileSlice.actions;

export default profileSlice.reducer;
