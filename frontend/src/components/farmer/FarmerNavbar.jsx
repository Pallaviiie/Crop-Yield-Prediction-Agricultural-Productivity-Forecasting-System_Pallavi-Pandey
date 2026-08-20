import { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const FarmerNavbar = ({ activePage }) => {
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
          console.error("Failed to fetch user:", response.status);
          return;
        }

        const data = await response.json();

        console.log("Logged-in user:", data);

        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);

  const userName =
    user?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const userRole =
    user?.role
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
      : "Farmer";

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="farmer-navbar">
      <h2>{activePage}</h2>

      <div className="navbar-right">

        <div className="search-box">
          <Search size={17} />
          <input placeholder="Search..." />
        </div>

        <button className="notification-btn">
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        {/* USER PROFILE */}
        <div className="navbar-profile">
          <div className="profile-avatar">
            {userInitial}
          </div>

          <div className="navbar-user-info">
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default FarmerNavbar;