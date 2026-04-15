import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  fetchUserCart,
  addToCloudCart,
  updateCloudQuantity,
  removeFromCloudCart,
  clearCloudCart,
  syncLocalToCloud,
} from "../lib/supabase/cart";

export const useCartStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      items: [],
      userId: null,

      setUserId: async (id) => {
        set({ userId: id });
        if (id) {
          const cloudItems = await syncLocalToCloud(id, get().items);
          set({ items: cloudItems });
        }
      },

      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: async (product) => {
        const state = get();
        const existing = state.items.find((i) => i.id === product.id);

        // Always include stock in cart item
        const productWithStock = {
          ...product,
          stock: product.stock !== undefined ? product.stock : 99,
        };

        let newItems;
        if (existing) {
          newItems = state.items.map((i) =>
            i.id === product.id
              ? {
                  ...i,
                  quantity: i.quantity + 1,
                  stock: productWithStock.stock,
                }
              : i,
          );
        } else {
          newItems = [...state.items, { ...productWithStock, quantity: 1 }];
        }

        set({ items: newItems, isOpen: true });

        if (state.userId) {
          await addToCloudCart(state.userId, {
            ...productWithStock,
            quantity: existing ? existing.quantity + 1 : 1,
          });
        }
      },
      // On cart open, fetch latest stock for all items
      refreshCartStock: async () => {
        const state = get();
        if (!state.items.length) return;
        // Fetch all product IDs
        const ids = state.items.map((i) => i.id);
        // Fetch latest stock from server
        try {
          const res = await fetch("/api/products/stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          });
          if (!res.ok) return;
          const stocks = await res.json(); // { [id]: stock }
          set((state) => ({
            items: state.items.map((i) => ({
              ...i,
              stock: stocks[i.id] !== undefined ? stocks[i.id] : i.stock,
            })),
          }));
        } catch (e) {}
      },

      removeItem: async (id) => {
        const state = get();
        const itemToRemove = state.items.find((i) => i.id === id);
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        if (state.userId && itemToRemove?.db_id) {
          await removeFromCloudCart(itemToRemove.db_id);
        }
      },

      updateQuantity: async (id, qty) => {
        const state = get();
        const item = state.items.find((i) => i.id === id);

        if (!item) return;
        // If stock is not present, allow update (fallback)
        const maxQty = item.stock !== undefined ? item.stock : 99;
        if (qty <= 0) {
          state.removeItem(id);
          return;
        }
        if (qty > maxQty) {
          alert(`Only ${maxQty} left in stock.`);
          qty = maxQty;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i,
          ),
        }));

        if (state.userId && item?.db_id) {
          await updateCloudQuantity(item.db_id, qty);
        }
      },

      clearCart: async () => {
        const state = get();
        set({ items: [] });
        if (state.userId) {
          await clearCloudCart(state.userId);
        }
      },

      getSubtotal: () =>
        get().items.reduce((t, i) => t + i.price * i.quantity, 0),

      getItemCount: () => get().items.reduce((t, i) => t + i.quantity, 0),
    }),
    { name: "rangrez-cart" },
  ),
);
