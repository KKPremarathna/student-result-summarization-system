import React, { useState } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import "../styles/PendingResult.css";
import {
  FileText,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  LayoutDashboard,
  ChevronRight,
  Calendar,
  Clock,
  ArrowRight
} from "lucide-react";

function PendingResult() {
  const [selectedResult, setSelectedResult] = useState(null);
  const [pendingItems, setPendingItems] = useState([
    { id: 1, name: "Batch 2021 - CS101 Final Results", date: "2024-03-10", type: "Final" },
    { id: 2, name: "Batch 2022 - CS102 Mid Marks", date: "2024-03-12", type: "Mid" },
  ]);

  return (
    <LecturerLayout>
      <div className="pr-page">

        {/* Page Header */}
        <div className="pr-header">
          <div className="pr-breadcrumb">
            <LayoutDashboard size={14} />
            <span>Lecturer Portal</span>
            <ChevronRight size={14} />
            <span className="pr-breadcrumb__current">Senate Approvals</span>
          </div>
          <h2 className="pr-title">Pending Submissions</h2>
        </div>

        {!selectedResult ? (
          /* List View */
          <div className="pr-list">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedResult(item)}
                className="pr-item"
              >
                <div className="pr-item__decoration" />

                <div className="pr-item__body">
                  <div className="pr-item__top">
                    <div className="pr-item__icon-wrap">
                      <FileText size={32} />
                    </div>
                    <span className="pr-item__badge">
                      Waiting Confirmation
                    </span>
                  </div>

                  <h3 className="pr-item__name">{item.name}</h3>

                  <div className="pr-item__meta">
                    <div className="pr-item__meta-item">
                      <Calendar size={14} />
                      {item.date}
                    </div>
                    <div className="pr-item__meta-item">
                      <Clock size={14} />
                      2 days ago
                    </div>
                  </div>

                  <div className="pr-item__cta">
                    View Details
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Detail View */
          <div className="pr-detail">
            <button
              className="pr-back-btn"
              onClick={() => setSelectedResult(null)}
            >
              <ChevronLeft size={16} />
              Return to Submissions
            </button>

            <div className="pr-detail-card">
              <div className="pr-detail-card__header">
                <div>
                  <h3 className="pr-detail-card__title">{selectedResult.name}</h3>
                  <p className="pr-detail-card__subtitle">Generated on {selectedResult.date}</p>
                </div>
                <div className="pr-detail-card__header-icon">
                  <FileText size={40} />
                </div>
              </div>

              <div className="pr-preview">
                <div className="pr-preview__icon-wrap">
                  <FileText size={40} className="pr-preview__icon" />
                </div>
                <h4 className="pr-preview__title">Document Content Preview</h4>
                <p className="pr-preview__body">
                  "This section would render a detailed summary of all marks, batch details, and statistical distributions for the selected module before final sign-off."
                </p>

                <div className="pr-status-grid">
                  <div className="pr-status-item pr-status-item--warning">
                    <AlertCircle className="pr-status-item__icon--warning" size={20} />
                    <div>
                      <p className="pr-status-item__label pr-status-item__label--warning">Action Needed</p>
                      <p className="pr-status-item__value pr-status-item__value--warning">Audit Marks</p>
                    </div>
                  </div>
                  <div className="pr-status-item pr-status-item--info">
                    <Clock className="pr-status-item__icon--info" size={20} />
                    <div>
                      <p className="pr-status-item__label pr-status-item__label--info">Expiration</p>
                      <p className="pr-status-item__value pr-status-item__value--info">48h Left</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pr-detail-card__footer">
                <p className="pr-detail-card__footer-note">
                  <AlertCircle size={16} />
                  Please verify all data before signing.
                </p>
                <div className="pr-detail-card__footer-actions">
                  <button className="pr-btn pr-btn--complaint">
                    <AlertCircle size={18} />
                    Raise Complaint
                  </button>
                  <button className="pr-btn pr-btn--approve">
                    <CheckCircle size={20} />
                    Approve &amp; Sign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

export default PendingResult;
