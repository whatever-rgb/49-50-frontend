import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
// Импорт хука авторизации для получения данных пользователя
import { useAuth } from "~/hooks/useAuth";
// Импорт иконок
import { LuUser, LuLogOut, LuLogIn, LuHistory } from "react-icons/lu";

export default function Header() {
  // Получаем данные пользователя и функцию выхода из хука авторизации
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  // Состояние открытия выпадающего меню профиля
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Выход из аккаунта и редирект на главную
  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-retro-900 text-retro-200 shadow-md border-b-4 border-retro-300">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-retro-200 tracking-wider">
          TomYumBar
        </Link>
        <div className="flex gap-8 text-xs">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-retro-200" : "text-retro-300 hover:text-retro-200"
            }
          >
            Главная
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              isActive ? "text-retro-200" : "text-retro-300 hover:text-retro-200"
            }
          >
            Меню
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "text-retro-200" : "text-retro-300 hover:text-retro-200"
            }
          >
            Корзина
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-retro-200" : "text-retro-300 hover:text-retro-200"
            }
          >
            О нас
          </NavLink>
        </div>

        {/* Блок авторизации — показываем только после загрузки */}
        {!loading && (
          user ? (
            // Пользователь вошёл — показываем меню профиля
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-xs text-retro-200 border border-retro-600 px-3 py-2 hover:border-retro-300 transition-colors"
              >
                <LuUser className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </button>

              {/* Выпадающее меню */}
              {isMenuOpen && (
                <>
                  {/* Прозрачный слой для закрытия меню кликом вне него */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-retro-900 border-2 border-retro-600 z-20">
                    {/* Ссылка на историю заказов */}
                    <Link
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-xs text-retro-300 hover:text-retro-200 hover:bg-retro-800 transition-colors"
                    >
                      <LuHistory className="w-4 h-4" />
                      История заказов
                    </Link>
                    <hr className="border-retro-700" />
                    {/* Кнопка выхода */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-xs text-retro-300 hover:text-retro-200 hover:bg-retro-800 transition-colors text-left"
                    >
                      <LuLogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Пользователь не вошёл — кнопка входа
            <Link
              to="/auth"
              className="flex items-center gap-2 text-xs text-retro-900 bg-retro-300 px-3 py-2 hover:bg-retro-200 transition-colors"
            >
              <LuLogIn className="w-4 h-4" />
              Войти
            </Link>
          )
        )}
      </nav>
    </header>
  );
}