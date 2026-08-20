import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  ArrowRight,
  Check,
  Target,
  CloudRain,
  Gauge,
  Sprout,
  BarChart3,
  Users,
  FileText,
  Zap,
  TrendingUp,
  MapPin,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import cropLogo from "../assets/crop-logo.png";
import farmHero from "../assets/farm-hero.png";

export default function Home() {
  const navigate = useNavigate();
  const [scrolledToFeatures, setScrolledToFeatures] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    const featuresSection = document.getElementById("features");

    if (!featuresSection) return;

    const featuresTop = featuresSection.getBoundingClientRect().top;

    setScrolledToFeatures(featuresTop <= 70);
  };

  window.addEventListener("scroll", handleScroll);

  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  return (
    <div className="min-h-screen bg-[#f5faf6] text-[#064e2f]">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <nav
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    scrolledToFeatures
      ? "bg-white shadow-md"
      : "bg-[#064e3b]"
  }`}
>
  <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[70px] flex items-center justify-between">

{/* Logo */}
<Link to="/home" className="flex items-center gap-3">
  <div
    className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-md ${
      scrolledToFeatures
        ? "bg-green-700"
        : "bg-green-600"
    }`}
  >
    <img
      src={cropLogo}
      alt="YieldSense AI Logo"
      className="w-8 h-8 object-contain rounded-full"
    />
  </div>

  <span
    className={`text-xl font-bold transition-colors duration-500 ${
      scrolledToFeatures
        ? "text-green-800"
        : "text-white"
    }`}
  >
    YieldSense <span className="text-lime-400">AI</span>
  </span>
</Link>


    {/* CENTER NAVIGATION */}
    <div className="hidden md:flex items-center gap-9">

      <a
        href="#features"
        className={`font-medium transition-colors duration-500 ${
          scrolledToFeatures
            ? "text-green-700 hover:text-green-900"
            : "text-white hover:text-lime-300"
        }`}
      >
        Features
      </a>

      <a
        href="#how-it-works"
        className={`font-medium transition-colors duration-500 ${
          scrolledToFeatures
            ? "text-green-700 hover:text-green-900"
            : "text-white hover:text-lime-300"
        }`}
      >
        How It Works
      </a>

      <a
        href="#benefits"
        className={`font-medium transition-colors duration-500 ${
          scrolledToFeatures
            ? "text-green-700 hover:text-green-900"
            : "text-white hover:text-lime-300"
        }`}
      >
        Benefits
      </a>

      <a
        href="#analytics"
        className={`font-medium transition-colors duration-500 ${
          scrolledToFeatures
            ? "text-green-700 hover:text-green-900"
            : "text-white hover:text-lime-300"
        }`}
      >
        Analytics
      </a>

    </div>


    {/* RIGHT SIDE */}
    <div className="flex items-center gap-6">

      <Link
        to="/login"
        className={`font-semibold transition-colors duration-500 ${
          scrolledToFeatures
            ? "text-green-800 hover:text-green-600"
            : "text-white hover:text-lime-300"
        }`}
      >
        Login
      </Link>

      <Link
        to="/register"
        className="bg-lime-400 hover:bg-lime-300 text-green-950 font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg"
      >
        Get Started
      </Link>

    </div>

  </div>
</nav>


      {/* ================= HERO SECTION ================= */}
