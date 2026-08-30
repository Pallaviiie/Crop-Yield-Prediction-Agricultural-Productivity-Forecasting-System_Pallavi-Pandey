import React, { useEffect, useState } from "react";
import { Eye, Pencil, Plus } from "lucide-react";
import ConsultantLayout from "../../components/consultant/ConsultantLayout";
import { getConsultantFarmers } from "../../services/api";

export default function FarmerManagement() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFarmers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getConsultantFarmers();

        setFarmers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load farmers:", err);
        setError(
          err.message || "Failed to load registered farmers."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFarmers();
  }, []);

  return (
    <ConsultantLayout title="Farmer Management">
      <div className="ys-page-row">
        <span className="ys-count">
          {loading
            ? "Loading farmers..."
            : `${farmers.length} registered farmers`}
        </span>

        <button className="ys-primary">
          <Plus size={16} />
          Add Farmer
        </button>
      </div>

      {error && (
        <div className="ys-card">
          <p>{error}</p>
        </div>
      )}

      <div className="ys-card ys-table-card">
        {loading ? (
          <div style={{ padding: "30px" }}>
            Loading registered farmers...
          </div>
        ) : farmers.length === 0 ? (
          <div style={{ padding: "30px" }}>
            No registered farmers found.
          </div>
        ) : (
          <table className="ys-table">
            <thead>
              <tr>
                <th>FARMER</th>
                <th>LOCATION</th>
                <th>PHONE</th>
                <th>STATE</th>
                <th>ROLE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {farmers.map((farmer) => (
                <tr key={farmer.id}>
                  <td>
                    <div className="ys-farmer">
                      <div className="ys-avatar">
                        {farmer.full_name
                          ? farmer.full_name.charAt(0).toUpperCase()
                          : "F"}
                      </div>

                      <div>
                        <strong>
                          {farmer.full_name || "Unknown Farmer"}
                        </strong>

                        <small>
                          {farmer.email || "No email"}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>
                    {farmer.location || "Not provided"}
                  </td>

                  <td>
                    {farmer.phone || "Not provided"}
                  </td>

                  <td>
                    {farmer.state || "Not provided"}
                  </td>

                  <td>
                    <span className="ys-status">
                      {farmer.role}
                    </span>
                  </td>

                  <td>
                    <div className="ys-actions">
                      <button
                        className="ys-action"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="ys-action"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ConsultantLayout>
  );
}