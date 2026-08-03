import StatsCards from "./StatsCards";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-50 via-white to-green-50 shadow-lg ">

      <div className="grid lg:grid-cols-2 items-center min-h-[430px]">

        {/* LEFT */}

        <div className="relative z-10 p-10">

          <h1 className="text-5xl font-bold leading-tight">
            <span className="text-green-700">
              Welcome back,
            </span>

            <span className="text-gray-900">
              {" "}Admin! 👋
            </span>
          </h1>

          <p className="mt-4 text-lg text-gray-500 max-w-xl">
            Here's an overview of your YieldSense AI platform.
            Monitor users, crop predictions, weather analytics,
            and AI insights in one place.
          </p>

          <StatsCards />

        </div>

        {/* RIGHT */}

        <div className="relative h-full flex items-end justify-end">

          <img
            src="/images/admin_banner.jpg"
            alt=""
            className="h-[430px] w-auto object-contain"
          />

          {/* Fade Image into Background */}

          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-white"></div>

        </div>

      </div>

      {/* Decorative Glow */}

      <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-green-300/20 blur-3xl"></div>

      <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-yellow-200/30 blur-3xl"></div>

    </div>
  );
}