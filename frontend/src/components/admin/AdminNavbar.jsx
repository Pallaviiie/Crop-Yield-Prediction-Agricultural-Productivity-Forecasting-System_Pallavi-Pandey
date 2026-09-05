import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  UserCircle,
} from "lucide-react";


/* =========================================================
   ADMIN NAVBAR
========================================================= */

const AdminNavbar = ({
  activePage,
  setActivePage,
}) => {

  const [user, setUser] = useState({});
  const [showProfile, setShowProfile] =
    useState(false);

  const dropdownRef = useRef(null);


  /* =======================================================
     LOAD LOGGED-IN USER
  ======================================================= */

  useEffect(() => {

    try {

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setUser(storedUser);

    } catch (error) {

      setUser({});

    }

  }, []);


  /* =======================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setShowProfile(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  /* =======================================================
     ADMIN NAME
  ======================================================= */

  const adminName =
    user?.full_name ||
    user?.name ||
    "Admin User";


  const firstLetter =
    adminName
      .charAt(0)
      .toUpperCase();


  /* =======================================================
     PROFILE CLICK
  ======================================================= */

  const handleProfile = () => {

    if (setActivePage) {
      setActivePage("Profile");
    }

    setShowProfile(false);

  };


  return (

    <header className="admin-navbar">

      {/* =================================================
          LEFT SIDE

          NO HAMBURGER HERE
      ================================================= */}

      <div className="admin-navbar-left">

        <h1>
          Admin Dashboard
        </h1>

      </div>


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="admin-navbar-right">


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="admin-navbar-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
          />

        </div>


        {/* =================================================
            NOTIFICATION
        ================================================= */}

        <button
          type="button"
          className="admin-notification-button"
          title="Notifications"
        >

          <Bell size={20} />

          <span className="notification-dot" />

        </button>


        {/* =================================================
            PROFILE
        ================================================= */}

        <div
          className="admin-navbar-profile-wrapper"
          ref={dropdownRef}
        >

          <button
            type="button"
            className="admin-navbar-profile"
            onClick={() =>
              setShowProfile(
                (previous) => !previous
              )
            }
            aria-expanded={showProfile}
            title="Admin profile"
          >

            {/* AVATAR */}

            <div className="admin-navbar-avatar">

              {firstLetter}

            </div>


            {/* USER INFO */}

            <div className="admin-navbar-user-info">

              <strong>
                {adminName}
              </strong>

              <span>
                Admin
              </span>

            </div>


            {/* ARROW */}

            <ChevronDown
              size={16}
              className={
                showProfile
                  ? "profile-chevron-open"
                  : ""
              }
            />

          </button>


          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {showProfile && (

            <div className="admin-profile-dropdown">


              {/* DROPDOWN USER */}

              <div className="dropdown-user">

                <div className="dropdown-avatar">

                  {firstLetter}

                </div>


                <div className="dropdown-user-info">

                  <strong>
                    {adminName}
                  </strong>

                  <span>
                    {user?.email ||
                      "Administrator"}
                  </span>

                </div>

              </div>


              {/* DIVIDER */}

              <div className="dropdown-divider" />


              {/* PROFILE */}

              <button
                type="button"
                onClick={handleProfile}
              >

                <UserCircle
                  size={17}
                />

                <span>
                  Profile
                </span>

              </button>


              {/* ADMIN ROLE */}

              <div className="dropdown-admin-role">

                <ShieldCheck
                  size={16}
                />

                <span>
                  Administrator
                </span>

              </div>


            </div>

          )}

        </div>

      </div>

    </header>

  );
};


export default AdminNavbar;