import { restaurantInfo } from "~/data/restaurant";

export default function Footer() {
  return (
    <footer className="bg-retro-950 text-retro-100 py-8 mt-12 border-t-4 border-retro-300">
      <div className="max-w-6xl mx-auto px-4 text-center text-xs leading-loose">
        <p className="text-lg font-bold text-retro-200 mb-4">{restaurantInfo.name}</p>
        <p>{restaurantInfo.address}</p>
        <p>{restaurantInfo.phone}</p>
        <p>{restaurantInfo.workHours}</p>
      </div>
    </footer>
  );
}