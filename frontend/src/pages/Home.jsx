import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronDown,
  CloudRain,
  CloudSun,
  Database,
  Droplets,
  Gauge,
  Leaf,
  Mail,
  Menu,
  MessageSquare,
  Mountain,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Thermometer,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import cropLogo from "../assets/crop-logo.png";
import farmHeroVideo from "../assets/farm-hero.mp4";

/* =========================================================
   DATA
========================================================= */

const features = [
  {
    icon: Sprout,
    title: "AI Yield Prediction",
    description:
      "Predict expected crop yield using historical agricultural data, weather conditions, soil information, and crop-specific factors.",
  },
  {
    icon: CloudRain,
    title: "Weather Intelligence",
    description:
      "Understand rainfall, temperature, humidity, and other weather factors that can influence crop productivity.",
  },
  {
    icon: Mountain,
    title: "Soil Health Analysis",
    description:
      "Evaluate important soil characteristics and receive practical insights for healthier and more productive farming.",
  },
  {
    icon: BrainCircuit,
    title: "AI Recommendations",
    description:
      "Get intelligent recommendations based on your crop, farm conditions, soil health, and predicted yield.",
  },
  {
    icon: BarChart3,
    title: "Farm Analytics",
    description:
      "Turn agricultural data into simple visual insights that help farmers and consultants understand performance.",
  },
  {
    icon: UserCheck,
    title: "Expert Consultation",
    description:
      "Connect farmers with agricultural consultants for guidance, recommendations, and better decision-making.",
  },
];

const steps = [
  {
    number: "01",
    icon: Database,
    title: "Enter Farm Details",
    description:
      "Provide your crop, location, soil, farm size, and other relevant agricultural information.",
  },
  {
    number: "02",
    icon: CloudSun,
    title: "Analyze Conditions",
    description:
      "YieldSense AI processes historical data, weather information, soil conditions, and crop-related factors.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "AI Predicts & Analyzes",
    description:
      "Our machine learning system generates a yield prediction and analyzes the factors affecting productivity.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Improve Your Yield",
    description:
      "Use AI recommendations and expert consultation to make smarter farming decisions.",
  },
];

const benefits = [
  "Data-driven crop yield prediction",
  "Weather and environmental insights",
  "Soil health assessment",
  "AI-powered farming recommendations",
  "Historical prediction tracking",
  "Easy-to-understand analytics",
  "Farmer and consultant collaboration",
  "Centralized agricultural information",
];

const analyticsData = [
  {
    year: "2018",
    rainfall: 620,
    yield: 3.2,
  },
  {
    year: "2019",
    rainfall: 680,
    yield: 3.5,
  },
  {
    year: "2020",
    rainfall: 640,
    yield: 3.7,
  },
  {
    year: "2021",
    rainfall: 720,
    yield: 4.0,
  },
  {
    year: "2022",
    rainfall: 760,
    yield: 4.2,
  },
  {
    year: "2023",
    rainfall: 710,
    yield: 4.5,
  },
  {
    year: "2024",
    rainfall: 790,
    yield: 4.8,
  },
];

const predictionData = [
  { year: "2019", value: 3.1 },
  { year: "2020", value: 3.4 },
  { year: "2021", value: 3.8 },
  { year: "2022", value: 4.0 },
  { year: "2023", value: 4.4 },
  { year: "2024", value: 4.8 },
];

