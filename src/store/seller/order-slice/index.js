import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
  error: null,
};

// Ambil semua order milik seller
export const getAllOrdersForSeller = createAsyncThunk(
  "order/getAllOrdersForSeller",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://project-ta-walekreasi-backend-production.up.railway.app/api/store/orders/get`,
        { withCredentials: true }
      );

      const resData = response.data;
      if (!resData.success) {
        return rejectWithValue(resData.message || "Gagal mengambil pesanan seller");
      }

      return resData.data; // hanya kirim data orders
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil pesanan seller");
    }
  }
);

// Detail order untuk seller
export const getOrderDetailsForSeller = createAsyncThunk(
  "order/getOrderDetailsForSeller",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://project-ta-walekreasi-backend-production.up.railway.app/api/store/orders/details/${id}`,
        { withCredentials: true }
      );

      const resData = response.data;
      if (!resData.success) {
        return rejectWithValue(resData.message || "Gagal mengambil detail pesanan");
      }

      return resData.data; // hanya kirim data order
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil detail pesanan");
    }
  }
);

// Update status order
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://project-ta-walekreasi-backend-production.up.railway.app/api/store/orders/update/${id}`,
        { orderStatus },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const resData = response.data;
      if (!resData.success) {
        return rejectWithValue(resData.message || "Gagal memperbarui status");
      }

      // karena backend hanya return success & message
      return { id, orderStatus };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memperbarui status");
    }
  }
);

const sellerOrderSlice = createSlice({
  name: "sellerOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Semua order seller
      .addCase(getAllOrdersForSeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersForSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload || [];
      })
      .addCase(getAllOrdersForSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error = action.payload;
      })
      // Detail order seller
      .addCase(getOrderDetailsForSeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetailsForSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetailsForSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.payload;
      })
      // Update status order
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { id, orderStatus } = action.payload;
        const idx = state.orderList.findIndex((o) => o._id === id);
        if (idx !== -1) {
          state.orderList[idx].orderStatus = orderStatus;
        }
        if (state.orderDetails && state.orderDetails._id === id) {
          state.orderDetails.orderStatus = orderStatus;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetOrderDetails } = sellerOrderSlice.actions;
export default sellerOrderSlice.reducer;
