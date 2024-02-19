import { createContext, useReducer } from "react";

import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  items: [],
  onAddItemToCart: () => {},
  onUpdateItemToCart: () => {}
});

function ShoppingCartReducer(state, action) {
  if(action.type === 'ADD_ITEMS'){
      const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
  }

  if(action.type === 'UPDATE_ITEMS'){
    const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.payload.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
  }

  return state;
}

export default function ThemeContextProvider({children}) {
  const [ shoppingCart, shoppingCartDispatch ] = useReducer(
    ShoppingCartReducer, 
    {
      items: []
    }
  );

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: 'ADD_ITEMS',
      payload: id
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: 'UPDATE_ITEMS',
      payload: {
        productId,
        amount
      }
    })
  }

  const cartCtx = {
    items: shoppingCart.items,
    onAddItemToCart: handleAddItemToCart,
    onUpdateItemToCart: handleUpdateCartItemQuantity
  }

  return (
    <CartContext.Provider value={cartCtx}>
      {children}
    </CartContext.Provider>
  );
} 