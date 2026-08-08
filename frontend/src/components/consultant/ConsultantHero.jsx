import ConsultantStats from "./ConsultantStats";

export default function ConsultantHero() {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

      <div className="grid grid-cols-12 min-h-[420px]">

        {/* Left */}

        <div className="col-span-7 p-10 flex flex-col justify-between">

          <div>

            <h1 className="text-5xl font-bold">

              <span className="text-green-700">
                Good Morning,
              </span>{" "}

              <span className="text-black">
                Agri Consultant 
              </span>

            </h1>

            <p className="text-gray-500 mt-4 text-lg">

              Monitor farmers, analyze crops and provide
              AI-powered recommendations for better yield.

            </p>

          </div>

          <ConsultantStats />

        </div>

        {/* Right */}

        <div className="col-span-5">

          <img
            src="/images/consultant-banner.jpg"
            alt="Consultant Banner"
            className="w-full h-full object-cover"
          />

        </div>

      </div>

    </div>
  );
}