import { restaurantInfo } from "~/data/restaurant";
import restaurantImage from "~/assets/restaurant.avif";

export function meta() {
  return [{ title: "О нас | TomYumBar" }];
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="bg-retro-800 border-2 border-retro-300 p-8">
        <h1 className="text-2xl font-bold text-retro-200 mb-4">О нас</h1>
        <p className="text-xs text-retro-300 leading-loose">
          {restaurantInfo.name} — кафе и служба доставки паназиатской кухни.
          Идеальное сочетание качества и полноты вкуса. Готовим из свежих
          ингредиентов каждый день.
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="bg-retro-800 border-2 border-retro-600 p-8">
          <h2 className="text-sm font-bold text-retro-200 mb-4">Наши преимущества</h2>
          <ul className="space-y-3 text-xs text-retro-300 leading-loose">
            <li>► Свежие ингредиенты каждый день</li>
            <li>► Быстрая доставка по городу</li>
            <li>► Удобное расположение в центре</li>
            <li>► Уютная атмосфера и живая музыка</li>
          </ul>
        </div>
        <div className="bg-retro-800 border-2 border-retro-600 p-4 flex items-center justify-center">
          <img
            src={restaurantImage}
            alt="Ресторан TomYumBar"
            className="w-full h-auto object-cover border border-retro-300"
          />
        </div>
      </section>
    </div>
  );
}