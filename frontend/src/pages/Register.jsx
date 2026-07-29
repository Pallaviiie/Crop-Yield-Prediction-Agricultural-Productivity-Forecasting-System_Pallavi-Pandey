import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import api from "../services/api";
import cropLogo from "../assets/crop-logo.png";
import farmHero from "../assets/farm-hero.png";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
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
      await api.post("/users/register", formData);

      alert("Registration Successful!");
      navigate("/");
    } catch (error) {
      alert("Registration Failed!");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Side */}
      <div className="hidden lg:flex w-3/5 relative overflow-hidden">

        <img
          src={farmHero}
          alt="Agriculture"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-950/70 to-green-700/20"></div>

        <div className="absolute bottom-16 left-14 text-white max-w-xl">

          <h1 className="text-6xl font-extrabold leading-tight">
            Join Smart
            <br />
            Farming
          </h1>

          <p className="mt-6 text-xl text-green-100">
            Create your account and start predicting crop yield using
            Artificial Intelligence.
          </p>

          <div className="mt-10 flex gap-4">

            <div className="bg-white/20 backdrop-blur-md rounded-xl px-5 py-3">
              🌾 AI Prediction
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-xl px-5 py-3">
              🌱 Better Harvest
            </div>

          </div>

        </div>

      </div>

      {/* Right Side */}
      <div className="w-full lg:w-2/5 bg-gradient-to-br from-green-50 via-lime-50 to-yellow-100 flex justify-center items-center">

        <div className="bg-white rounded-3xl shadow-2xl w-[430px] p-10">

          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-full bg-green-50 shadow-xl flex items-center justify-center border-4 border-green-100">
              <img
                 src={cropLogo}
                 alt="Crop Yield Logo"
                 className="w-20 h-20 object-contain"
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-green-800">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Start your smart farming journey today
          </p>

          <form onSubmit={handleSubmit}>

            <div className="flex items-center border rounded-xl px-4 py-2 mb-4">
              <User className="text-green-700" size={20} />
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                className="ml-3 w-full outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center border rounded-xl px-4 py-2 mb-4">
              <Mail className="text-green-700" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="ml-3 w-full outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center border rounded-xl px-4 py-2 mb-6">
              <Lock className="text-green-700" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                className="ml-3 w-full outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 text-white font-semibold transition duration-300 shadow-lg">
              Create Account
            </button>

          </form>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?

            <Link
              to="/"
              className="text-green-700 font-semibold ml-2 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}