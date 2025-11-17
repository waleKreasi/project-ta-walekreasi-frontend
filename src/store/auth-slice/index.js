// src/store/auth-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ===============================
// AXIOS INSTANCE
// ===============================
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
  withCredentials: true,
});

// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

// ===============================
// REGISTER CUSTOMER
// ===============================
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", formData);

      if (!res.data.success) {
        return rejectWithValue(res.data);
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Gagal mendaftar" });
    }
  }
);

// ===============================
// REGISTER SELLER
// ===============================
export const registerSeller = createAsyncThunk(
  "/auth/register-seller",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register-seller", formData);

      if (!res.data.success) {
        return rejectWithValue(res.data);
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Gagal mendaftar seller" });
    }
  }
);

// ===============================
// LOGIN
// ===============================
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", formData);

      if (!res.data.success) {
        return rejectWithValue(res.data);
      }

      // Update session
      await dispatch(checkAuth());

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login gagal" });
    }
  }
);

// ===============================
// LOGOUT
// ===============================
export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/logout");

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Logout gagal" });
    }
  }
);

// ===============================
// CHECK AUTH (CEK SESSION)
// ===============================
export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/check-auth", {
        headers: {
          "Cache-Control": "no-store, no-cache",
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Session invalid" });
    }
  }
);

// ===============================
// AUTH SLICE
// ===============================
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
      // ==========================================
      // REGISTER USER
      // ==========================================
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // ==========================================
      // REGISTER SELLER
      // ==========================================
      .addCase(registerSeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerSeller.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // ==========================================
      // LOGIN
      // ==========================================
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // ==========================================
      // CHECK AUTH
      // ==========================================
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
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

      // ==========================================
      // LOGOUT
      // ==========================================
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