/* =========================================================
   HOME COMPONENT
========================================================= */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  /* =======================================================
     SCROLL / ACTIVE SECTION
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = [
        "hero",
        "features",
        "how-it-works",
        "benefits",
        "analytics",
        "contact",
      ];

      let current = "hero";

      sections.forEach((id) => {
        const section = document.getElementById(id);

        if (section) {
          const rect = section.getBoundingClientRect();

          if (rect.top <= 180) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =======================================================
     SMOOTH SCROLL
  ======================================================= */

  const scrollToSection = (id) => {
    setMenuOpen(false);

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =======================================================
     NAV LINK
  ======================================================= */

  const navLinks = [
    {
      label: "Features",
      id: "features",
    },
    {
      label: "How It Works",
      id: "how-it-works",
    },
    {
      label: "Benefits",
      id: "benefits",
    },
    {
      label: "Analytics",
      id: "analytics",
    },
    {
      label: "Contact",
      id: "contact",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-green-100 bg-white/95 shadow-lg backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* LOGO */}

          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl ${
                scrolled
                  ? "bg-green-100"
                  : "bg-white/15 backdrop-blur-md"
              }`}
            >
              <img
                src={cropLogo}
                alt="YieldSense AI"
                className="h-9 w-9 object-contain"
              />
            </div>

            <div className="text-left">
              <div
                className={`text-lg font-extrabold tracking-tight ${
                  scrolled ? "text-green-900" : "text-white"
                }`}
              >
                YieldSense <span className="text-green-500">AI</span>
              </div>

              <div
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                  scrolled ? "text-green-700" : "text-green-100"
                }`}
              >
                Smart Agriculture
              </div>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? scrolled
                        ? "bg-green-100 text-green-800"
                        : "bg-white/15 text-white"
                      : scrolled
                      ? "text-gray-700 hover:bg-green-50 hover:text-green-700"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* DESKTOP ACTIONS */}

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                scrolled
                  ? "text-green-800 hover:bg-green-50"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-all hover:bg-green-500 hover:shadow-xl"
            >
              Get Started
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`rounded-xl p-2 lg:hidden ${
              scrolled
                ? "text-green-800 hover:bg-green-50"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {/* MOBILE MENU */}

        {menuOpen && (
          <div className="border-t border-green-100 bg-white px-5 py-5 shadow-xl lg:hidden">
            <div className="mx-auto max-w-7xl space-y-1">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                >
                  {item.label}
                  <ArrowUpRight size={16} />
                </button>
              ))}

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-green-200 px-4 py-3 text-center text-sm font-bold text-green-800"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        id="hero"
        className="relative min-h-[760px] overflow-hidden bg-green-950 sm:min-h-screen"
      >
        {/* BACKGROUND VIDEO */}

        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={farmHeroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />

        {/* DARK GREEN OVERLAY */}

        <div className="absolute inset-0 bg-black/25" />
        {/* LEFT GREEN GRADIENT */}

        <div className="absolute inset-0 bg-green-950/10" />

        {/* BOTTOM GRADIENT */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

        {/* HERO CONTENT */}

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center px-5 pb-20 pt-32 sm:min-h-screen sm:px-8 lg:px-10">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* LEFT */}

            <div className="max-w-3xl">
              {/* BADGE */}

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-green-300/30 bg-green-950/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-green-100 backdrop-blur-md">
                <Sparkles size={15} className="text-green-300" />
                AI-Powered Smart Agriculture
              </div>

              {/* HEADING */}

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Smart Farming.
                <br />
                <span className="text-green-400">Better Predictions.</span>
                <br />
                Higher Yields.
              </h1>

              {/* DESCRIPTION */}

              <p className="mt-7 max-w-2xl text-base leading-7 text-green-50/85 sm:text-lg sm:leading-8">
                YieldSense AI combines machine learning, weather intelligence,
                soil analysis, and agricultural data to help farmers make
                smarter decisions and improve crop productivity.
              </p>

              {/* BUTTONS */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-green-950/30 transition hover:bg-green-400"
                >
                  Start Farming Smarter
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white backdrop-blur-md transition hover:bg-white/15"
                >
                  See How It Works
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* TRUST ROW */}

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-green-100/80">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  AI-powered insights
                </div>

                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  Farmer focused
                </div>

                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  Data driven
                </div>
              </div>
            </div>

            {/* RIGHT PREDICTION CARD */}

            <div className="hidden lg:block">
              <div className="relative mx-auto max-w-md">
                {/* GLOW */}

                <div className="absolute -inset-6 rounded-[2rem] bg-green-500/20 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
                  {/* CARD HEADER */}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-green-600">
                        AI Prediction
                      </div>

                      <h3 className="mt-1 text-xl font-extrabold text-green-950">
                        Crop Yield Forecast
                      </h3>
                    </div>

                    <div className="rounded-xl bg-green-100 p-3 text-green-700">
                      <Sprout size={22} />
                    </div>
                  </div>

                  {/* MAIN PREDICTION */}

                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs font-semibold text-green-700">
                          Predicted Yield
                        </div>

                        <div className="mt-1 text-4xl font-black text-green-950">
                          4.8
                          <span className="ml-1 text-base font-bold text-green-700">
                            T/Ha
                          </span>
                        </div>
                      </div>

                      <div className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                        92% confidence
                      </div>
                    </div>
                  </div>

                  {/* GRAPH */}

                  <div className="mt-5 h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={predictionData}>
                        <defs>
                          <linearGradient
                            id="heroPredictionGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#16a34a"
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="100%"
                              stopColor="#16a34a"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>

                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          hide
                          domain={["dataMin - 0.3", "dataMax + 0.3"]}
                        />

                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #dcfce7",
                            fontSize: "12px",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#16a34a"
                          strokeWidth={3}
                          fill="url(#heroPredictionGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* WEATHER */}

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CloudRain size={13} />
                        Rainfall
                      </div>

                      <div className="mt-1 font-bold text-green-950">
                        680mm
                      </div>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Thermometer size={13} />
                        Temp
                      </div>

                      <div className="mt-1 font-bold text-green-950">
                        28°C
                      </div>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Droplets size={13} />
                        Soil
                      </div>

                      <div className="mt-1 font-bold text-green-950">
                        6.8 pH
                      </div>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

                      <span className="text-xs font-bold text-green-800">
                        Prediction Ready
                      </span>
                    </div>

                    <Gauge size={17} className="text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO BOTTOM STATS */}

        <div className="absolute bottom-0 left-0 right-0 z-10 hidden border-t border-white/10 bg-green-950/40 backdrop-blur-md md:block">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/10 px-8 lg:px-10">
            <div className="px-8 py-5">
              <div className="text-2xl font-black text-white">
                2,400+
              </div>
              <div className="text-xs font-semibold text-green-100/70">
                Farm Records
              </div>
            </div>

            <div className="px-8 py-5">
              <div className="text-2xl font-black text-white">
                98.57%
              </div>
              <div className="text-xs font-semibold text-green-100/70">
                Prediction Accuracy
              </div>
            </div>

            <div className="px-8 py-5">
              <div className="text-2xl font-black text-white">
                18+
              </div>
              <div className="text-xs font-semibold text-green-100/70">
                Supported Crops
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="scroll-mt-20 bg-white py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* HEADING */}

          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
              <Leaf size={15} />
              Powerful Features
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-green-950 sm:text-5xl">
              Everything you need for{" "}
              <span className="text-green-600">
                smarter farming
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
              YieldSense AI brings together agricultural intelligence,
              machine learning, weather data, and expert support in one
              simple platform.
            </p>
          </div>

          {/* FEATURE GRID */}

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-green-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5"
                >
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-green-100 text-green-700 transition group-hover:bg-green-600 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-green-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-green-700">
                    Learn more
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="scroll-mt-20 bg-green-50 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            {/* LEFT */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
                <Zap size={15} />
                Simple Process
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-green-950 sm:text-5xl">
                From farm data to{" "}
                <span className="text-green-600">
                  better decisions
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
                You don't need to be a data scientist. YieldSense AI converts
                complex agricultural information into simple, useful insights.
              </p>

              <Link
                to="/register"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-green-900/15 transition hover:bg-green-600"
              >
                Try YieldSense AI
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* STEPS */}

            <div className="space-y-4">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="group flex gap-5 rounded-3xl border border-green-100 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-700 text-white shadow-lg shadow-green-900/10">
                      <Icon size={23} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-black tracking-widest text-green-500">
                          {step.number}
                        </span>

                        <h3 className="text-lg font-extrabold text-green-950">
                          {step.title}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BENEFITS
      ===================================================== */}

      <section
        id="benefits"
        className="scroll-mt-20 bg-white py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* LEFT VISUAL */}

            <div className="relative">
              <div className="absolute -inset-8 rounded-[3rem] bg-green-100/70 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-950 via-green-800 to-green-600 p-7 shadow-2xl sm:p-9">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-green-400/20 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-green-300">
                        Smart Agriculture
                      </div>

                      <h3 className="mt-2 text-2xl font-black text-white">
                        Your farm, understood by AI.
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-3 text-green-200 backdrop-blur">
                      <BrainCircuit size={25} />
                    </div>
                  </div>

                  {/* MINI METRICS */}

                  <div className="mt-9 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                      <div className="text-sm text-green-100/70">
                        Yield Forecast
                      </div>

                      <div className="mt-2 text-3xl font-black text-white">
                        4.8
                      </div>

                      <div className="mt-1 text-xs font-semibold text-green-300">
                        T/Ha
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                      <div className="text-sm text-green-100/70">
                        Confidence
                      </div>

                      <div className="mt-2 text-3xl font-black text-white">
                        92%
                      </div>

                      <div className="mt-1 text-xs font-semibold text-green-300">
                        High confidence
                      </div>
                    </div>
                  </div>

                  {/* PROGRESS */}

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        Farm Productivity
                      </span>

                      <span className="text-sm font-bold text-green-300">
                        86%
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[86%] rounded-full bg-green-400" />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3 text-sm text-green-100/80">
                    <ShieldCheck
                      size={18}
                      className="text-green-300"
                    />

                    Intelligent insights for better decisions
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
                <Target size={15} />
                Why YieldSense AI
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-green-950 sm:text-5xl">
                Make every farming decision{" "}
                <span className="text-green-600">
                  count
                </span>
              </h2>

              <p className="mt-5 text-base leading-7 text-gray-600">
                Agriculture depends on many interconnected factors. YieldSense
                AI brings those factors together so you can understand what is
                happening on your farm and plan with greater confidence.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50/60 p-4"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>

                    <span className="text-sm font-semibold leading-5 text-green-950">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <section
        id="analytics"
        className="scroll-mt-20 bg-green-950 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* HEADING */}

          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-900 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-green-300">
                <BarChart3 size={15} />
                Agricultural Analytics
              </div>

              <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                See the relationship between{" "}
                <span className="text-green-400">
                  weather and yield
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-green-100/70">
                Visualize historical agricultural trends and understand how
                environmental factors can influence crop productivity.
              </p>
            </div>

            <div className="rounded-2xl border border-green-700 bg-green-900/60 px-5 py-4">
              <div className="text-xs font-bold uppercase tracking-widest text-green-300">
                Latest Forecast
              </div>

              <div className="mt-1 text-3xl font-black text-white">
                4.8 T/Ha
              </div>

              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-green-300">
                <TrendingUp size={13} />
                Positive trend
              </div>
            </div>
          </div>

          {/* CHART */}

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-green-800 bg-green-900/50 p-5 sm:p-7">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-white">
                  Rainfall vs. Average Yield
                </h3>

                <p className="mt-1 text-xs text-green-200/60">
                  Historical trend preview
                </p>
              </div>

              <div className="flex gap-5 text-xs font-semibold">
                <div className="flex items-center gap-2 text-green-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  Yield
                </div>

                <div className="flex items-center gap-2 text-green-100/60">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-200/40" />
                  Rainfall
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#166534"
                  />

                  <XAxis
                    dataKey="year"
                    stroke="#bbf7d0"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    yAxisId="left"
                    stroke="#bbf7d0"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#86efac"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#052e16",
                      border: "1px solid #166534",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="yield"
                    stroke="#4ade80"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rainfall"
                    stroke="#bbf7d0"
                    strokeWidth={2}
                    strokeDasharray="6 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ANALYTICS CARDS */}

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-green-800 bg-green-900/50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-800 p-2.5 text-green-300">
                  <CloudRain size={20} />
                </div>

                <div>
                  <div className="text-xs text-green-100/50">
                    Average Rainfall
                  </div>

                  <div className="mt-1 text-xl font-black text-white">
                    704 mm
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-green-800 bg-green-900/50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-800 p-2.5 text-green-300">
                  <Sprout size={20} />
                </div>

                <div>
                  <div className="text-xs text-green-100/50">
                    Average Yield
                  </div>

                  <div className="mt-1 text-xl font-black text-white">
                    3.9 T/Ha
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-green-800 bg-green-900/50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-800 p-2.5 text-green-300">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <div className="text-xs text-green-100/50">
                    Growth Trend
                  </div>

                  <div className="mt-1 text-xl font-black text-white">
                    +12.4%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        id="contact"
        className="scroll-mt-20 bg-white py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* HEADING */}

          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
              <Mail size={15} />
              Contact YieldSense AI
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-green-950 sm:text-5xl">
              We're here to{" "}
              <span className="text-green-600">
                help you grow.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
              Have a question, complaint, technical issue, suggestion, or
              anything else you would like to share? Reach out to the
              YieldSense AI team.
            </p>
          </div>

          {/* CONTACT GRID */}

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            {/* INFO */}

            <div className="space-y-4">
              {/* EMAIL */}

              <div className="rounded-3xl border border-green-100 bg-green-50 p-6 transition hover:border-green-200 hover:shadow-lg">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <Mail size={22} />
                  </div>

                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-widest text-green-600">
                      Official Email
                    </div>

                    <a
                      href="mailto:yieldsenseai@gmail.com"
                      className="mt-1 block text-lg font-extrabold text-green-950 hover:text-green-600"
                    >
                      yieldsenseai@gmail.com
                    </a>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Contact us for general enquiries, questions, or
                      information about YieldSense AI.
                    </p>
                  </div>
                </div>
              </div>

              {/* FEEDBACK */}

              <div className="rounded-3xl border border-green-100 bg-white p-6 transition hover:border-green-200 hover:shadow-lg">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <MessageSquare size={22} />
                  </div>

                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-widest text-green-600">
                      Complaints & Feedback
                    </div>

                    <a
                      href="mailto:yieldsenseai@gmail.com?subject=YieldSense%20AI%20Complaint%20or%20Feedback"
                      className="mt-1 block text-lg font-extrabold text-green-950 hover:text-green-600"
                    >
                      Send us your feedback
                    </a>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Tell us about your experience, suggestions, complaints,
                      or ideas for improving the platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* SUPPORT */}

              <div className="rounded-3xl border border-green-100 bg-white p-6 transition hover:border-green-200 hover:shadow-lg">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-widest text-green-600">
                      Platform Support
                    </div>

                    <a
                      href="mailto:yieldsenseai@gmail.com?subject=YieldSense%20AI%20Technical%20Support"
                      className="mt-1 block text-lg font-extrabold text-green-950 hover:text-green-600"
                    >
                      Get technical support
                    </a>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Facing a technical issue? Send us the details and our
                      team can look into it.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION CARD */}

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-950 via-green-800 to-green-600 p-8 shadow-2xl sm:p-10">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-green-400/20 blur-3xl" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-green-300 backdrop-blur">
                  <Mail size={25} />
                </div>

                <h3 className="mt-7 text-2xl font-black text-white sm:text-3xl">
                  Have something to tell us?
                </h3>

                <p className="mt-4 text-sm leading-7 text-green-100/75">
                  Whether you are a farmer, agricultural consultant, student,
                  researcher, or simply interested in smart agriculture, we
                  would love to hear from you.
                </p>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-widest text-green-300">
                    Email us directly
                  </div>

                  <div className="mt-1 break-all text-base font-bold text-white">
                    yieldsenseai@gmail.com
                  </div>
                </div>

                <a
                  href="mailto:yieldsenseai@gmail.com?subject=YieldSense%20AI%20Enquiry"
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-green-900 transition hover:bg-green-50"
                >
                  <Mail size={18} />
                  Email YieldSense AI
                </a>

                <div className="mt-4 text-center text-xs text-green-100/55">
                  We appreciate your questions, feedback, and suggestions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-green-50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-green-950 to-green-700 px-7 py-14 text-center shadow-2xl sm:px-12 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/20 text-green-300">
            <Sprout size={28} />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Ready to farm smarter?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-green-100/75 sm:text-lg">
            Start using data, AI, and agricultural intelligence to make better
            decisions for your farm.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-7 py-3.5 text-sm font-extrabold text-white transition hover:bg-green-400"
            >
              Get Started Free
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-7 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/15"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-green-950 text-green-100">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            {/* BRAND */}

            <div>
              <button
                onClick={() => scrollToSection("hero")}
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white/10">
                  <img
                    src={cropLogo}
                    alt="YieldSense AI"
                    className="h-9 w-9 object-contain"
                  />
                </div>

                <div className="text-left">
                  <div className="text-lg font-extrabold text-white">
                    YieldSense{" "}
                    <span className="text-green-400">AI</span>
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-300">
                    Smart Agriculture
                  </div>
                </div>
              </button>

              <p className="mt-5 max-w-sm text-sm leading-6 text-green-100/55">
                AI-powered agricultural intelligence designed to help farmers
                and consultants make smarter, data-driven decisions.
              </p>

              <a
                href="mailto:yieldsenseai@gmail.com"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-300 transition hover:text-green-200"
              >
                <Mail size={16} />
                yieldsenseai@gmail.com
              </a>
            </div>

            {/* PRODUCT */}

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
                Product
              </h3>

              <div className="mt-5 space-y-3">
                <button
                  onClick={() => scrollToSection("features")}
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  Features
                </button>

                <button
                  onClick={() => scrollToSection("analytics")}
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  Analytics
                </button>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  How It Works
                </button>

                <Link
                  to="/register"
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* COMPANY */}

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
                Company
              </h3>

              <div className="mt-5 space-y-3">
                <button
                  onClick={() => scrollToSection("benefits")}
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  About YieldSense
                </button>

                <button
                  onClick={() => scrollToSection("contact")}
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  Contact Us
                </button>

                <a
                  href="mailto:yieldsenseai@gmail.com?subject=YieldSense%20AI%20Career%20Enquiry"
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  Careers
                </a>

                <a
                  href="mailto:yieldsenseai@gmail.com?subject=YieldSense%20AI%20General%20Enquiry"
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  General Enquiry
                </a>
              </div>
            </div>

            {/* SUPPORT */}

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
                Support
              </h3>

              <div className="mt-5 space-y-3">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  Help Center
                </button>

                <a
                  href="mailto:yieldsenseai@gmail.com?subject=YieldSense%20AI%20Technical%20Support"
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  Technical Support
                </a>

                <a
                  href="mailto:yieldsenseai@gmail.com?subject=YieldSense%20AI%20Privacy%20Enquiry"
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  Privacy Questions
                </a>

                <a
                  href="mailto:yieldsenseai@gmail.com?subject=YieldSense%20AI%20Terms%20Enquiry"
                  className="block text-sm text-green-100/55 transition hover:text-green-300"
                >
                  Terms Questions
                </a>
              </div>
            </div>
          </div>

          {/* FOOTER BOTTOM */}

          <div className="mt-12 flex flex-col gap-4 border-t border-green-800 pt-7 text-xs text-green-100/40 sm:flex-row sm:items-center sm:justify-between">
            <div>
              © {new Date().getFullYear()} YieldSense AI. All rights reserved.
            </div>

            <div className="flex items-center gap-2">
              <Leaf size={14} className="text-green-500" />
              Building a smarter agricultural future.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}