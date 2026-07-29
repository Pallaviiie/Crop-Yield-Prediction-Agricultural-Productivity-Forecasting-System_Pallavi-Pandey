import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import api from "../services/api";
import cropLogo from "../assets/crop-logo.png";
import farmHero from "../assets/farm-hero.png";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/users/login", formData);

      localStorage.setItem("token", response.data.access_token);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex w-3/5 relative overflow-hidden">

        <img
          src={farmHero}
          alt="Agriculture"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-950/70 to-green-700/20"></div>

        <div className="absolute bottom-16 left-14 text-white max-w-xl">

          <h1 className="text-6xl font-extrabold leading-tight">
            Crop Yield
            <br />
            Prediction System
          </h1>

          <p className="mt-6 text-xl text-green-100">
            Empowering farmers with AI-driven crop yield prediction,
            weather insights and agricultural analytics.
          </p>

          <div className="mt-10 flex gap-4">

            <div className="bg-white/20 backdrop-blur-md rounded-xl px-5 py-3">
              🌾 Smart Farming
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-xl px-5 py-3">
              ☀️ AI Powered
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="w-full lg:w-2/5 bg-gradient-to-br from-green-50 via-lime-50 to-yellow-100 flex justify-center items-center">

        <div className="bg-white rounded-3xl shadow-2xl w-[430px] p-10">

          <div className="flex justify-center mb-6">
           <div className="w-28 h-28 rounded-full bg-green-50 shadow-xl border-4 border-green-100 flex items-center justify-center transition-transform duration-300 hover:scale-105">

            <img
               src={cropLogo}
               alt="Crop Yield Logo"
               className="w-20 h-20 object-contain"
            />

           </div>
         </div>

          <h2 className="text-3xl font-bold text-center text-green-800">

            Welcome Back

          </h2>

          <p className="text-center text-gray-500 mt-2 mb-8">

            Sign in to continue your farming journey

          </p>

          <form onSubmit={handleSubmit}>

            <div className="flex items-center border rounded-xl px-4 py-2 mb-5">

              <Mail className="text-green-700" size={20} />

              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="ml-3 w-full outline-none"
                required
              />

            </div>

            <div className="flex items-center border rounded-xl px-4 py-2 mb-6">

              <Lock className="text-green-700" size={20} />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="ml-3 w-full outline-none"
                required
              />

            </div>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-700 to-lime-600 hover:from-green-800 hover:to-green-700 text-white font-semibold transition">

              Login

            </button>

          </form>

          <p className="text-center mt-8">

            Don't have an account?

            <Link
              to="/register"
              className="text-green-700 font-semibold ml-2 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}