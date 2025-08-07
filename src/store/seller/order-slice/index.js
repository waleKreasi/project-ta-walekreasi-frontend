import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
};

export const getAllOrdersForSeller = createAsyncThunk(
  "/order/getAllOrdersForSeller",
  async () => {
    const response = await axios.get(
      `https://project-ta-walekreasi-backend-production.up.railway.app/api/store/orders/get`
    );

    return response.data;
  }
);

export const getOrderDetailsForSeller = createAsyncThunk(
  "/order/getOrderDetailsForSeller",
  async (id) => {
    const response = await axios.get(
      `https://project-ta-walekreasi-backend-production.up.railway.app/api/store/orders/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://project-ta-walekreasi-backend-production.up.railway.app/api/store/orders/update/${id}`,
        { orderStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      const resData = response.data;

      // Jika sukses false, anggap gagal
      if (!resData.success) {
        return rejectWithValue(resData.message || "Gagal memperbarui status");
      }

      return resData;
    } catch (error) {
      console.error("Update status failed:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Gagal memperbarui status");
    }
  }
);



const sellerOrderSlice = createSlice({
  name: "sellerOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");

      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForSeller.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      }) 
      .addCase(getOrderDetailsForSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForSeller.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = sellerOrderSlice.actions;

export default sellerOrderSlice.reducer;
