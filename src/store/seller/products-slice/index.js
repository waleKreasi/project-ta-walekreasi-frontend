import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      "https://project-ta-walekreasi-backend-production.up.railway.app/api/store/products/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return result?.data; 
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      "https://project-ta-walekreasi-backend-production.up.railway.app/api/store/products/get",
      {
        withCredentials: true,
      }
    );

    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `https://project-ta-walekreasi-backend-production.up.railway.app/api/store/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `https://project-ta-walekreasi-backend-production.up.railway.app/api/store/products/delete/${id}`,
      {
        withCredentials: true,
      }
    );

    return result?.data;
  }
);

const sellerProductsSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("✅ FETCH SUCCESS:", action.payload);
        state.productList = action.payload?.data || []; 
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        console.log("✅ ADD SUCCESS:", action.payload); 
        if (action.payload?.success && action.payload?.product) {
          state.productList.push(action.payload.product);
        }
      });
  },
});

export default sellerProductsSlice.reducer;
