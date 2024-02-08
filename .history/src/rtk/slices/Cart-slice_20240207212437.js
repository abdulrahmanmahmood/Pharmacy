import { createSlice, createAction } from "@reduxjs/toolkit";

const localStorageKey = 'cartSlice';
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem(localStorageKey);
  return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToStorage = (cartSlice) => {
  localStorage.setItem(localStorageKey, JSON.stringify(cartSlice));
};


const initialState = loadCartFromStorage();


export const clearCart = createAction('cart/clearCart');

export const cartSlice = createSlice({
  initialState, 
  name: "cartSlice",
  reducers: {
    
    addToCart: (state, action) => {
      const itemToAdd = action.payload;
    
  
      const existingProductIndex = state.findIndex(
        (product) => product.productId === itemToAdd.productId
      );
    
      if (existingProductIndex !== -1) {
        // If the product exists, increment the quantity
        state[existingProductIndex].quantity += itemToAdd.quantity || 1;
      } else {
        // If the product doesn't exist, add it to the cart
        const productClone = { ...itemToAdd, quantity: itemToAdd.quantity || 1 };
        state.push(productClone);
      }
    
      saveCartToStorage(state);
    },

    deleteFromCart: (state, action) => {
      const productToDelete = action.payload;
      return state.filter((product) => product.productId !== productToDelete.productId);
    },
    
    
  },

  extraReducers: (builder) => {
    builder.addCase(clearCart, (state) => {
      // Clear the cart by returning an empty array
      saveCartToStorage([]);
      return [];
    });
  },
});

export const { addToCart , deleteFromCart } = cartSlice.actions;
export default cartSlice.reducer;
