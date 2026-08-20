import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= AUTHENTICATION =================
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ================= HOME =================
import Home from "./pages/Home";

// ================= FARMER =================
import FarmerDashboard from "./pages/farmer/FarmerDashboard";

// ================= CONSULTANT =================
import ConsultantDashboard from "./pages/consultant/ConsultantDashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ================= AUTHENTICATION ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= FARMER ================= */}

        <Route
          path="/dashboard"
          element={<FarmerDashboard />}
        />


        {/* ================= CONSULTANT ================= */}

        <Route
          path="/consultant-dashboard"
          element={<ConsultantDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;