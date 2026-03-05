  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

  export const verifyUser = createAsyncThunk(
    "auth/verifyUser",
    async (_, thunkAPI) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Verification failed");
        }

        const data = await res.json();
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  const authSlice = createSlice({
    name: "auth",
    initialState: {
      isAuthenticated: false,
      status: "idle",
      error: null,
    },
    reducers: {
      loginSuccess: (state) => {
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(verifyUser.pending, (state) => {
          state.status = "loading";
        })
        .addCase(verifyUser.fulfilled, (state, action) => {
          state.isAuthenticated = action.payload.isAuthenticated;
          state.status = "succeeded";
          state.error = null;
        })
        .addCase(verifyUser.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
          state.isAuthenticated = false;
        });
    },
  });

  export const { loginSuccess, logout } = authSlice.actions;
  export default authSlice.reducer;
