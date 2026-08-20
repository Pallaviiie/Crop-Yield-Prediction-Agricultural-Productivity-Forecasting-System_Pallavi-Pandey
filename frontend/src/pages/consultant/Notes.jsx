import React from "react";
import { FileText } from "lucide-react";
import ConsultantLayout from "../../components/consultant/ConsultantLayout";

export default function Notes() {
  return (
    <ConsultantLayout title="Notes">
      <div className="ys-card ys-empty-card">
        <div>
          <div className="ys-empty-icon"><FileText size={31} /></div>
          <h2>My Notes</h2>
          <p>This section connects to the FastAPI backend. Add consultations via POST /consultations.</p>
        </div>
      </div>
    </ConsultantLayout>
  );
}
