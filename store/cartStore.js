import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  fetchUserCart, 
  addToCloudCart, 
  updateCloudQuantity, 
  removeFromCloudCart, 
  clearCloudCart,
  syncLocalToCloud 
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
        const existing = state.items.find(
          (i) => i.id === product.id && i.size === product.size
        );

        let newItems;
        if (existing) {
          newItems = state.items.map((i) =>
            i.id === product.id && i.size === product.size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          newItems = [...state.items, { ...product, quantity: 1 }];
        }

        set({ items: newItems, isOpen: true });

        if (state.userId) {
          await addToCloudCart(state.userId, { 
            ...product, 
            quantity: existing ? existing.quantity + 1 : 1 
          });
        }
      },

      removeItem: async (id) => {
        const state = get();
        const itemToRemove = state.items.find(i => i.id === id);
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        if (state.userId && itemToRemove?.db_id) {
          await removeFromCloudCart(itemToRemove.db_id);
        }
      },

      updateQuantity: async (id, qty) => {
        const state = get();
        const item = state.items.find(i => i.id === id);
        
        if (qty <= 0) {
          state.removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i
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

      getItemCount: () =>
        get().items.reduce((t, i) => t + i.quantity, 0),
    }),
    { name: "rangrez-cart" }
  )
);
