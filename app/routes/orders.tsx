import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import apiClient from "~/services/apiClient";

// Описание одного товара в составе заказа
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Описание заказа, полученного с сервера
interface Order {
  id: string;
  status: string;
  total: number;
  created_at?: string;
  items: OrderItem[];
}

export function meta() {
  return [{ title: "История заказов | НАТК" }];
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Не выполняем запрос, пока идёт проверка авторизации или пользователь не вошёл
    if (authLoading || !user) return;

    /**
     * Загружает историю заказов текущего пользователя с сервера
     */
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders", {
          params: { userId: user.uid },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  // Состояние загрузки авторизации или данных заказов
  if (authLoading || (user && isLoading)) {
    return (
      <div className="text-center py-20 text-stone-500">
        Загрузка истории заказов...
      </div>
    );
  }

  // Пользователь не авторизован
  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">
          История заказов недоступна
        </h2>
        <p className="text-stone-500 mb-6">
          Чтобы просматривать свои заказы, необходимо войти в аккаунт.
        </p>
        <Link
          to="/auth"
          className="inline-block bg-tom-thumb-800 text-white px-6 py-3 rounded-xl hover:bg-tom-thumb-700 transition-colors"
        >
          Войти в профиль
        </Link>
      </div>
    );
  }

  // У пользователя нет заказов
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">
          Вы ещё не делали заказов
        </h2>
        <Link
          to="/menu"
          className="text-tom-thumb-600 hover:underline text-lg"
        >
          Перейти в меню и заказать
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-tom-thumb-900 mb-8 text-center">
        Мои заказы
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Шапка карточки заказа: ID, дата, статус */}
            <div className="bg-stone-50 px-5 py-4 border-b border-stone-200 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="text-xs font-mono text-stone-400 block mb-0.5">
                  ID: {order.id}
                </span>
                <span className="text-sm font-medium text-stone-600">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Дата не указана"}
                </span>
              </div>
              <span className="bg-tom-thumb-100 text-tom-thumb-800 text-xs font-semibold px-3 py-1 rounded-full">
                {order.status}
              </span>
            </div>

            {/* Список товаров в заказе */}
            <div className="p-5 space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex justify-between text-sm text-stone-600"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{item.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>

            {/* Итоговая сумма заказа */}
            <div className="bg-stone-50/50 px-5 py-4 border-t border-stone-100 flex justify-between items-center font-bold text-lg">
              <span className="text-stone-700 text-base">Итого:</span>
              <span className="text-tom-thumb-700">{order.total} ₽</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}