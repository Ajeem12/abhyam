import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/apiClient";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/login", formData);

      if (!res.data.status || !res.data.token) {
        return rejectWithValue(res.data.message || "Invalid credentials");
      }

      localStorage.setItem("token", res.data.token);
      return { token: res.data.token };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      // Optional: Call logout API if you have one
      // await axiosInstance.post('/api/logout');
    } finally {
      localStorage.removeItem("token");
      dispatch(logout());
      return true;
    }
  }
);

const storedToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken,
    loading: false,
    error: null,
    isAuthenticated: !!storedToken,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