<section className="relative min-h-[760px] overflow-hidden">

  {/* Farm Background */}
  <img
    src={farmHero}
    alt="Smart Agriculture"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark green image overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#034d35]/95 via-[#075c3c]/75 to-[#0b633f]/55" />

  {/* Left-to-right green gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#063f2d]/95 via-[#0b5c3d]/60 to-transparent" />

  {/* Soft green glow */}
  <div className="absolute -top-40 left-1/3 w-[700px] h-[500px] rounded-full bg-green-400/10 blur-[120px]" />

  {/* Bottom fade */}
  <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#f4faf5] via-[#f4faf5]/80 to-transparent" />

  {/* Hero Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-10 pt-32 pb-40">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* ================= LEFT CONTENT ================= */}
      <div className="text-white">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-lime-400/40 bg-lime-400/10 backdrop-blur-md text-lime-300 text-sm font-semibold mb-8">

          <Zap size={16} />

          AI-POWERED AGRICULTURE PLATFORM

        </div>


        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-[64px] font-serif font-bold leading-[1.08] tracking-tight">

          Smart Farming.
          <br />

          <span className="text-lime-400">
            Better Predictions.
          </span>

          <br />

          Higher Yields.

        </h1>


        {/* Description */}
        <p className="mt-7 max-w-xl text-lg md:text-xl leading-8 text-green-100">

          Harness the power of machine learning and real-time data to predict
          crop yields with precision, optimize resources, and transform your
          agricultural productivity.

        </p>


        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-9">

          <Link
            to="/register"
            className="group flex items-center gap-2 px-7 py-4 rounded-xl bg-lime-400 hover:bg-lime-300 text-green-950 font-bold shadow-xl shadow-lime-500/20 transition-all duration-300"
          >

            Get Started Free

            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition"
            />

          </Link>


          <Link
            to="/login"
            className="flex items-center gap-2 px-7 py-4 rounded-xl border border-white/40 hover:bg-white/10 backdrop-blur-md text-white font-semibold transition-all duration-300"
          >

            <span>↪</span>

            Login to Dashboard

          </Link>

        </div>


        {/* Stats */}
        <div className="flex flex-wrap gap-12 mt-12">

          <div>
            <div className="text-2xl font-bold">
              2,400+
            </div>

            <div className="text-sm text-green-300">
              Active Farmers
            </div>
          </div>


          <div>
            <div className="text-2xl font-bold">
              98.57%
            </div>

            <div className="text-sm text-green-300">
              Prediction Accuracy
            </div>
          </div>


          <div>
            <div className="text-2xl font-bold">
              18
            </div>

            <div className="text-sm text-green-300">
              States Covered
            </div>
          </div>

        </div>

      </div>


      {/* ================= RIGHT PREDICTION CARD ================= */}
      <div className="relative">

        {/* Glow behind card */}
        <div className="absolute inset-0 bg-lime-400/10 blur-3xl rounded-full" />

        <div className="relative rounded-[28px] border border-white/25 bg-white/10 backdrop-blur-xl shadow-2xl p-7">

          {/* Card Header */}
          <div className="flex justify-between items-start">

            <div>

              <p className="text-xs font-semibold text-lime-300 tracking-wide">
                PREDICTED YIELD
              </p>

              <h2 className="text-4xl font-bold text-white mt-1">
                4.8 T/Ha
              </h2>

            </div>


            <div className="px-4 py-2 rounded-full bg-lime-400/15 border border-lime-400/40 text-lime-300 text-sm font-semibold">

              ↗ 92% confidence

            </div>

          </div>


          {/* Graph */}
          <div className="mt-8 h-40 relative">

            <svg
              viewBox="0 0 600 160"
              className="w-full h-full"
              preserveAspectRatio="none"
            >

              <defs>

                <linearGradient
                  id="yieldGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#a3e635"
                    stopOpacity="0.45"
                  />

                  <stop
                    offset="100%"
                    stopColor="#a3e635"
                    stopOpacity="0"
                  />

                </linearGradient>

              </defs>


              {/* Area */}
              <path
                d="M0 100
                   C80 95 100 90 150 100
                   C210 115 230 105 280 90
                   C340 70 390 78 430 82
                   C480 88 520 70 600 65
                   L600 160
                   L0 160 Z"
                fill="url(#yieldGradient)"
              />


              {/* Line */}
              <path
                d="M0 100
                   C80 95 100 90 150 100
                   C210 115 230 105 280 90
                   C340 70 390 78 430 82
                   C480 88 520 70 600 65"
                fill="none"
                stroke="#a3e635"
                strokeWidth="4"
              />

            </svg>


            {/* Years */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-green-200">

              <span>2019</span>
              <span>2020</span>
              <span>2021</span>
              <span>2022</span>
              <span>2023</span>
              <span>2024</span>

            </div>

          </div>


          {/* Weather Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-7">

            <div className="rounded-2xl bg-white/10 border border-white/10 p-4 text-center">

              <CloudRain
                size={19}
                className="mx-auto text-lime-300 mb-2"
              />

              <p className="text-xs text-green-200">
                Rainfall
              </p>

              <p className="text-white font-bold">
                680mm
              </p>

            </div>


            <div className="rounded-2xl bg-white/10 border border-white/10 p-4 text-center">

              <span className="text-lime-300 text-lg">
                ♨
              </span>

              <p className="text-xs text-green-200">
                Temperature
              </p>

              <p className="text-white font-bold">
                28°C
              </p>

            </div>


            <div className="rounded-2xl bg-white/10 border border-white/10 p-4 text-center">

              <Gauge
                size={19}
                className="mx-auto text-lime-300 mb-2"
              />

              <p className="text-xs text-green-200">
                Soil pH
              </p>

              <p className="text-white font-bold">
                6.8
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

      {/* =====================================================
          FEATURES
      ====================================================== */}
      <section
       id="features"
       className="bg-[#f5faf5] py-24"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto">

            <span className="inline-flex px-4 py-2 rounded-full bg-lime-100 text-green-700 text-sm font-semibold">
              ✦ CORE FEATURES
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold mt-5">
              Everything You Need to{" "}
              <span className="text-green-700">
                Farm Smarter
              </span>
            </h2>

            <p className="mt-5 text-green-600 text-lg">
              From AI predictions to real-time weather alerts,
              we give farmers the intelligence to maximize productivity.
            </p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">

            <FeatureCard
              icon={<Target />}
              title="AI Yield Prediction"
              text="Machine learning models analyze agricultural data to predict crop yields and support better farming decisions."
              color="bg-green-600"
            />

            <FeatureCard
              icon={<CloudRain />}
              title="Real-time Weather"
              text="Access current weather information and forecasts to plan irrigation, harvesting and crop protection."
              color="bg-blue-600"
            />

            <FeatureCard
              icon={<Gauge />}
              title="Soil Health Analysis"
              text="Monitor soil characteristics and environmental factors to understand growing conditions."
              color="bg-orange-500"
            />

            <FeatureCard
              icon={<Sprout />}
              title="Crop Recommendations"
              text="Get intelligent crop recommendations based on soil, climate and agricultural conditions."
              color="bg-lime-600"
            />

            <FeatureCard
              icon={<BarChart3 />}
              title="Analytics Dashboard"
              text="Visualize yield trends, compare crops and analyze agricultural data through interactive charts."
              color="bg-purple-600"
            />

            <FeatureCard
              icon={<Users />}
              title="Expert Consultants"
              text="Connect farmers with agricultural consultants for expert guidance and recommendations."
              color="bg-pink-600"
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section
        id="how-it-works"
        className="py-24 bg-white"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center">

            <span className="inline-flex px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              ✓ HOW IT WORKS
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold mt-5">
              Get Predictions in{" "}
              <span className="text-green-700">
                3 Simple Steps
              </span>
            </h2>

            <p className="text-green-600 mt-4 text-lg">
              No complex setup required. Start predicting yields in minutes.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-12 mt-20">

            <Step
              number="01"
              icon={<FileText />}
              title="Enter Farm Details"
              text="Provide basic information about your farm, location, crop type, soil data and seasonal conditions."
            />

            <Step
              number="02"
              icon={<Zap />}
              title="AI Analysis"
              text="Our machine learning model processes your agricultural data along with weather patterns and historical information."
            />

            <Step
              number="03"
              icon={<TrendingUp />}
              title="Get Insights"
              text="Receive yield predictions, crop recommendations and actionable insights for your farm."
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          FARMER BENEFITS
      ====================================================== */}
      <section
        id="benefits"
        className="py-24 bg-[#043d24] text-white"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>

              <span className="inline-flex px-4 py-2 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-300 text-sm font-semibold">
                ♙ FARMER BENEFITS
              </span>

              <h2 className="text-4xl lg:text-5xl font-bold mt-6 leading-tight">
                Designed for Every Farmer,{" "}
                <span className="text-lime-400">
                  Big or Small
                </span>
              </h2>

              <p className="mt-6 text-green-200 text-lg leading-relaxed">
                Whether you manage 2 acres or 500, YieldSense AI
                adapts to your needs and helps you make better farming
                decisions every day.
              </p>

              <div className="mt-8 space-y-5">

                {[
                  "Reduce crop loss with early yield warnings",
                  "Save water with precision irrigation recommendations",
                  "Increase income by selecting suitable crops",
                  "Get alerts for weather and soil conditions",
                  "Access expert agricultural consultant advice",
                  "Understand results through simple analytics",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center">
                      <Check
                        size={15}
                        className="text-lime-400"
                      />
                    </div>

                    <span className="text-green-100">
                      {item}
                    </span>
                  </div>
                ))}

              </div>

            </div>


            {/* Benefit Stats */}
            <div className="grid grid-cols-2 gap-5">

              <BenefitCard
                icon={<Target />}
                value="98.57%"
                label="Prediction Accuracy"
              />

              <BenefitCard
                icon={<TrendingUp />}
                value="₹24K"
                label="Average Saving/Year"
              />

              <BenefitCard
                icon={<MapPin />}
                value="18+"
                label="States Covered"
              />

              <BenefitCard
                icon={<Users />}
                value="2400+"
                label="Active Farmers"
              />

            </div>

          </div>

        </div>
      </section>


      {/* ================= ANALYTICS PREVIEW ================= */}
