import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, MenuItem } from "~/types";

interface CartContextValue {
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
  addItem: (item: MenuItem) => void;
  updateQuantity: (id: number, newQty: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Провайдер корзины — оборачивает приложение и предоставляет данные корзины всем компонентам
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Считает общую сумму заказа, пересчитывается только при изменении items
  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    [items]
  );

  // Считает общее количество товаров, пересчитывается только при изменении items
  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  // Добавляет товар в корзину или увеличивает его количество если он уже есть
  const addItem = (menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  // Обновляет количество товара, удаляет если количество стало <= 0
  const updateQuantity = (id: number, newQty: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.menuItem.id === id ? { ...item, quantity: newQty } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Удаляет товар из корзины по id
  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.menuItem.id !== id));
  };

  // Полностью очищает корзину
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, totalAmount, totalCount, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Хук для доступа к данным корзины из любого компонента внутри CartProvider
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}