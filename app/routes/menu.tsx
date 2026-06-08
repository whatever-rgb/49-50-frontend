import { useEffect, useState } from "react";
import MenuCard from "~/components/MenuCard";
import { useCart } from "~/hooks/useCart";
import type { MenuItem } from "~/types";
import apiClient from "~/services/apiClient";

export function meta() {
  return [{ title: "Меню | TomYumBar" }];
}

export default function MenuPage() {
  const categories = ["Все", "Закуски", "Основные блюда", "Десерты", "Супы"];
  const [activeCategory, setActiveCategory] = useState("Все");
  const { totalCount, addItem } = useCart();

  // Список блюд полученных с сервера
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  // Флаг загрузки данных
  const [isLoading, setIsLoading] = useState(true);
  // Текст ошибки если запрос не удался
  const [error, setError] = useState<string | null>(null);

  // Загружаем меню с сервера при открытии страницы
  useEffect(() => {
    apiClient
      .get<MenuItem[]>("/menu")
      .then((response) => {
        setMenuData(response.data);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
          err.message ||
          "Не удалось загрузить меню"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Фильтрация блюд по выбранной категории
  const filteredMenu =
    activeCategory === "Все"
      ? menuData
      : menuData.filter((item) => item.category === activeCategory);

  // Добавление блюда в корзину
  const addToCart = (item: MenuItem) => {
    addItem(item);
  };

  // Показываем индикатор загрузки пока данные не пришли
  if (isLoading) {
    return (
      <div className="text-center py-20 text-xs text-retro-300">
        Загрузка меню...
      </div>
    );
  }

  // Показываем ошибку если запрос не удался
  if (error) {
    return (
      <div className="text-center py-20 text-xs text-red-400">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-retro-200">Меню</h1>
        <span className="bg-retro-800 text-retro-300 px-4 py-2 text-xs border border-retro-300">
          {totalCount} в корзине
        </span>
      </div>
      <div className="flex gap-3 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs border-2 transition-colors ${
              activeCategory === cat
                ? "bg-retro-300 text-retro-900 border-retro-200"
                : "bg-retro-800 text-retro-300 border-retro-600 hover:border-retro-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item) => (
          <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}