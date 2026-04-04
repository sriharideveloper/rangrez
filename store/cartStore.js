import { create } from "zustand";

export const useCartStore = create((set) => ({
  isOpen: false,
  items: [],
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (item) =>
    set((state) => {
      // Simple add item logic, extend for duplicates / quantities
      return { items: [...state.items, item], isOpen: true };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
