import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Home
import Home from "./pages/Home";

// Farmer
import FarmerLayout from "./layouts/FarmerLayout";
import Dashboard from "./pages/farmer/Dashboard";
import History from "./pages/farmer/History";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Consultant
import ConsultantLayout from "./layouts/ConsultantLayout";
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

        <Route element={<FarmerLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/history"
            element={<History />}
          />

        </Route>


        {/* ================= ADMIN ================= */}

        <Route element={<AdminLayout />}>

          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />

        </Route>


        {/* ================= CONSULTANT ================= */}

        <Route element={<ConsultantLayout />}>

          <Route
            path="/consultant-dashboard"
            element={<ConsultantDashboard />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;