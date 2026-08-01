import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../../services/api";
import cropLogo from "../../assets/crop-logo.png";
import farmHero from "../../assets/farm-hero.png";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("farmer");
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await api.post("/users/login", {
       ...formData,
       role,
     });

      localStorage.setItem("token", response.data.access_token);

      alert("Login Successful");

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "consultant") {
        navigate("/consultant-dashboard");
      } else {
        navigate("/dashboard");
      }
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
            {role === "farmer"
              ? "Farmer Login"
              : role === "consultant"
              ? "Agri Consultant Login"
              : "Administrator Login"}
          </h2>

          <p className="text-center text-gray-500 mt-2 mb-6">
           {role === "farmer"
             ? "Sign in to continue your farming journey."
             : role === "consultant"
             ? "Access crop advisory and farmer insights."
             : "Administrator access to manage the system."}
          </p>

          {/* Role Selection */}

         <div className="grid grid-cols-3 gap-3 mb-6">
           <button
             type="button"
             onClick={() => setRole("farmer")}
             className={`rounded-xl py-3 transition ${
             role === "farmer"
             ? "bg-green-600 text-white shadow-lg"
             : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
           >
            <div className="text-3xl">👨‍🌾</div>
            <div className="text-sm font-semibold mt-1">
              Farmer
            </div>
           </button>

           <button
             type="button"
             onClick={() => setRole("consultant")}
             className={`rounded-xl py-3 transition ${
             role === "consultant"
             ? "bg-green-600 text-white shadow-lg"
             : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
           >
            <div className="text-3xl">👨‍💼</div>
            <div className="text-sm font-semibold mt-1">
              Consultant
            </div>
           </button>

           <button
             type="button"
             onClick={() => setRole("admin")}
             className={`rounded-xl py-3 transition ${
             role === "admin"
             ? "bg-green-900 text-white shadow-lg"
             : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
           >
            <div className="text-3xl">⚙️</div>
           <div className="text-sm font-semibold mt-1">
              Admin
           </div>
           </button>

          </div>

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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="ml-3 w-full outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-green-700 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-700 to-lime-600 hover:from-green-800 hover:to-green-700 text-white font-semibold transition">

              Login

            </button>

          </form>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleLogin
              onSuccess={(credentialResponse) => {
              console.log("Google Login Success:", credentialResponse);
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
            theme="filled_blue"
            shape="pill"
            size="large"
          />
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