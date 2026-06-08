import { Link } from "react-router";
import { useCart } from "~/hooks/useCart";

export function meta() {
  return [{ title: "Корзина | TomYumBar" }];
}

export default function CartPage() {
  const { items, totalAmount, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-bold text-retro-300 mb-6">Корзина пуста</h2>
        <Link
          to="/menu"
          className="text-xs text-retro-200 border-b border-retro-200 hover:text-retro-300"
        >
          Перейти в меню
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-retro-200 mb-8">Корзина</h1>
      {items.map((item) => (
        <div
          key={item.menuItem.id}
          className="bg-retro-800 border-2 border-retro-600 p-4 mb-4 flex items-center gap-4"
        >
          <img
            src={item.menuItem.image}
            alt={item.menuItem.name}
            className="w-20 h-20 object-cover border border-retro-300"
          />
          <div className="flex-grow">
            <h3 className="font-bold text-retro-200 text-xs mb-1">{item.menuItem.name}</h3>
            <p className="text-retro-300 text-xs">{item.menuItem.price} ₽</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
              className="w-8 h-8 bg-retro-600 text-retro-100 border border-retro-300 text-xs hover:bg-retro-500"
            >
              −
            </button>
            <span className="w-8 text-center text-retro-200 text-xs">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
              className="w-8 h-8 bg-retro-600 text-retro-100 border border-retro-300 text-xs hover:bg-retro-500"
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="bg-retro-800 border-2 border-retro-300 p-6 mt-6">
        <div className="flex justify-between text-sm font-bold mb-6 text-retro-200">
          <span>Итого:</span>
          <span>{totalAmount} ₽</span>
        </div>
        <Link
          to="/checkout"
          className="block text-center w-full bg-retro-300 text-retro-900 py-3 text-xs font-bold hover:bg-retro-200 transition-colors border-2 border-retro-200"
        >
          Оформить заказ
        </Link>
      </div>
    </div>
  );
}