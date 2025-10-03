import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ axios instance dengan baseURL baru
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
  withCredentials: true,
});

// 🔄 State awal
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// ✅ Register Customer
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await api.post("/auth/register", formData);
    return response.data;
  }
);

// ✅ Register Seller
export const registerSeller = createAsyncThunk(
  "/auth/register-seller",
  async (formData) => {
    const response = await api.post("/auth/register-seller", formData);
    return response.data;
  }
);

// ✅ Login
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { dispatch }) => {
    const response = await api.post("/auth/login", formData);

    // 🔑 Setelah login sukses, langsung validasi session
    if (response.data.success) {
      await dispatch(checkAuth());
    }

    return response.data;
  }
);

// ✅ Logout
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await api.post("/auth/logout", {});
  return response.data;
});

// ✅ Check Auth
export const checkAuth = createAsyncThunk("/auth/checkauth", async () => {
  const response = await api.get("/auth/check-auth", {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
  return response.data;
});

// 🔧 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Register Seller
      .addCase(registerSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerSeller.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerSeller.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        // user & auth status diperbarui oleh checkAuth
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
