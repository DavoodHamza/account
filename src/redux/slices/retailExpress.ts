import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
const removeAProduct = (products: any, data: any) => {
  const findInd = products.findIndex((item: any) => item.id === data);
  if (findInd !== -1) {
    products.splice(findInd, 1);
  }
  return products;
};
const addProduct = (products: any, data: any) => {
  let product = products;
  const findInd = products.findIndex((item: any) => item.id === data.id);
  if (findInd < 0) {
    product = [...product, data];
  }
  return product;
};

const addCartProduct = (products: any, data: any) => {
  return [...data];
};

function addQuantity(products: any, data: any) {
  let indexNo = products.findIndex((item: any) => item.id === data);
  if (Number(products[indexNo].stock) == Number(products[indexNo]?.quantity_no)) {
    notification.error({ message: 'This is the maximum quantity for this product' })
  } else {
    products[indexNo].quantity_no = Number(products[indexNo]?.quantity_no) + 1;
  }
  return products;
}
function minusQuantity(products: any, data: any) {
  let indexNo = products.findIndex((item: any) => item.id === data);
  if (products[indexNo]?.quantity_no > 1) {
    products[indexNo].quantity_no = Number(products[indexNo]?.quantity_no) - 1;
  }
  return products;
}

const addHoldProducts = (products: any, data: any) => {
  let product = products;
  if (products?.length) {
    product = [data, ...product];
  } else {
    product = [data];
  }
  return product;
};

const removeHoldProducts = (products: any, data: any) => {
  let product = products;
  product.splice(data, 1)
  return product
}
const retailExpressSlice = createSlice({
  name: "retailExpress",
  initialState: {
    products: [],
    holdProducts: [],
    counter: {},
  },

  reducers: {
    addProducts: (state: any, action: any) => {
      state.products = addProduct(state.products, action.payload);
    },
    addCartProducts: (state: any, action: any) => {
      state.products = addCartProduct(state.products, action.payload);
    },
    addProductQuantity: (state: any, action: any) => {
      state.products = addQuantity(state.products, action.payload);
    },
    minusProductQuantity: (state: any, action: any) => {
      state.products = minusQuantity(state.products, action.payload);
    },
    removeProducts: (state, action) => {
      state.products = removeAProduct(state.products, action.payload);
    },
    clearProduct: (state, action) => {
      state.products = [];
    },

    addHoldProduct: (state, action) => {
      state.holdProducts = addHoldProducts(
        state.holdProducts,
        action.payload
      );
    },
    clearHoldProducts: (state) => {
      state.holdProducts = [];
    },
    removeHoldProduct: (state, action) => {
      state.holdProducts = removeHoldProducts(state.holdProducts, action.payload)
    },
    addCounter: (state, action) => {
      state.counter = action.payload;
    },
    clearCounter: (state, action) => {
      state.counter = {};
    },
  },
});

export const {
  addProducts,
  removeProducts,
  clearProduct,
  addProductQuantity,
  minusProductQuantity,
  clearHoldProducts,
  addCartProducts,
  removeHoldProduct,
  addHoldProduct,
  addCounter,
  clearCounter
} = retailExpressSlice.actions;
export default retailExpressSlice.reducer;