<section className="analytics-section" id="analytics">

  <div className="analytics-header">

    <span className="section-badge">
      <BarChart3 size={15} />
      ANALYTICS PREVIEW
    </span>

    <h2>
      Visualize Your Farm's <span>Performance</span>
    </h2>

    <p>
      Turn agricultural data into clear insights and make
      smarter decisions for every growing season.
    </p>

  </div>


  {/* KPI CARDS */}

  <div className="analytics-stats">

    <div className="analytics-stat-card">
      <div className="stat-icon">
        <TrendingUp size={21} />
      </div>

      <div>
        <span>Average Yield</span>
        <strong>4.2 T/Ha</strong>
        <small>↑ 8.4% this year</small>
      </div>
    </div>


    <div className="analytics-stat-card">
      <div className="stat-icon">
        <Target size={21} />
      </div>

      <div>
        <span>Best Yield</span>
        <strong>5.1 T/Ha</strong>
        <small>Maize · 2024</small>
      </div>
    </div>


    <div className="analytics-stat-card">
      <div className="stat-icon">
        <CloudRain size={21} />
      </div>

      <div>
        <span>Avg. Rainfall</span>
        <strong>680 mm</strong>
        <small>Optimal range</small>
      </div>
    </div>


    <div className="analytics-stat-card">
      <div className="stat-icon">
        <Gauge size={21} />
      </div>

      <div>
        <span>Prediction Accuracy</span>
        <strong>94%</strong>
        <small>AI model performance</small>
      </div>
    </div>

  </div>


  {/* CHARTS */}

  <div className="analytics-grid">

    {/* YIELD TREND */}

    <div className="analytics-card">

      <div className="chart-header">

        <div>
          <h3>Historical Yield Trend</h3>
          <p>Crop performance from 2018–2024</p>
        </div>

        <select defaultValue="all">
          <option value="all">All Crops</option>
          <option value="wheat">Wheat</option>
          <option value="rice">Rice</option>
          <option value="maize">Maize</option>
        </select>

      </div>


      <div className="chart-container">

        <ResponsiveContainer width="100%" height={300}>

          <AreaChart
            data={[
              { year: "2018", yield: 3.2 },
              { year: "2019", yield: 3.5 },
              { year: "2020", yield: 2.9 },
              { year: "2021", yield: 3.8 },
              { year: "2022", yield: 4.1 },
              { year: "2023", yield: 3.9 },
              { year: "2024", yield: 4.3 },
            ]}
          >

            <defs>

              <linearGradient
                id="yieldGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#84cc16"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#84cc16"
                  stopOpacity={0.02}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#dcefe1"
            />

            <XAxis
              dataKey="year"
              tick={{ fill: "#527060", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#527060", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 6]}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #d8eadc",
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
              }}
            />

            <Area
              type="monotone"
              dataKey="yield"
              stroke="#65a30d"
              strokeWidth={3}
              fill="url(#yieldGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      <div className="chart-footer">

        <span>
          <i className="legend-dot green"></i>
          Yield (Tonnes/Ha)
        </span>

        <span className="positive">
          ↑ 12.8% compared to 2018
        </span>

      </div>

    </div>


    {/* RAINFALL VS YIELD */}

    <div className="analytics-card">

      <div className="chart-header">

        <div>
          <h3>Rainfall vs Yield</h3>
          <p>Understanding weather impact on crops</p>
        </div>

        <span className="chart-pill">
          2024
        </span>

      </div>


      <div className="chart-container">

        <ResponsiveContainer width="100%" height={300}>

          <LineChart
            data={[
              { month: "Jan", rainfall: 20, yield: 1.1 },
              { month: "Feb", rainfall: 25, yield: 1.2 },
              { month: "Mar", rainfall: 48, yield: 1.8 },
              { month: "Apr", rainfall: 72, yield: 2.3 },
              { month: "May", rainfall: 110, yield: 3.1 },
              { month: "Jun", rainfall: 170, yield: 4.6 },
              { month: "Jul", rainfall: 235, yield: 7.1 },
              { month: "Aug", rainfall: 210, yield: 6.7 },
              { month: "Sep", rainfall: 160, yield: 5.2 },
              { month: "Oct", rainfall: 80, yield: 3.1 },
              { month: "Nov", rainfall: 40, yield: 1.8 },
              { month: "Dec", rainfall: 22, yield: 1.2 },
            ]}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#dcefe1"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#527060", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="left"
              tick={{ fill: "#527060", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#527060", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #d8eadc",
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
              }}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="rainfall"
              stroke="#22a06b"
              strokeWidth={3}
              dot={false}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="yield"
              stroke="#84cc16"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      <div className="chart-footer">

        <span>
          <i className="legend-dot green"></i>
          Rainfall (mm)
        </span>

        <span>
          <i className="legend-dot lime"></i>
          Yield (T/Ha)
        </span>

      </div>

    </div>

  </div>

