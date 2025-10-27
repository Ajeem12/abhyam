// src/redux/slices/changePasswordSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Async thunk for changing password
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_BASE}/profile/change_password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.status) {
        return rejectWithValue(response.data.data || 'Failed to change password');
      }

      return response.data.data; // This will be the success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.data || 'Something went wrong'
      );
    }
  }
);


const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState: {
    loading: false,
    successMessage: null,
    error: null,
  },
  reducers: {
    clearChangePasswordState: (state) => {
      state.loading = false;
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      });
  },
});

export const { clearChangePasswordState } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
