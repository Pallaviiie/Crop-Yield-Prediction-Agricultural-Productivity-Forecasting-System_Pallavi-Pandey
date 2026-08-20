import React from "react";
import { Eye, Pencil, Plus } from "lucide-react";
import ConsultantLayout from "../../components/consultant/ConsultantLayout";

const farmers = [
  ["Rajesh Kumar", "rajesh@farm.in", "Ludhiana, Punjab", "12 acres", "Wheat, Rice", "2024-03-15", "active"],
  ["Priya Sharma", "priya@farm.in", "Patna, Bihar", "8 acres", "Rice, Maize", "2024-04-02", "active"],
  ["Amit Singh", "amit@farm.in", "Bhopal, MP", "15 acres", "Soybean, Wheat", "2024-02-20", "inactive"],
  ["Sunita Devi", "sunita@farm.in", "Ahmedabad, Gujarat", "6 acres", "Cotton, Groundnut", "2024-05-10", "active"],
  ["Mohan Patel", "mohan@farm.in", "Nagpur, Maharashtra", "20 acres", "Orange, Soybean", "2024-01-08", "active"],
];

export default function FarmerManagement() {
  return (
    <ConsultantLayout title="Farmer Management">
      <div className="ys-page-row">
        <span className="ys-count">{farmers.length} farmers under management</span>
        <button className="ys-primary"><Plus size={16} /> Add Farmer</button>
      </div>

      <div className="ys-card ys-table-card">
        <table className="ys-table">
          <thead>
            <tr>
              <th>FARMER</th>
              <th>LOCATION</th>
              <th>FARM SIZE</th>
              <th>CROPS</th>
              <th>REGISTERED</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => {
              const [name, email, location, size, crops, registered, status] = farmer;
              return (
                <tr key={email}>
                  <td>
                    <div className="ys-farmer">
                      <div className="ys-avatar">{name[0]}</div>
                      <div>
                        <strong>{name}</strong>
                        <small>{email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{location}</td>
                  <td>{size}</td>
                  <td>{crops}</td>
                  <td>{registered}</td>
                  <td><span className={`ys-status ${status === "inactive" ? "inactive" : ""}`}>{status}</span></td>
                  <td>
                    <div className="ys-actions">
                      <button className="ys-action" title="View"><Eye size={16} /></button>
                      <button className="ys-action" title="Edit"><Pencil size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ConsultantLayout>
  );
}
