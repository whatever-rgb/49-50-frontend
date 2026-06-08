import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useCart } from "~/hooks/useCart";
import { useAuth } from "~/hooks/useAuth";
import Modal from "~/components/ui/Modal";
import Button from "~/components/ui/Button";
import apiClient from "~/services/apiClient";

export function meta() {
  return [{ title: "Оформление заказа | TomYumBar" }];
}

// Интерфейс полей формы оформления заказа
interface CheckoutFormData {
  name: string;
  phone: string;
  comment: string;
  paymentMethod: "card" | "cash";
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  // Получаем данные авторизованного пользователя
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Инициализация формы с дефолтными значениями
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: "card",
      comment: "",
    },
  });

  // Следим за именем и телефоном для отображения в модальном окне
  const watchedName = watch("name");
  const watchedPhone = watch("phone");

  // Автозаполняем имя из профиля пользователя если он авторизован
  useEffect(() => {
    if (user?.name) {
      setValue("name", user.name);
    }
  }, [user, setValue]);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-bold text-retro-300 mb-6">Нечего оформлять</h2>
        <Link
          to="/menu"
          className="text-xs text-retro-200 border-b border-retro-200 hover:text-retro-300"
        >
          Перейти в меню
        </Link>
      </div>
    );
  }

  // Отправка заказа на сервер
  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    // Формируем объект заказа для отправки
    const orderData = {
      customer: {
        name: data.name,
        phone: data.phone,
        comment: data.comment,
        paymentMethod: data.paymentMethod,
      },
      // Преобразуем элементы корзины в формат сервера
      items: items.map((item) => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
      })),
      total: totalAmount,
      // Привязываем заказ к userId если пользователь авторизован
      userId: user ? user.uid : null,
    };

    try {
      await apiClient.post("/orders", orderData);
      setIsProcessing(false);
      setIsModalOpen(true);
    } catch (error) {
      setIsProcessing(false);
      alert("Не удалось отправить заказ. Проверьте подключение к серверу.");
    }
  };

  // Закрытие модального окна, очистка корзины и редирект на главную
  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearCart();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-retro-200 mb-8 text-center">
        Оформление заказа
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-retro-300 text-xs mb-2">Ваше имя *</label>
          <input
            type="text"
            className="w-full bg-retro-800 border-2 border-retro-600 text-retro-200 px-4 py-3 text-xs focus:outline-none focus:border-retro-300 font-bold"
            placeholder="Иван Иванов"
            {...register("name", { required: "Укажите ваше имя" })}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-retro-300 text-xs mb-2">Телефон *</label>
          <input
            type="tel"
            className="w-full bg-retro-800 border-2 border-retro-600 text-retro-200 px-4 py-3 text-xs focus:outline-none focus:border-retro-300 font-bold"
            placeholder="+7 (923) 182-28-88"
            {...register("phone", { required: "Укажите номер телефона" })}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-retro-300 text-xs mb-2">Комментарий к заказу</label>
          <textarea
            className="w-full bg-retro-800 border-2 border-retro-600 text-retro-200 px-4 py-3 text-xs focus:outline-none focus:border-retro-300 font-bold"
            rows={3}
            placeholder="Пожелания, аллергии..."
            {...register("comment")}
          />
        </div>
        <div>
          <label className="block text-retro-300 text-xs mb-2">Способ оплаты</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-retro-200">
              <input
                type="radio"
                value="card"
                {...register("paymentMethod")}
              />
              Картой онлайн
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-retro-200">
              <input
                type="radio"
                value="cash"
                {...register("paymentMethod")}
              />
              Наличными
            </label>
          </div>
        </div>
        <div className="bg-retro-800 border-2 border-retro-600 p-5">
          <h3 className="font-bold text-retro-200 text-xs mb-3">Ваш заказ:</h3>
          {items.map((item) => (
            <div
              key={item.menuItem.id}
              className="flex justify-between text-xs text-retro-300 py-1"
            >
              <span>{item.menuItem.name} × {item.quantity}</span>
              <span>{item.menuItem.price * item.quantity} ₽</span>
            </div>
          ))}
          <div className="border-t border-retro-600 mt-3 pt-3 flex justify-between font-bold text-sm text-retro-200">
            <span>Итого:</span>
            <span>{totalAmount} ₽</span>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full py-4"
        >
          {isProcessing ? "Обработка..." : "Оплатить заказ"}
        </Button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Заказ оформлен!"
      >
        <div className="text-center py-4">
          {/* Используем watch-значения из формы для актуальных данных */}
          <p className="text-xs text-retro-200 mb-2">Спасибо, {watchedName}!</p>
          <p className="text-xs text-retro-300 mb-6 leading-loose">
            Ваш заказ на сумму {totalAmount} ₽ принят.
            Мы свяжемся с вами по телефону {watchedPhone}.
          </p>
          <Button onClick={handleCloseModal} className="w-full">
            На главную
          </Button>
        </div>
      </Modal>
    </div>
  );
}