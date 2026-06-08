import { Link } from "react-router";
import { restaurantInfo } from "~/data/restaurant";

export function meta() {
  return [{ title: "TomYumBar" }];
}

export default function HomePage() {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-bold text-retro-200 mt-12 tracking-widest">
        {restaurantInfo.name}
      </h1>
      <p className="text-xs text-retro-300 max-w-2xl mx-auto leading-loose">
        Кафе и служба доставки паназиатской кухни.
        Идеальное сочетание качества и полноты вкуса.
      </p>
      <Link
        to="/menu"
        className="inline-block bg-retro-300 text-retro-900 px-8 py-4 text-xs font-bold hover:bg-retro-200 transition-colors border-2 border-retro-200"
      >
        Смотреть меню
      </Link>
    </div>
  );
}