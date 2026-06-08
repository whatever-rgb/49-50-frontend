import type { MenuItem } from "~/types";

interface Props {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: Props) {
  return (
    <div className="bg-retro-800 rounded-none border-2 border-retro-300 overflow-hidden hover:border-retro-200 transition-colors">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-retro-200 text-xs leading-relaxed">{item.name}</h3>
          <span className="text-retro-300 font-bold text-xs ml-2 whitespace-nowrap">
            {item.price} ₽
          </span>
        </div>
        <p className="text-xs text-retro-100 mb-4 leading-relaxed">{item.description}</p>
        <button
          onClick={() => onAddToCart(item)}
          className="w-full bg-retro-300 text-retro-900 py-2 text-xs hover:bg-retro-200 transition-colors border-2 border-retro-200"
        >
          В корзину
        </button>
      </div>
    </div>
  );
}