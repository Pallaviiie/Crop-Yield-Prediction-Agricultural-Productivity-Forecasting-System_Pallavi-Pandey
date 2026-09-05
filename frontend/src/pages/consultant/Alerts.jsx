import React, { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  Clock,
  Info,
  RefreshCw,
  Trash2,
  User,
  XCircle,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";

import {
  getConsultantAlerts,
  markConsultantAlertAsRead,
  markAllConsultantAlertsAsRead,
  deleteConsultantAlert,
} from "../../services/api";

import "../../styles/consultant/Alerts.css";


export default function Alerts() {

  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");

  const [processingId, setProcessingId] = useState(null);


  // ============================================================
  // LOAD ALERTS
  // ============================================================

  const loadAlerts = async (showRefresh = false) => {

    try {

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getConsultantAlerts();

      /*
       * Backend normally returns an array.
       * This also handles common wrapped responses.
       */

      const data =
        Array.isArray(response)
          ? response
          : response?.alerts ||
            response?.data ||
            [];

      setAlerts(data);

    } catch (err) {

      console.error(
        "Failed to load alerts:",
        err
      );

      setError(
        err?.message ||
        "Failed to load alerts."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {

    loadAlerts();

  }, []);


  // ============================================================
  // FILTERED ALERTS
  // ============================================================

  const filteredAlerts = useMemo(() => {

    if (filter === "unread") {

      return alerts.filter(
        (alert) => !alert.is_read
      );

    }

    if (filter === "read") {

      return alerts.filter(
        (alert) => alert.is_read
      );

    }

    if (filter === "critical") {

      return alerts.filter(
        (alert) =>
          alert.severity === "critical" ||
          alert.severity === "high"
      );

    }

    return alerts;

  }, [alerts, filter]);


  // ============================================================
  // COUNTS
  // ============================================================

  const unreadCount = alerts.filter(
    (alert) => !alert.is_read
  ).length;

  const criticalCount = alerts.filter(
    (alert) =>
      alert.severity === "critical" ||
      alert.severity === "high"
  ).length;


  // ============================================================
  // MARK ONE READ
  // ============================================================

  const handleMarkRead = async (alert) => {

    if (alert.is_read) {
      return;
    }

    try {

      setProcessingId(alert.id);

      const updated =
        await markConsultantAlertAsRead(
          alert.id
        );

      setAlerts((current) =>
        current.map((item) =>
          item.id === alert.id
            ? {
                ...item,
                ...(updated || {}),
                is_read: true,
              }
            : item
        )
      );

    } catch (err) {

      console.error(
        "Failed to mark alert as read:",
        err
      );

      setError(
        err?.message ||
        "Failed to mark alert as read."
      );

    } finally {

      setProcessingId(null);

    }
  };


  // ============================================================
  // MARK ALL READ
  // ============================================================

  const handleMarkAllRead = async () => {

    if (unreadCount === 0) {
      return;
    }

    try {

      setProcessingId("all");

      await markAllConsultantAlertsAsRead();

      setAlerts((current) =>
        current.map((alert) => ({
          ...alert,
          is_read: true,
        }))
      );

    } catch (err) {

      console.error(
        "Failed to mark all alerts as read:",
        err
      );

      setError(
        err?.message ||
        "Failed to mark all alerts as read."
      );

    } finally {

      setProcessingId(null);

    }
  };


  // ============================================================
  // DELETE ALERT
  // ============================================================

  const handleDelete = async (alertId) => {

    try {

      setProcessingId(alertId);

      await deleteConsultantAlert(
        alertId
      );

      setAlerts((current) =>
        current.filter(
          (alert) =>
            alert.id !== alertId
        )
      );

    } catch (err) {

      console.error(
        "Failed to delete alert:",
        err
      );

      setError(
        err?.message ||
        "Failed to delete alert."
      );

    } finally {

      setProcessingId(null);

    }
  };


  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "Unknown time";
    }

    const date =
      new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown time";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // ============================================================
  // RELATIVE TIME
  // ============================================================

  const getRelativeTime = (dateValue) => {

    if (!dateValue) {
      return "";
    }

    const date =
      new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const difference =
      Date.now() - date.getTime();

    const minutes =
      Math.floor(
        difference / 60000
      );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days =
      Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return formatDate(dateValue);
  };


  // ============================================================
  // ALERT ICON
  // ============================================================

  const getAlertIcon = (alert) => {

    const severity =
      String(
        alert?.severity || "info"
      ).toLowerCase();

    const type =
      String(
        alert?.alert_type || ""
      ).toLowerCase();

    if (
      severity === "critical" ||
      severity === "high"
    ) {
      return <ShieldAlert size={21} />;
    }

    if (
      type.includes("warning") ||
      severity === "medium"
    ) {
      return <AlertTriangle size={21} />;
    }

    if (
      type.includes("success") ||
      type.includes("approved")
    ) {
      return <Check size={21} />;
    }

    if (
      type.includes("error") ||
      type.includes("rejected")
    ) {
      return <XCircle size={21} />;
    }

    return <Info size={21} />;
  };


  // ============================================================
  // EMPTY STATE
  // ============================================================

  const renderEmptyState = () => {

    if (loading) {
      return (
        <div className="alerts-loading">

          <div className="alerts-spinner">
            <RefreshCw size={26} />
          </div>

          <p>
            Loading alerts...
          </p>

        </div>
      );
    }

    if (error) {
      return (
        <div className="alerts-error">

          <AlertTriangle size={30} />

          <h3>
            Unable to load alerts
          </h3>

          <p>
            {error}
          </p>

          <button
            className="alerts-retry-btn"
            onClick={() =>
              loadAlerts()
            }
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </div>
      );
    }

    return (
      <div className="alerts-empty">

        <div className="alerts-empty-icon">
          <Bell size={34} />
        </div>

        <h3>
          No alerts
        </h3>

        <p>
          You're all caught up. New
          farmer and system alerts will
          appear here.
        </p>

      </div>
    );
  };


  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="alerts-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="alerts-header">

        <div>

          <div className="alerts-title-row">

            <div className="alerts-title-icon">
              <Bell size={25} />
            </div>

            <div>

              <h1>
                Alerts
              </h1>

              <p>
                Stay updated with important
                farmer and system activities.
              </p>

            </div>

          </div>

        </div>


        <div className="alerts-header-actions">

          <button
            className="alerts-refresh-btn"
            onClick={() =>
              loadAlerts(true)
            }
            disabled={refreshing}
          >

            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "alerts-spin"
                  : ""
              }
            />

            Refresh

          </button>


          <button
            className="alerts-mark-all-btn"
            onClick={handleMarkAllRead}
            disabled={
              unreadCount === 0 ||
              processingId === "all"
            }
          >

            <CheckCheck size={17} />

            Mark all as read

          </button>

        </div>

      </div>


      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="alerts-summary">

        <div className="alert-summary-card">

          <div className="alert-summary-icon total">
            <Bell size={21} />
          </div>

          <div>

            <span>
              Total Alerts
            </span>

            <strong>
              {alerts.length}
            </strong>

          </div>

        </div>


        <div className="alert-summary-card">

          <div className="alert-summary-icon unread">
            <Clock size={21} />
          </div>

          <div>

            <span>
              Unread
            </span>

            <strong>
              {unreadCount}
            </strong>

          </div>

        </div>


        <div className="alert-summary-card">

          <div className="alert-summary-icon critical">
            <ShieldAlert size={21} />
          </div>

          <div>

            <span>
              High Priority
            </span>

            <strong>
              {criticalCount}
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <div className="alerts-toolbar">

        <div className="alerts-filter">

          <span>
            Show
          </span>

          <div className="alerts-select-wrapper">

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
            >

              <option value="all">
                All Alerts
              </option>

              <option value="unread">
                Unread
              </option>

              <option value="read">
                Read
              </option>

              <option value="critical">
                High Priority
              </option>

            </select>

            <ChevronDown
              size={16}
            />

          </div>

        </div>


        <span className="alerts-result-count">

          {filteredAlerts.length}{" "}
          {filteredAlerts.length === 1
            ? "alert"
            : "alerts"}

        </span>

      </div>


      {/* ======================================================
          ALERT LIST
      ====================================================== */}

      {filteredAlerts.length === 0
        ? renderEmptyState()
        : (

          <div className="alerts-list">

            {filteredAlerts.map(
              (alert) => {

                const severity =
                  String(
                    alert.severity ||
                    "info"
                  ).toLowerCase();

                const type =
                  String(
                    alert.alert_type ||
                    "general"
                  ).toLowerCase();

                return (

                  <div
                    key={alert.id}
                    className={`alert-card ${
                      alert.is_read
                        ? "read"
                        : "unread"
                    } severity-${severity}`}
                  >

                    {/* ICON */}

                    <div
                      className={`alert-icon severity-${severity}`}
                    >
                      {getAlertIcon(
                        alert
                      )}
                    </div>


                    {/* CONTENT */}

                    <div className="alert-content">

                      <div className="alert-top-row">

                        <div className="alert-heading">

                          <h3>
                            {alert.title ||
                              "Alert"}
                          </h3>

                          {!alert.is_read && (
                            <span className="unread-dot" />
                          )}

                        </div>


                        <span
                          className={`alert-severity severity-${severity}`}
                        >
                          {severity}
                        </span>

                      </div>


                      <p className="alert-message">

                        {alert.message ||
                          "No additional information available."}

                      </p>


                      <div className="alert-meta">

                        {alert.farmer_id && (
                          <span>
                            <User
                              size={14}
                            />

                            Farmer #
                            {alert.farmer_id}
                          </span>
                        )}


                        {alert.prediction_id && (
                          <span>
                            <Info
                              size={14}
                            />

                            Prediction #
                            {alert.prediction_id}
                          </span>
                        )}


                        <span
                          title={formatDate(
                            alert.created_at
                          )}
                        >
                          <Clock
                            size={14}
                          />

                          {getRelativeTime(
                            alert.created_at
                          )}
                        </span>


                        <span className="alert-type">

                          {type.replace(
                            /_/g,
                            " "
                          )}

                        </span>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="alert-actions">

                      {!alert.is_read && (

                        <button
                          className="alert-action-btn read-btn"
                          title="Mark as read"
                          onClick={() =>
                            handleMarkRead(
                              alert
                            )
                          }
                          disabled={
                            processingId ===
                            alert.id
                          }
                        >

                          <Check size={17} />

                        </button>

                      )}


                      <button
                        className="alert-action-btn delete-btn"
                        title="Delete alert"
                        onClick={() =>
                          handleDelete(
                            alert.id
                          )
                        }
                        disabled={
                          processingId ===
                          alert.id
                        }
                      >

                        <Trash2 size={17} />

                      </button>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

    </div>
  );
}