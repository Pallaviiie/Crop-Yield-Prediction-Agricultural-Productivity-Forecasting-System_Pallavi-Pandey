import {
  SunMedium,
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
} from "lucide-react";

export default function WeatherCard() {
  return (
<div className="bg-white rounded-2xl shadow-md p-5 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
  <h2 className="text-2xl font-bold text-green-700">
    Today's Weather
  </h2>
</div>

<div className="flex justify-center my-4">
  <CloudSun className="w-20 h-20 text-blue-400" />
</div>

<h1 className="text-5xl font-bold">28°C</h1>

<p className="text-gray-500 mb-6">Partly Cloudy</p>

<div className="space-y-4">

  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <Droplets className="w-5 h-5 text-blue-500" />
      <span>Humidity</span>
    </div>
    <span className="font-semibold">78%</span>
  </div>

  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <Wind className="w-5 h-5 text-gray-600" />
      <span>Wind</span>
    </div>
    <span className="font-semibold">15 km/h</span>
  </div>

  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <CloudRain className="w-5 h-5 text-sky-500" />
      <span>Rain Chance</span>
    </div>
    <span className="font-semibold">35%</span>
  </div>

</div>

    </div>
  );
}