</section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="py-20 bg-white">

        <div className="max-w-4xl mx-auto px-6">

          <div className="relative overflow-hidden bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-12 lg:p-16 text-center text-white shadow-2xl">

            {/* Decorative circle */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-green-500/20" />

            <Sprout
              size={42}
              className="mx-auto text-lime-400 relative"
            />

            <h2 className="text-4xl lg:text-5xl font-bold mt-7 relative">
              Ready to Grow Smarter?
            </h2>

            <p className="text-green-100 text-lg mt-5 max-w-2xl mx-auto relative">
              Join farmers using YieldSense AI to make
              smarter agricultural decisions.
            </p>

            <div className="flex justify-center flex-wrap gap-4 mt-9 relative">

              <Link
                to="/register"
                className="bg-lime-400 hover:bg-lime-500 text-green-950 font-bold px-8 py-4 rounded-xl transition"
              >
                Start Free Trial
              </Link>

              <Link
                to="/"
                className="border border-white/40 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition"
              >
                Login to Dashboard
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="bg-[#02351f] text-white">

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand */}
            <div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center overflow-hidden">
  <img
    src={cropLogo}
    alt="YieldSense Logo"
    className="w-8 h-8 object-contain"
  />
</div>

<span className="text-xl font-bold">
  YieldSense{" "}
  <span className="text-lime-400">
    AI
  </span>
