import React, { useEffect, useMemo, useState } from "react";
import {
  Download,
  Search,
  RefreshCw,
  AlertCircle,
  ClipboardList,
} from "lucide-react";

import { getAdminActivityLogs } from "../../services/adminApi";

import "../../styles/admin/ActivityLogs.css";


// ======================================================
// FORMAT TIME
// ======================================================

const formatRelativeTime = (timestamp) => {
  if (!timestamp) {
    return "Unknown time";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  const now = new Date();
  const difference = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (difference < 60) {
    return difference <= 1
      ? "Just now"
      : `${difference} seconds ago`;
  }

  const minutes = Math.floor(difference / 60);

  if (minutes < 60) {
    return minutes === 1
      ? "1 minute ago"
      : `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return hours === 1
      ? "1 hour ago"
      : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return days === 1
      ? "1 day ago"
      : `${days} days ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


// ======================================================
// FULL DATE
// ======================================================

const formatFullDate = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


// ======================================================
// ACTIVITY TYPE
// ======================================================

const getActivityType = (log) => {
  const type = String(
    log?.type || ""
  ).toLowerCase();

  const action = String(
    log?.action || ""
  ).toLowerCase();

  if (
    type === "error" ||
    type === "danger" ||
    action.includes("failed") ||
    action.includes("deactivated") ||
    action.includes("deleted")
  ) {
    return "error";
  }

  if (
    type === "warning" ||
    action.includes("warning")
  ) {
    return "warning";
  }

  if (
    type === "success" ||
    action.includes("registered") ||
    action.includes("completed") ||
    action.includes("created") ||
    action.includes("added")
  ) {
    return "success";
  }

  return "info";
};


// ======================================================
// ACTIVITY LOGS COMPONENT
// ======================================================

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");


  // ====================================================
  // FETCH LOGS
  // ====================================================

  const fetchLogs = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data =
        await getAdminActivityLogs();

      setLogs(
        Array.isArray(data)
          ? data
          : data?.logs || []
      );
    } catch (err) {
      console.error(
        "Failed to fetch activity logs:",
        err
      );

      setError(
        err?.message ||
          "Unable to load activity logs."
      );

      setLogs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchLogs();
  }, []);


  // ====================================================
  // SEARCH
  // ====================================================

  const filteredLogs = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return logs;
    }

    return logs.filter((log) => {
      const action = String(
        log?.action || ""
      ).toLowerCase();

      const actor = String(
        log?.actor_name || ""
      ).toLowerCase();

      const role = String(
        log?.actor_role || ""
      ).toLowerCase();

      const details = String(
        log?.details || ""
      ).toLowerCase();

      return (
        action.includes(search) ||
        actor.includes(search) ||
        role.includes(search) ||
        details.includes(search)
      );
    });
  }, [logs, searchTerm]);


  // ====================================================
  // EXPORT CSV
  // ====================================================

  const handleExport = () => {
    if (!filteredLogs.length) {
      return;
    }

    const headers = [
      "Action",
      "User",
      "Role",
      "Details",
      "Type",
      "Date",
    ];

    const rows = filteredLogs.map(
      (log) => [
        log?.action || "",
        log?.actor_name || "",
        log?.actor_role || "",
        log?.details || "",
        log?.type || "",
        formatFullDate(log?.timestamp),
      ]
    );

    const escapeCSV = (value) => {
      const text = String(value ?? "");

      return `"${text.replace(
        /"/g,
        '""'
      )}"`;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `activity-logs-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="activity-page">

        <div className="activity-loading">

          <RefreshCw
            size={28}
            className="activity-spinner"
          />

          <p>
            Loading activity logs...
          </p>

        </div>

      </div>
    );
  }


  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="activity-page">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="activity-page-header">

        <div className="activity-header-left">

          <div className="activity-title-icon">
            <ClipboardList size={20} />
          </div>

          <div>
            <h1>
              Activity Logs
            </h1>

            <p>
              Monitor recent activity across
              the YieldSense platform
            </p>
          </div>

        </div>


        <div className="activity-header-actions">

          <button
            type="button"
            className="activity-refresh-btn"
            onClick={() =>
              fetchLogs(true)
            }
            disabled={refreshing}
          >

            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "activity-spinner"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>

      </div>


      {/* ============================================= */}
      {/* ERROR */}
      {/* ============================================= */}

      {error && (
        <div className="activity-error">

          <AlertCircle size={18} />

          <div>
            <strong>
              Unable to load activity logs
            </strong>

            <span>
              {error}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchLogs()
            }
          >
            Try Again
          </button>

        </div>
      )}


      {/* ============================================= */}
      {/* ACTIVITY CARD */}
      {/* ============================================= */}

      <div className="activity-card">

        {/* CARD HEADER */}

        <div className="activity-card-header">

          <div>
            <h2>
              Recent Activity Logs
            </h2>

            <span className="activity-count">
              {filteredLogs.length}{" "}
              {filteredLogs.length === 1
                ? "activity"
                : "activities"}
            </span>
          </div>


          <div className="activity-card-actions">

            {/* SEARCH */}

            <div className="activity-search">

              <Search size={15} />

              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

              {searchTerm && (
                <button
                  type="button"
                  className="activity-search-clear"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>


            {/* EXPORT */}

            <button
              type="button"
              className="activity-export-btn"
              onClick={handleExport}
              disabled={
                filteredLogs.length === 0
              }
            >

              <Download size={15} />

              Export

            </button>

          </div>

        </div>


        {/* =========================================== */}
        {/* LOG LIST */}
        {/* =========================================== */}

        <div className="activity-list">

          {filteredLogs.length === 0 ? (

            <div className="activity-empty">

              <div className="activity-empty-icon">
                <ClipboardList size={30} />
              </div>

              <h3>
                {searchTerm
                  ? "No matching activities"
                  : "No activity logs yet"}
              </h3>

              <p>
                {searchTerm
                  ? "Try a different search term."
                  : "Activity will appear here as users and administrators perform actions."}
              </p>

            </div>

          ) : (

            filteredLogs.map(
              (log, index) => {

                const activityType =
                  getActivityType(log);

                return (
                  <div
                    className="activity-row"
                    key={
                      log?.id ??
                      `${log?.timestamp}-${index}`
                    }
                  >

                    {/* DOT */}

                    <div
                      className={`activity-dot activity-dot-${activityType}`}
                    />


                    {/* CONTENT */}

                    <div className="activity-row-content">

                      <div className="activity-action">

                        {log?.action ||
                          "Activity recorded"}

                      </div>


                      <div className="activity-actor">

                        {log?.actor_name ||
                          "System"}

                        {log?.actor_role && (
                          <span className="activity-role">
                            {log.actor_role}
                          </span>
                        )}

                      </div>


                      {log?.details && (
                        <div className="activity-details">
                          {log.details}
                        </div>
                      )}

                    </div>


                    {/* TIME */}

                    <div
                      className="activity-time"
                      title={formatFullDate(
                        log?.timestamp
                      )}
                    >
                      {formatRelativeTime(
                        log?.timestamp
                      )}
                    </div>

                  </div>
                );
              }
            )

          )}

        </div>

      </div>

    </div>
  );
};

export default ActivityLogs;