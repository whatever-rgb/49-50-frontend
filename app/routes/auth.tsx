import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase.config";

// Структура данных формы авторизации / регистрации
interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export function meta() {
  return [{ title: "Авторизация | НАТК" }];
}

export default function AuthPage() {
  const navigate = useNavigate();

  // Режим страницы: true — вход, false — регистрация
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>();

  /**
   * Обрабатывает отправку формы: выполняет вход или регистрацию через Firebase Auth.
   * При регистрации дополнительно обновляет displayName пользователя.
   */
  const onSubmit = async (data: AuthFormData) => {
    setServerError(null);
    setIsLoading(false);

    // Проверка совпадения паролей при регистрации
    if (!isLogin && data.password !== data.confirmPassword) {
      setServerError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        if (data.name) {
          await updateProfile(userCredential.user, { displayName: data.name });
        }
      }
      navigate("/menu");
    } catch (err: any) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setServerError("Этот email уже зарегистрирован.");
          break;
        case "auth/weak-password":
          setServerError("Пароль слишком простой (минимум 6 символов).");
          break;
        case "auth/invalid-credential":
          setServerError("Неверная почта или пароль.");
          break;
        default:
          setServerError("Ошибка доступа. Попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Переключает режим между входом и регистрацией,
   * очищает ошибки и сбрасывает поля формы
   */
  const handleTabChange = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setServerError(null);
    reset();
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="flex border-b border-stone-50 bg-stone-50">
        <button
          type="button"
          onClick={() => handleTabChange(true)}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            isLogin
              ? "bg-white text-tom-thumb-800 border-b-2 border-tom-thumb-800"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => handleTabChange(false)}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            !isLogin
              ? "bg-white text-tom-thumb-800 border-b-2 border-tom-thumb-800"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Регистрация
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">
          {isLogin ? "Авторизация" : "Создание аккаунта"}
        </h2>

        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200 text-center">
            {serverError}
          </div>
        )}

        {/* Поле имени — только для режима регистрации */}
        {!isLogin && (
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-1">
              Имя
            </label>
            <input
              type="text"
              placeholder="Константин"
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
              {...register("name", { required: !isLogin })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">Обязательное поле</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-stone-700 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="example@mail.ru"
            className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
            {...register("email", { required: "Введите email" })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-stone-700 text-sm font-medium mb-1">
            Пароль
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
            {...register("password", {
              required: "Введите пароль",
              minLength: { value: 6, message: "Минимум 6 символов" },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Поле подтверждения пароля — только для режима регистрации */}
        {!isLogin && (
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-1">
              Повторите пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
              {...register("confirmPassword", { required: !isLogin })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Обязательное поле</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-stone-800 text-white py-3 rounded-xl font-medium hover:bg-stone-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed mt-4 shadow-sm"
        >
          {isLoading
            ? "Загрузка..."
            : isLogin
            ? "Войти в личный кабинет"
            : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}