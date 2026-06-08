import axios from "axios";
import { API_URL } from "~/config";

// Создание экземпляра axios с базовым URL и заголовками по умолчанию
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор ответов: пропускает успешные ответы, логирует и отклоняет ошибочные
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;