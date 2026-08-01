import farmGirl from "../../assets/farm-girl.png";

export default function FarmIllustration() {
  return (
<div className="h-[560px] bg-gradient-to-br from-green-100 to-lime-50 rounded-2xl shadow-md p-6 flex flex-col justify-center items-center">
      <img
        src={farmGirl}
        alt="Smart Farming"
        className="w-full rounded-xl object-contain"
      />

      <h2 className="text-2xl font-bold text-green-700 mt-4">
        Smart Farming
      </h2>

      <p className="text-center text-gray-600 mt-2">
        AI helps farmers maximize production using weather, soil and crop insights.
      </p>

    </div>
  );
}