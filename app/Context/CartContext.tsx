"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, CartContextType } from "@/type/cart";

// ── Actions ─
// The Action type defines the possible actions that can be dispatched to the cartReducer. Each action has a type and an optional payload, which contains the necessary data for that action. The actions include adding an item, removing an item, updating the quantity of an item, clearing the cart, and loading the cart from localStorage.




type Action =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { _id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

//       -----── Reducer ─────

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.find((i) => i._id === action.payload._id);
      if (exists) {
        return state.map((i) =>
          i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case "REMOVE_ITEM":
      return state.filter((i) => i._id !== action.payload);

    case "UPDATE_QTY":
      if (action.payload.quantity <= 0)
        return state.filter((i) => i._id !== action.payload._id);
      return state.map((i) =>
        i._id === action.payload._id
          ? { ...i, quantity: action.payload.quantity }
          : i,
      );

    case "CLEAR_CART":
      return [];

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);

// ── Provider ──────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) =>
    dispatch({ type: "ADD_ITEM", payload: item });

  const removeItem = (_id: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: _id });

  const updateQuantity = (_id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", payload: { _id, quantity } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Custom Hook ────────
export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
