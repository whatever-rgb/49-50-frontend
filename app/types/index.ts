// Интерфейс элемента меню
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "Закуски" | "Основные блюда" | "Десерты" | "Супы";
  image: string;
}

// Интерфейс элемента корзины
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

// Интерфейс информации о ресторане
export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  workHours: string;
}

// Интерфейс данных заказа
export interface OrderData {
  items: CartItem[];
  total: number;
  customerName: string;
}

// Интерфейс данных о клиенте при оформлении заказа
export interface CustomerInfo {
  name: string;
  phone: string;
  comment?: string;
  paymentMethod: "card" | "cash";
}

// Интерфейс заказа в том виде, в котором он хранится на сервере
export interface ServerOrder {
  id: string;
  userId: string | null;
  customer: CustomerInfo;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: "Новый" | "Готовится" | "В пути" | "Доставлен";
  created_at: string;
}

// Интерфейс профиля авторизованного пользователя
export interface UserProfile {
  uid: string;
  email: string | null;
  name?: string;
}