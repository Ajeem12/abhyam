// src/pages/redux/slices/projectSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Adjust the key if needed

      const response = await axios.get(`${API_BASE}/profile/assign_projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return normalizeProjects(response.data.data);
    } catch (error) {
      console.error("Projects fetch error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch projects"
      );
    }
  }
);


// Helper function to normalize API response
const normalizeProjects = (apiResponse) => {
  const projectsData =
    apiResponse?.data ?? apiResponse?.projects ?? apiResponse ?? [];
  return Array.isArray(projectsData) ? projectsData : [projectsData];
};

const initialState = {
  projects: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectsError: (state) => {
      state.error = null;
    },
    resetProjects: () => initialState,
    addProject: (state, action) => {
      state.projects.unshift(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.projects[index] = action.payload;
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearProjectsError,
  resetProjects,
  addProject,
  updateProject,
  deleteProject,
} = projectSlice.actions;

export default projectSlice.reducer;