</span>

              </div>

              <p className="text-green-300 mt-6 leading-relaxed max-w-xs">
                Smart crop yield prediction and agricultural
                productivity forecasting for modern farmers.
              </p>

            </div>


            {/* Product */}
            <div>

              <h3 className="font-bold text-lg mb-5">
                Product
              </h3>

              <div className="space-y-4 text-green-300">

                <a
                  href="#features"
                  className="block hover:text-lime-400 transition"
                >
                  Features
                </a>

                <a
                  href="#analytics"
                  className="block hover:text-lime-400 transition"
                >
                  Analytics
                </a>

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  Weather API
                </a>

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  Pricing
                </a>

              </div>

            </div>


            {/* Company */}
            <div>

              <h3 className="font-bold text-lg mb-5">
                Company
              </h3>

              <div className="space-y-4 text-green-300">

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  About Us
                </a>

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  Blog
                </a>

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  Careers
                </a>

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  Contact
                </a>

              </div>

            </div>


            {/* Support */}
            <div>

              <h3 className="font-bold text-lg mb-5">
                Support
              </h3>

              <div className="space-y-4 text-green-300">

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  Help Center
                </a>

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  Documentation
                </a>

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  Privacy Policy
                </a>

                <a
                  href="#"
                  className="block hover:text-lime-400 transition"
                >
                  Terms of Service
                </a>

              </div>

            </div>

          </div>


          {/* Footer Bottom */}
          <div className="border-t border-green-800 mt-12 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-green-400 text-sm">
              © 2026 YieldSense AI. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Leaf size={16} className="text-lime-400" />
              Built for Indian Agriculture
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({ icon, title, text, color }) {
  return (
    <div className="bg-white border border-green-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition duration-300">

      <div
        className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold mt-6 text-green-900">
        {title}
      </h3>

      <p className="text-green-600 mt-3 leading-relaxed">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   HOW IT WORKS STEP
========================================================= */

function Step({ number, icon, title, text }) {
  return (
    <div className="text-center relative">

      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-lime-500 text-white flex items-center justify-center shadow-lg">
        {icon}
      </div>

      <div className="text-lime-600 font-bold text-sm mt-5">
        {number}
      </div>

      <h3 className="text-2xl font-bold text-green-900 mt-2">
        {title}
      </h3>

      <p className="text-green-600 mt-4 leading-relaxed max-w-sm mx-auto">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   BENEFIT CARD
========================================================= */

function BenefitCard({ icon, value, label }) {
  return (
    <div className="rounded-2xl border border-lime-400/20 bg-green-900/60 backdrop-blur-md p-8 text-center">

      <div className="w-12 h-12 mx-auto rounded-full bg-lime-400/10 flex items-center justify-center">
        <span className="text-lime-400">
          {icon}
        </span>
      </div>

      <div className="text-4xl font-bold mt-5">
        {value}
      </div>

      <p className="text-green-300 mt-2">
        {label}
      </p>

    </div>
  );
}