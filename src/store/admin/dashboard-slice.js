import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAdminStats = createAsyncThunk(
  "adminDashboard/fetchStats",
  async () => {
    try {
      const res = await axios.get(
        "https://project-ta-walekreasi-backend-production.up.railway.app/api/admin/dashboard/stats",
        {
          withCredentials: true,
        }
      );
      // LOG UTAMA: Tampilkan payload yang diterima dari backend
      console.log("Payload yang diterima dari backend:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("Kesalahan saat mengambil data dashboard:", error);
      throw error;
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    sellerCount: 0,
    customerCount: 0,
    totalRevenue: 0,
    totalOrders: 0,
    weeklyRevenue: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.sellerCount = action.payload.sellerCount;
        state.customerCount = action.payload.customerCount;
        state.totalRevenue = action.payload.totalRevenue;
        state.totalOrders = action.payload.totalOrders;
        state.weeklyRevenue = action.payload.weeklyRevenue;
        state.loading = false;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adminDashboardSlice.reducer;
