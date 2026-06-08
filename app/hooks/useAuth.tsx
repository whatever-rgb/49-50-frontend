import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import type { UserProfile } from "~/types";

// Описание значений, доступных через контекст авторизации
interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Создание контекста авторизации с начальным значением null
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Провайдер авторизации — оборачивает дочерние компоненты и предоставляет
 * данные текущего пользователя и функцию выхода через контекст
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Подписка на изменения состояния авторизации Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Пользователь",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Отписка при размонтировании компонента
    return () => unsubscribe();
  }, []);

  /**
   * Выполняет выход пользователя из системы через Firebase Auth
   */
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * Хук для получения данных авторизации из контекста.
 * Должен использоваться только внутри AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}