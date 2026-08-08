import { ArrowRight } from "lucide-react";
import farmHero from "../../assets/farm-hero.png";

export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-green-100 to-lime-50 rounded-3xl px-10 py-8 flex justify-between items-center min-h-[320px]">

      <div>

        <h1 className="text-4xl xl:text-5xl font-bold text-green-800">
          Good Morning, Farmer! 
        </h1>

        <p className="mt-5 text-gray-600 text-lg max-w-md">
          Here's what's happening on your farm today.
          AI insights to help you make better farming decisions.
        </p>

        <button className="mt-8 bg-green-600 hover:bg-green-700 text-white px-7 py-4 rounded-xl flex items-center gap-3">

          Start New Prediction

          <ArrowRight size={18} />

        </button>

      </div>

      <img
        src={farmHero}
        alt="Farmer"
        className="w-[430px] h-[250px] object-cover rounded-2xl shadow-xl"
      />

    </div>
  );
}