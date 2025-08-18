// sellerDashboardSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  dashboardData: [],
  isLoading: false,
  error: null,
};

// Ambil data dashboard seller
export const getSellerDashboardData = createAsyncThunk(
  "dashboard/getSellerDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://project-ta-walekreasi-backend-production.up.railway.app/api/store/dashboard`,
        { withCredentials: true }
      );

      const resData = response.data;
      if (resData.status !== "success") {
        return rejectWithValue(resData.message || "Gagal mengambil data dashboard");
      }

      return resData.data; // hanya kirim data array bulan
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil data dashboard"
      );
    }
  }
);

const sellerDashboardSlice = createSlice({
  name: "sellerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSellerDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSellerDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload || [];
      })
      .addCase(getSellerDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.dashboardData = [];
        state.error = action.payload;
      });
  },
});

export default sellerDashboardSlice.reducer;
