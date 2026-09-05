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

// ================= ADMIN =================
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

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
          path="/consultant/dashboard"
          element={<ConsultantDashboard />}
        />

        <Route
          path="/consultant-dashboard"
          element={<ConsultantDashboard />}
        />

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminLayout />}></Route>
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;