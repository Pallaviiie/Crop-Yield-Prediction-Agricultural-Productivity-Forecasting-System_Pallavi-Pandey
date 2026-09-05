import { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const ConsultantNavbar = ({ activePage }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.log("No access token found");
          return;
        }

        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error(
            "Failed to fetch consultant:",
            response.status
          );
          return;
        }

        const data = await response.json();

        console.log("Logged-in consultant:", data);

        setUser(data);
      } catch (error) {
        console.error(
          "Error fetching consultant profile:",
          error
        );
      }
    };

    fetchUser();
  }, []);

  /* ==============================
     USER DATA
     ============================== */

  const userName =
    user?.full_name ||
    user?.email?.split("@")[0] ||
    "Consultant";

  const userRole = user?.role
    ? user.role.charAt(0).toUpperCase() +
      user.role.slice(1)
    : "Consultant";

  const userInitial =
    userName.charAt(0).toUpperCase();

  return (
    <header className="consultant-navbar">

      {/* =========================
          PAGE TITLE
          ========================= */}

      <h2 className="consultant-navbar-title">
        {activePage || "Consultant Dashboard"}
      </h2>


      {/* =========================
          RIGHT SIDE
          ========================= */}

      <div className="consultant-navbar-right">

        {/* SEARCH */}

        <div className="consultant-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>


        {/* NOTIFICATION */}

        <button className="consultant-notification">

          <Bell size={19} />

          <span className="notification-indicator"></span>

        </button>


        {/* USER PROFILE */}

        <div className="consultant-navbar-user">

          <div className="consultant-navbar-avatar">
            {userInitial}
          </div>


          <div className="consultant-navbar-user-details">

            <strong>
              {userName}
            </strong>

            <span>
              {userRole}
            </span>

          </div>

        </div>

      </div>

    </header>
  );
};

export default ConsultantNavbar;