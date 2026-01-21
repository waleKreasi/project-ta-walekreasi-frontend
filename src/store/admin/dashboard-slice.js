import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// axios instance
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com",
  withCredentials: true,
});

/* ============================
   1) GET STATISTIK DASHBOARD
============================= */
export const fetchAdminStats = createAsyncThunk(
  "adminDashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/dashboard/stats");
      console.log("Stats Payload Backend:", res.data.data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch stats");
    }
  }
);

/* ============================
   2) GET GROUPED ORDERS
============================= */
export const fetchAdminOrdersByStatus = createAsyncThunk(
  "adminDashboard/fetchOrdersByStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/dashboard/orders-by-status");
      console.log("Orders By Status Backend:", res.data.data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch orders");
    }
  }
);

/* ============================
   SLICE
============================= */
const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    // Statistik dari /stats
    sellerCount: 0,
    customerCount: 0,
    totalRevenue: 0,
    totalOrders: 0,
    monthlyRevenue: [],

    // Data order dari /orders-by-status (ARRAY)
    ordersByStatus: {
      pending: [],
      processing: [],
      shipped: [],
      delivered: [],
      rejected: [],
    },

    statsLoading: false,
    ordersLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    /* ------------ FETCH STATS ------------- */
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsLoading = false;

        state.sellerCount = action.payload.sellerCount;
        state.customerCount = action.payload.customerCount;
        state.totalRevenue = action.payload.totalRevenue;
        state.totalOrders = action.payload.totalOrders;
        state.monthlyRevenue = action.payload.monthlyRevenue;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload || "Error fetching stats";
      });

    /* ------------ FETCH ORDERS BY STATUS ------------- */
    builder
      .addCase(fetchAdminOrdersByStatus.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrdersByStatus.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.ordersByStatus = action.payload; // langsung simpan object array
      })
      .addCase(fetchAdminOrdersByStatus.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload || "Error fetching grouped orders";
      });
  },
});

export default adminDashboardSlice.reducer;
