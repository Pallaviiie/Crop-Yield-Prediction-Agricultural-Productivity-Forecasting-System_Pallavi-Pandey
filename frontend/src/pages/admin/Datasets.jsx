import React, { useEffect, useState } from "react";
import {
  Database,
  RefreshCw,
  Search,
  Trash2,
  Plus,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

import {
  getAdminDatasets,
  createAdminDataset,
  deleteAdminDataset,
} from "../../services/adminApi";

import "../../styles/admin/Datasets.css";

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    records: "",
    columns: "",
  });

  /* =========================
     LOAD DATASETS
  ========================= */

  const loadDatasets = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDatasets();

      const datasetList = Array.isArray(data)
        ? data
        : data?.datasets || data?.data || [];

      setDatasets(datasetList);
    } catch (err) {
      console.error("Dataset loading error:", err);
      setError(
        err.message || "Unable to load datasets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  /* =========================
     FORM HANDLING
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      type: "",
      description: "",
      records: "",
      columns: "",
    });
  };

  const openModal = () => {
    resetForm();
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  /* =========================
     CREATE DATASET
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter dataset name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        type: form.type.trim(),
        description: form.description.trim(),
        records: Number(form.records) || 0,
        columns: Number(form.columns) || 0,
      };

      await createAdminDataset(payload);

      setShowModal(false);
      resetForm();

      await loadDatasets();
    } catch (err) {
      console.error("Create dataset error:", err);

      alert(
        err.message || "Unable to create dataset."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE DATASET
  ========================= */

  const handleDelete = async (dataset) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${dataset.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteAdminDataset(dataset.id);

      await loadDatasets();
    } catch (err) {
      console.error("Delete dataset error:", err);

      alert(
        err.message || "Unable to delete dataset."
      );
    }
  };

  /* =========================
     SEARCH
  ========================= */

  const filteredDatasets = datasets.filter((dataset) => {
    const searchText = search.toLowerCase();

    return (
      String(dataset.name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(dataset.type || "")
        .toLowerCase()
        .includes(searchText) ||
      String(dataset.description || "")
        .toLowerCase()
        .includes(searchText) ||
      String(dataset.status || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  /* =========================
     FORMAT NUMBERS
  ========================= */

  const formatNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "0";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return number.toLocaleString("en-IN");
  };

  /* =========================
     STATUS
  ========================= */

  const isActive = (dataset) => {
    return (
      String(dataset.status || "active")
        .toLowerCase() === "active"
    );
  };

  return (
    <div className="admin-datasets-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-page-header">
        <div>
          <h1>Dataset Management</h1>

          <p>
            Manage datasets used by the YieldSense AI
            platform.
          </p>
        </div>

        <div className="dataset-header-actions">
          <button
            type="button"
            className="dataset-refresh"
            onClick={loadDatasets}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={
                loading ? "admin-spin" : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            className="dataset-add-button"
            onClick={openModal}
          >
            <Plus size={18} />

            Add Dataset
          </button>
        </div>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="dataset-error">
          <AlertCircle size={18} />

          <span>{error}</span>
        </div>
      )}

      {/* =========================
          SEARCH
      ========================= */}

      <div className="dataset-toolbar">

        <div className="dataset-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search datasets..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="dataset-count">
          {filteredDatasets.length}{" "}
          {filteredDatasets.length === 1
            ? "Dataset"
            : "Datasets"}
        </div>
      </div>

      {/* =========================
          DATASET TABLE
      ========================= */}

      <div className="dataset-card">

        {loading ? (
          <div className="dataset-loading">
            <RefreshCw
              size={28}
              className="admin-spin"
            />

            <span>
              Loading datasets...
            </span>
          </div>
        ) : filteredDatasets.length === 0 ? (
          <div className="dataset-empty">
            <div className="dataset-empty-icon">
              <Database size={40} />
            </div>

            <h3>
              No datasets found
            </h3>

            <p>
              {search
                ? "No datasets match your search."
                : "No datasets are available yet."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openModal}
                className="dataset-empty-button"
              >
                <Plus size={17} />

                Add Dataset
              </button>
            )}
          </div>
        ) : (
          <div className="dataset-table-wrapper">

            <table className="dataset-table">

              <thead>
                <tr>
                  <th>Dataset</th>
                  <th>Type</th>
                  <th>Records</th>
                  <th>Columns</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredDatasets.map(
                  (dataset, index) => (
                    <tr
                      key={
                        dataset.id || index
                      }
                    >

                      {/* DATASET */}

                      <td>
                        <div className="dataset-name-cell">

                          <div className="dataset-icon">
                            <Database size={19} />
                          </div>

                          <div>
                            <strong>
                              {dataset.name ||
                                "Unnamed Dataset"}
                            </strong>

                            {dataset.description && (
                              <span>
                                {
                                  dataset.description
                                }
                              </span>
                            )}
                          </div>

                        </div>
                      </td>

                      {/* TYPE */}

                      <td>
                        <span className="dataset-type">
                          {dataset.type ||
                            "Dataset"}
                        </span>
                      </td>

                      {/* RECORDS */}

                      <td>
                        <div className="dataset-number">
                          <FileText
                            size={16}
                          />

                          {formatNumber(
                            dataset.records
                          )}
                        </div>
                      </td>

                      {/* COLUMNS */}

                      <td>
                        <span className="dataset-columns">
                          {formatNumber(
                            dataset.columns
                          )}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`dataset-status ${
                            isActive(dataset)
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {isActive(dataset) ? (
                            <CheckCircle
                              size={15}
                            />
                          ) : (
                            <AlertCircle
                              size={15}
                            />
                          )}

                          {dataset.status ||
                            "Active"}
                        </span>
                      </td>

                      {/* CREATED */}

                      <td>
                        <span className="dataset-date">
                          {dataset.created_at
                            ? new Date(
                                dataset.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "—"}
                        </span>
                      </td>

                      {/* DELETE */}

                      <td>
                        <button
                          type="button"
                          className="dataset-delete"
                          title="Delete dataset"
                          onClick={() =>
                            handleDelete(
                              dataset
                            )
                          }
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =========================
          ADD DATASET MODAL
      ========================= */}

      {showModal && (
        <div
          className="dataset-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="dataset-modal">

            {/* MODAL HEADER */}

            <div className="dataset-modal-header">

              <div>
                <h2>
                  Add Dataset
                </h2>

                <p>
                  Add dataset information to
                  the admin panel.
                </p>
              </div>

              <button
                type="button"
                className="dataset-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="dataset-form"
            >

              <div className="dataset-form-group">
                <label>
                  Dataset Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Crop Yield"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dataset-form-group">
                <label>
                  Dataset Type
                </label>

                <input
                  type="text"
                  name="type"
                  placeholder="e.g. CSV"
                  value={form.type}
                  onChange={handleChange}
                />
              </div>

              <div className="dataset-form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe this dataset..."
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="dataset-form-row">

                <div className="dataset-form-group">
                  <label>
                    Records
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="records"
                    placeholder="0"
                    value={
                      form.records
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="dataset-form-group">
                  <label>
                    Columns
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="columns"
                    placeholder="0"
                    value={
                      form.columns
                    }
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* FORM ACTIONS */}

              <div className="dataset-form-actions">

                <button
                  type="button"
                  className="dataset-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="dataset-save-button"
                  disabled={saving}
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
                      <Plus size={17} />

                      Add Dataset
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

export default Datasets;