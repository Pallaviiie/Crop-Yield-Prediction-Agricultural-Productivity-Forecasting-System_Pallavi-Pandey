import React, { useEffect, useMemo, useState } from "react";
import {
  Users as UsersIcon,
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  X,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";

import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  updateAdminUserStatus,
} from "../../services/adminApi";

import "../../styles/admin/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] =
    useState(null);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "farmer",
    city: "",
    district: "",
    state: "",
  });

  /* =====================================================
     LOAD USERS
  ===================================================== */

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();

      const userList = Array.isArray(data)
        ? data
        : data?.users ||
          data?.data ||
          [];

      setUsers(userList);
    } catch (err) {
      console.error(
        "Unable to load users:",
        err
      );

      setError(
        err.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =====================================================
     CURRENT LOGGED-IN ADMIN
  ===================================================== */

  const getCurrentUserId = () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      return storedUser?.id;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  /* =====================================================
     FORM HANDLING
  ===================================================== */

  const resetForm = () => {
    setForm({
      full_name: "",
      email: "",
      password: "",
      phone: "",
      role: "farmer",
      city: "",
      district: "",
      state: "",
    });

    setEditingUser(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
    setError("");
  };

  const openEditModal = (user) => {
    setEditingUser(user);

    setForm({
      full_name: user?.full_name || "",
      email: user?.email || "",
      password: "",
      phone: user?.phone || "",
      role: user?.role || "farmer",
      city: user?.city || "",
      district: user?.district || "",
      state: user?.state || "",
    });

    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
    setError("");
  };

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  /* =====================================================
     CREATE / UPDATE USER
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (!form.full_name.trim()) {
        throw new Error(
          "Please enter the user's full name."
        );
      }

      if (!form.email.trim()) {
        throw new Error(
          "Please enter the user's email."
        );
      }

      if (!editingUser && !form.password.trim()) {
        throw new Error(
          "Please enter a password."
        );
      }

      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        city: form.city.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
      };

      /* =========================
         CREATE
      ========================= */

      if (!editingUser) {
        payload.password =
          form.password;

        await createAdminUser(
          payload
        );
      }

      /* =========================
         UPDATE
      ========================= */

      else {
        /*
         * Don't send an empty password
         * while editing.
         */

        if (form.password.trim()) {
          payload.password =
            form.password.trim();
        }

        await updateAdminUser(
          editingUser.id,
          payload
        );
      }

      setShowModal(false);
      resetForm();

      await loadUsers();
    } catch (err) {
      console.error(
        "User save error:",
        err
      );

      setError(
        err.message ||
          "Unable to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE USER
  ===================================================== */

  const handleDelete = async (user) => {
    if (!user?.id) return;

    if (
      String(user.id) ===
      String(currentUserId)
    ) {
      alert(
        "You cannot delete your own administrator account."
      );

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        user.full_name ||
        user.email ||
        "this user"
      }?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(user.id);

      await deleteAdminUser(
        user.id
      );

      await loadUsers();
    } catch (err) {
      console.error(
        "Delete user error:",
        err
      );

      alert(
        err.message ||
          "Unable to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     ACTIVE / INACTIVE
  ===================================================== */

  const handleStatusChange = async (
    user
  ) => {
    if (!user?.id) return;

    if (
      String(user.id) ===
      String(currentUserId)
    ) {
      alert(
        "You cannot deactivate your own administrator account."
      );

      return;
    }

    const currentStatus =
      user.is_active !== false;

    const newStatus =
      !currentStatus;

    try {
      setStatusUpdatingId(
        user.id
      );

      await updateAdminUserStatus(
        user.id,
        newStatus
      );

      /*
       * Immediately update UI.
       */

      setUsers((previous) =>
        previous.map((item) =>
          String(item.id) ===
          String(user.id)
            ? {
                ...item,
                is_active:
                  newStatus,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      alert(
        err.message ||
          "Unable to update user status."
      );
    } finally {
      setStatusUpdatingId(
        null
      );
    }
  };

  /* =====================================================
     FILTER USERS
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const searchText =
      search
        .trim()
        .toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchText ||
        String(
          user.full_name || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          user.email || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          user.phone || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          user.city || ""
        )
          .toLowerCase()
          .includes(searchText);

      const matchesRole =
        roleFilter === "all" ||
        String(
          user.role || ""
        ).toLowerCase() ===
          roleFilter;

      const active =
        user.is_active !== false;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          active) ||
        (statusFilter ===
          "inactive" &&
          !active);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalUsers =
    users.length;

  const farmers = users.filter(
    (user) =>
      String(
        user.role || ""
      ).toLowerCase() ===
      "farmer"
  ).length;

  const consultants =
    users.filter(
      (user) =>
        String(
          user.role || ""
        ).toLowerCase() ===
        "consultant"
    ).length;

  const admins = users.filter(
    (user) =>
      String(
        user.role || ""
      ).toLowerCase() ===
      "admin"
  ).length;

  const activeUsers =
    users.filter(
      (user) =>
        user.is_active !== false
    ).length;

  /* =====================================================
     ROLE ICON
  ===================================================== */

  const getRoleIcon = (role) => {
    const normalized =
      String(
        role || ""
      ).toLowerCase();

    if (normalized === "admin") {
      return (
        <ShieldCheck size={16} />
      );
    }

    if (
      normalized ===
      "consultant"
    ) {
      return (
        <BriefcaseBusiness
          size={16}
        />
      );
    }

    return (
      <UserRound size={16} />
    );
  };

  /* =====================================================
     ROLE LABEL
  ===================================================== */

  const getRoleLabel = (role) => {
    if (!role) return "User";

    return (
      role.charAt(0).toUpperCase() +
      role.slice(1)
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-users-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div>
          <h1>
            User Management
          </h1>

          <p>
            Manage farmers, consultants
            and administrator accounts.
          </p>
        </div>

        <button
          className="users-add-button"
          onClick={openAddModal}
        >
          <Plus size={18} />

          Add User
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && !showModal && (
        <div className="users-error">
          <XCircle size={18} />

          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="users-stat-grid">

        <div className="users-stat-card">

          <div className="users-stat-icon">
            <UsersIcon size={22} />
          </div>

          <div>
            <span>
              Total Users
            </span>

            <strong>
              {totalUsers}
            </strong>
          </div>

        </div>

        <div className="users-stat-card">

          <div className="users-stat-icon farmer">
            <UserRound size={22} />
          </div>

          <div>
            <span>
              Farmers
            </span>

            <strong>
              {farmers}
            </strong>
          </div>

        </div>

        <div className="users-stat-card">

          <div className="users-stat-icon consultant">
            <BriefcaseBusiness
              size={22}
            />
          </div>

          <div>
            <span>
              Consultants
            </span>

            <strong>
              {consultants}
            </strong>
          </div>

        </div>

        <div className="users-stat-card">

          <div className="users-stat-icon admin">
            <ShieldCheck
              size={22}
            />
          </div>

          <div>
            <span>
              Administrators
            </span>

            <strong>
              {admins}
            </strong>
          </div>

        </div>

        <div className="users-stat-card">

          <div className="users-stat-icon active">
            <CheckCircle
              size={22}
            />
          </div>

          <div>
            <span>
              Active Users
            </span>

            <strong>
              {activeUsers}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="users-toolbar">

        <div className="users-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email, phone or city..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {search && (
            <button
              className="users-clear-search"
              onClick={() =>
                setSearch("")
              }
            >
              <X size={16} />
            </button>
          )}

        </div>

        <select
          className="users-filter"
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(
              e.target.value
            )
          }
        >
          <option value="all">
            All Roles
          </option>

          <option value="farmer">
            Farmers
          </option>

          <option value="consultant">
            Consultants
          </option>

          <option value="admin">
            Administrators
          </option>
        </select>

        <select
          className="users-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option value="all">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>
        </select>

        <button
          className="users-refresh-button"
          onClick={loadUsers}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "admin-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =================================================
          USER TABLE
      ================================================= */}

      <div className="users-table-card">

        <div className="users-table-header">

          <div>
            <h2>
              Platform Users
            </h2>

            <p>
              Showing{" "}
              <strong>
                {filteredUsers.length}
              </strong>{" "}
              of{" "}
              <strong>
                {users.length}
              </strong>{" "}
              users
            </p>
          </div>

        </div>

        {loading ? (
          <div className="users-loading">

            <RefreshCw
              size={28}
              className="admin-spin"
            />

            <span>
              Loading users...
            </span>

          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-empty">

            <UsersIcon
              size={42}
            />

            <h3>
              No users found
            </h3>

            <p>
              Try changing your
              search or filters.
            </p>

          </div>
        ) : (
          <div className="users-table-wrapper">

            <table className="users-table">

              <thead>
                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Contact
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Joined
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => {
                    const isActive =
                      user.is_active !==
                      false;

                    const isCurrentUser =
                      String(
                        user.id
                      ) ===
                      String(
                        currentUserId
                      );

                    return (
                      <tr
                        key={
                          user.id
                        }
                      >

                        {/* USER */}

                        <td>

                          <div className="user-info">

                            <div className="user-avatar">
                              {user.full_name
                                ? user.full_name
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()
                                : "U"}
                            </div>

                            <div className="user-name-block">

                              <strong>
                                {user.full_name ||
                                  "Unnamed User"}
                              </strong>

                              <span>
                                ID:{" "}
                                {user.id ??
                                  "—"}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CONTACT */}

                        <td>

                          <div className="user-contact">

                            <span>
                              <Mail
                                size={
                                  14
                                }
                              />

                              {user.email ||
                                "—"}
                            </span>

                            {user.phone && (
                              <span>
                                <Phone
                                  size={
                                    14
                                  }
                                />

                                {user.phone}
                              </span>
                            )}

                          </div>

                        </td>

                        {/* LOCATION */}

                        <td>

                          <div className="user-location">

                            <MapPin
                              size={15}
                            />

                            <span>
                              {[
                                user.city,
                                user.district,
                                user.state,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  ", "
                                ) ||
                                "—"}
                            </span>

                          </div>

                        </td>

                        {/* ROLE */}

                        <td>

                          <span
                            className={`user-role-badge ${String(
                              user.role ||
                                ""
                            ).toLowerCase()}`}
                          >
                            {getRoleIcon(
                              user.role
                            )}

                            {getRoleLabel(
                              user.role
                            )}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <button
                            className={`user-status-badge ${
                              isActive
                                ? "active"
                                : "inactive"
                            }`}
                            onClick={() =>
                              handleStatusChange(
                                user
                              )
                            }
                            disabled={
                              statusUpdatingId ===
                              user.id ||
                              isCurrentUser
                            }
                            title={
                              isCurrentUser
                                ? "You cannot change your own status"
                                : isActive
                                ? "Click to deactivate"
                                : "Click to activate"
                            }
                          >

                            {statusUpdatingId ===
                            user.id ? (
                              <RefreshCw
                                size={
                                  14
                                }
                                className="admin-spin"
                              />
                            ) : isActive ? (
                              <CheckCircle
                                size={
                                  14
                                }
                              />
                            ) : (
                              <XCircle
                                size={
                                  14
                                }
                              />
                            )}

                            {isActive
                              ? "Active"
                              : "Inactive"}

                          </button>

                        </td>

                        {/* JOINED */}

                        <td>

                          <span className="user-date">

                            {user.created_at
                              ? new Date(
                                  user.created_at
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "—"}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="user-actions">

                            <button
                              className="user-action edit"
                              onClick={() =>
                                openEditModal(
                                  user
                                )
                              }
                              title="Edit user"
                            >
                              <Pencil
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              className="user-action delete"
                              onClick={() =>
                                handleDelete(
                                  user
                                )
                              }
                              disabled={
                                deletingId ===
                                  user.id ||
                                isCurrentUser
                              }
                              title={
                                isCurrentUser
                                  ? "You cannot delete yourself"
                                  : "Delete user"
                              }
                            >
                              {deletingId ===
                              user.id ? (
                                <RefreshCw
                                  size={
                                    16
                                  }
                                  className="admin-spin"
                                />
                              ) : (
                                <Trash2
                                  size={
                                    16
                                  }
                                />
                              )}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div
          className="users-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="users-modal">

            {/* MODAL HEADER */}

            <div className="users-modal-header">

              <div>
                <h2>
                  {editingUser
                    ? "Edit User"
                    : "Add New User"}
                </h2>

                <p>
                  {editingUser
                    ? "Update the user's account information."
                    : "Create a new platform user account."}
                </p>
              </div>

              <button
                className="users-modal-close"
                onClick={
                  closeModal
                }
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL ERROR */}

            {error && (
              <div className="users-modal-error">

                <XCircle
                  size={17}
                />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* FORM */}

            <form
              className="users-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* NAME */}

              <div className="users-form-field">

                <label>
                  Full Name
                </label>

                <div className="users-input">

                  <UserRound
                    size={17}
                  />

                  <input
                    type="text"
                    name="full_name"
                    value={
                      form.full_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter full name"
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="users-form-field">

                <label>
                  Email Address
                </label>

                <div className="users-input">

                  <Mail
                    size={17}
                  />

                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter email"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="users-form-field">

                <label>
                  Password{" "}
                  {editingUser && (
                    <span>
                      (leave blank to
                      keep current)
                    </span>
                  )}
                </label>

                <div className="users-input">

                  <ShieldCheck
                    size={17}
                  />

                  <input
                    type="password"
                    name="password"
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      editingUser
                        ? "Enter new password"
                        : "Enter password"
                    }
                    required={
                      !editingUser
                    }
                  />

                </div>

              </div>

              {/* ROLE */}

              <div className="users-form-field">

                <label>
                  Role
                </label>

                <select
                  name="role"
                  value={
                    form.role
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="farmer">
                    Farmer
                  </option>

                  <option value="consultant">
                    Consultant
                  </option>

                  <option value="admin">
                    Administrator
                  </option>

                </select>

              </div>

              {/* PHONE */}

              <div className="users-form-field">

                <label>
                  Phone Number
                </label>

                <div className="users-input">

                  <Phone
                    size={17}
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                  />

                </div>

              </div>

              {/* CITY */}

              <div className="users-form-field">

                <label>
                  City
                </label>

                <div className="users-input">

                  <MapPin
                    size={17}
                  />

                  <input
                    type="text"
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter city"
                  />

                </div>

              </div>

              {/* DISTRICT */}

              <div className="users-form-field">

                <label>
                  District
                </label>

                <div className="users-input">

                  <MapPin
                    size={17}
                  />

                  <input
                    type="text"
                    name="district"
                    value={
                      form.district
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter district"
                  />

                </div>

              </div>

              {/* STATE */}

              <div className="users-form-field">

                <label>
                  State
                </label>

                <div className="users-input">

                  <MapPin
                    size={17}
                  />

                  <input
                    type="text"
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter state"
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="users-form-actions">

                <button
                  type="button"
                  className="users-cancel-button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="users-save-button"
                  disabled={
                    saving
                  }
                >

                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="admin-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Save
                        size={17}
                      />

                      {editingUser
                        ? "Update User"
                        : "Create User"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Users;