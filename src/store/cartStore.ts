import { create } from 'zustand';
import type { PackageItem } from '@/data/packages';

export interface CartItem {
  pkg: PackageItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (pkg: PackageItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (pkg) => {
    const existing = get().items.find(i => i.pkg.id === pkg.id);
    if (existing) {
      set({ items: get().items.map(i => i.pkg.id === pkg.id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ items: [...get().items, { pkg, quantity: 1 }] });
    }
  },
  removeItem: (id) => set({ items: get().items.filter(i => i.pkg.id !== id) }),
  clearCart: () => set({ items: [] }),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.pkg.price * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
