import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/utils/axios";

export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/auth/me");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Session verification failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isAuthenticated: false,
    status: "idle",
    user: null,
    error: null,
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.user = action.payload?.user || null;
      state.error = null;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.status = "idle";
      state.user = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(verifyUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(verifyUser.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload?.isAuthenticated ?? false;
        state.user = action.payload?.user || null;
        state.status = "succeeded";
        state.error = null;
      })

      .addCase(verifyUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
