import React, { useState } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import "../styles/FinalResult.css";
import {
  Save,
  Send,
  Table,
  Filter,
  LayoutDashboard,
  ChevronRight,
  GraduationCap,
  ClipboardCheck,
  User
} from "lucide-react";

function FinalResult() {
  const [rows, setRows] = useState([
    { eNumber: "E001", incourse: "25", endExam: "50", grade: "A" },
    { eNumber: "E002", incourse: "20", endExam: "40", grade: "B" },
  ]);

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  return (
    <LecturerLayout>
      <div className="fr-page">

        {/* Page Header */}
        <div className="fr-header">
          <div>
            <div className="fr-breadcrumb">
              <LayoutDashboard size={14} />
              <span>Lecturer Portal</span>
              <ChevronRight size={14} />
              <span className="fr-breadcrumb__current">Senate Submission</span>
            </div>
            <h2 className="fr-title">
              <GraduationCap size={32} className="fr-title__icon" />
              Final Result Compilation
            </h2>
          </div>

          <div className="fr-header__actions">
            <button className="fr-btn fr-btn--outline">
              <Save size={18} />
              Save Draft
            </button>
            <button className="fr-btn fr-btn--primary">
              <Send size={18} />
              Submit to Senate
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="fr-card">
          <div className="fr-card__header">
            <div className="fr-card__icon-wrap">
              <Filter size={20} />
            </div>
            <h3 className="fr-card__title">Subject Context</h3>
          </div>

          <div className="fr-filters">
            <div className="fr-field">
              <label className="fr-label">
                <ClipboardCheck size={14} />
                Course Code
              </label>
              <select
                defaultValue="CS101"
                className="fr-select"
              >
                <option value="CS101">CS101 - Introduction to Programming</option>
                <option value="CS102">CS102 - Data Structures</option>
              </select>
            </div>

            <div className="fr-field">
              <label className="fr-label">
                <GraduationCap size={14} />
                Batch
              </label>
              <select
                defaultValue="2021"
                className="fr-select"
              >
                <option value="2021">Batch 2021 (Regular)</option>
                <option value="2022">Batch 2022 (Junior)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table Card */}
        <div className="fr-table-card">
          <div className="fr-table-scroll">
            <table className="fr-table">
              <thead>
                <tr className="fr-thead-row">
                  <th className="fr-th fr-th--left">E Number</th>
                  <th className="fr-th">Incourse Marks</th>
                  <th className="fr-th">End Exam Marks</th>
                  <th className="fr-th">Final Grade</th>
                </tr>
              </thead>
              <tbody className="fr-tbody">
                {rows.map((row, index) => (
                  <tr key={index} className="fr-row">
                    <td className="fr-td">
                      <div className="fr-enumber-cell">
                        <div className="fr-enumber-icon">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          value={row.eNumber}
                          onChange={(e) => handleInputChange(index, 'eNumber', e.target.value)}
                          className="fr-input fr-input--transparent"
                        />
                      </div>
                    </td>
                    <td className="fr-td fr-td--center">
                      <input
                        type="text"
                        value={row.incourse}
                        onChange={(e) => handleInputChange(index, 'incourse', e.target.value)}
                        className="fr-input fr-input--cell"
                      />
                    </td>
                    <td className="fr-td fr-td--center">
                      <input
                        type="text"
                        value={row.endExam}
                        onChange={(e) => handleInputChange(index, 'endExam', e.target.value)}
                        className="fr-input fr-input--cell"
                      />
                    </td>
                    <td className="fr-td fr-td--center">
                      <input
                        type="text"
                        value={row.grade}
                        onChange={(e) => handleInputChange(index, 'grade', e.target.value)}
                        className="fr-input fr-input--grade"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="fr-info-bar">
          <div className="fr-info-bar__icon-wrap">
            <Table size={24} />
          </div>
          <div>
            <p className="fr-info-bar__label">Quick Info</p>
            <p className="fr-info-bar__text">Currently managing {rows.length} student records for the selected batch.</p>
          </div>
        </div>
      </div>
    </LecturerLayout>
  );
}

export default FinalResult;
