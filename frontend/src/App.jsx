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
import FarmerManagement from "./pages/consultant/FarmerManagement";
import Consultations from "./pages/consultant/Consultations";
import Analytics from "./pages/consultant/Analytics";
import Notes from "./pages/consultant/Notes";

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
        <Route
  path="/consultant/farmers"
  element={<FarmerManagement />}
/>

<Route
  path="/consultant/consultations"
  element={<Consultations />}
/>

<Route
  path="/consultant/analytics"
  element={<Analytics />}
/>

<Route
  path="/consultant/notes"
  element={<Notes />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;