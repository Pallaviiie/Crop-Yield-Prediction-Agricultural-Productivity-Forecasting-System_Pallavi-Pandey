import {
  Sun,
  Cloud,
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
} from "lucide-react";

const days = [
  { day: "Mon", temp: "28°C", icon: Sun },
  { day: "Tue", temp: "26°C", icon: Cloud },
  { day: "Wed", temp: "24°C", icon: CloudRain },
  { day: "Thu", temp: "29°C", icon: Sun },
  { day: "Fri", temp: "27°C", icon: Cloud },
];

export default function WeatherForecast() {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 h-full">

      <div className="flex justify-between">

        <div>
          <h2 className="text-3xl font-bold">
            Weather Forecast
          </h2>

          <p className="text-gray-500">
            New Delhi
          </p>
        </div>

        <Sun size={34} className="text-yellow-500"/>
      </div>

      <h1 className="text-6xl font-bold text-green-700 mt-5">
        28°
      </h1>

      <p className="text-gray-500 mb-8">
        Sunny
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="bg-green-50 rounded-2xl p-4">
          <Droplets className="text-blue-500"/>
          <p className="text-gray-500 mt-3">Humidity</p>
          <h3 className="font-bold">68%</h3>
        </div>

        <div className="bg-green-50 rounded-2xl p-4">
          <Wind className="text-green-600"/>
          <p className="text-gray-500 mt-3">Wind</p>
          <h3 className="font-bold">8 km/h</h3>
        </div>

        <div className="bg-green-50 rounded-2xl p-4">
          <Thermometer className="text-red-500"/>
          <p className="text-gray-500 mt-3">Feels Like</p>
          <h3 className="font-bold">30°C</h3>
        </div>

      </div>

      <h3 className="font-bold text-xl mb-4">
        5-Day Forecast
      </h3>

      <div className="space-y-3">

        {days.map((item,index)=>{

          const Icon=item.icon;

          return(

            <div
              key={index}
              className="border rounded-xl px-5 py-3 flex justify-between items-center"
            >

              <div className="flex items-center gap-4">
                <Icon className="text-yellow-500"/>
                <span>{item.day}</span>
              </div>

              <span className="font-bold">
                {item.temp}
              </span>

            </div>

          )

        })}

      </div>

    </div>
  );
}