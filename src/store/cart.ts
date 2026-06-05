import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  personalizationText?: string;
  quantity: number;
};

function cartLineId(item: Pick<CartItem, "productId" | "color" | "personalizationText">) {
  const text = item.personalizationText?.trim() ?? "";
  return text ? `${item.productId}-${item.color}-${text}` : `${item.productId}-${item.color}`;
}

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (item) => {
        const id = cartLineId(item);
        set((s) => {
          const existing = s.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [...s.items, { ...item, id, quantity: item.quantity ?? 1 }],
            isOpen: true,
          };
        });
      },
      updateQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "layeronic-cart" },
  ),
);