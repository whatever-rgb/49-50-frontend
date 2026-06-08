import type { CartItem as CartItemType } from "~/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export default function CartItem({ item, onUpdateQuantity }: CartItemProps) {
  const { menuItem, quantity } = item;

  return (
    <div className="bg-retro-800 border-2 border-retro-300 p-4 flex items-center gap-4">
      <img
        src={menuItem.image}
        alt={menuItem.name}
        className="w-20 h-20 object-cover border border-retro-300"
      />
      <div className="flex-grow">
        <h3 className="font-bold text-retro-200 text-xs mb-1">{menuItem.name}</h3>
        <p className="text-retro-300 text-xs">
          {menuItem.price} ₽ × {quantity} = {menuItem.price * quantity} ₽
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(menuItem.id, quantity - 1)}
          className="w-8 h-8 bg-retro-600 text-retro-100 border border-retro-300 hover:bg-retro-500 transition-colors text-xs"
        >
          −
        </button>
        <span className="w-8 text-center text-retro-200 text-xs font-bold">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}
          className="w-8 h-8 bg-retro-600 text-retro-100 border border-retro-300 hover:bg-retro-500 transition-colors text-xs"
        >
          +
        </button>
      </div>
    </div>
  );
}