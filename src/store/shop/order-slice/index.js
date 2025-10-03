// src/redux/slices/shopping-order-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ axios instance dengan baseURL baru
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
  withCredentials: true,
});

const initialState = {
  snapToken: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  error: null,
};

// [POST] Buat order baru
export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post("/shop/order/create", orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal membuat order");
    }
  }
);

// [GET] Ambil semua order milik user
export const getAllOrdersByUserId = createAsyncThunk(
  "order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/order/list/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memuat daftar order");
    }
  }
);

// [GET] Detail order
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/order/details/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memuat detail order");
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create order
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.snapToken = action.payload.snapToken;
        state.orderId = action.payload.orderId;
        // simpan orderId ke sessionStorage biar tetap ada pas reload
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.snapToken = null;
        state.orderId = null;
        state.error = action.payload;
      })

      // get all orders
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getAllOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error = action.payload;
      })

      // get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.payload;
      });
  },
});

export const { resetOrderDetails, clearOrderError } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
