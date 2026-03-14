import React, { useState } from "react";
import LecturerLayout from "../../components/Layout/LecturerLayout.jsx";
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
      <div className="flex flex-col gap-8 pb-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#4F7C82] text-sm font-bold uppercase tracking-wider mb-2">
              <LayoutDashboard size={14} />
              <span>Lecturer Portal</span>
              <ChevronRight size={14} />
              <span className="text-[#0B2E33]">Senate Submission</span>
            </div>
            <h2 className="text-4xl font-black text-[#0B2E33] flex items-center gap-3">
              <GraduationCap size={32} className="text-[#4F7C82]" />
              Final Result Compilation
            </h2>
          </div>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white border-2 border-[#E5F3F5] text-[#4F7C82] px-6 py-3 rounded-2xl font-black hover:bg-[#B8E3E9]/20 transition-all transform hover:-translate-y-1 shadow-lg">
              <Save size={18} />
              Save Draft
            </button>
            <button className="flex items-center gap-2 bg-[#0B2E33] hover:bg-[#1a454c] text-white px-6 py-3 rounded-2xl font-black transition-all transform hover:-translate-y-1 shadow-lg">
              <Send size={18} />
              Submit to Senate
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#B8E3E9]/30 rounded-lg text-[#0B2E33]">
              <Filter size={20} />
            </div>
            <h3 className="text-xl font-extrabold text-[#0B2E33]">Subject Context</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest flex items-center gap-2">
                <ClipboardCheck size={14} />
                Course Code
              </label>
              <select 
                defaultValue="CS101"
                className="w-full bg-[#B8E3E9]/10 border-none rounded-xl py-4 px-6 text-[#0B2E33] font-black outline-none focus:ring-2 focus:ring-[#4F7C82] transition-ring appearance-none"
              >
                <option value="CS101">CS101 - Introduction to Programming</option>
                <option value="CS102">CS102 - Data Structures</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest flex items-center gap-2">
                <GraduationCap size={14} />
                Batch
              </label>
              <select 
                defaultValue="2021"
                className="w-full bg-[#B8E3E9]/10 border-none rounded-xl py-4 px-6 text-[#0B2E33] font-black outline-none focus:ring-2 focus:ring-[#4F7C82] transition-ring appearance-none"
              >
                <option value="2021">Batch 2021 (Regular)</option>
                <option value="2022">Batch 2022 (Junior)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0B2E33] text-white">
                  <th className="py-6 px-8 text-left font-black text-sm uppercase tracking-widest">E Number</th>
                  <th className="py-6 px-8 text-center font-black text-sm uppercase tracking-widest">Incourse Marks</th>
                  <th className="py-6 px-8 text-center font-black text-sm uppercase tracking-widest">End Exam Marks</th>
                  <th className="py-6 px-8 text-center font-black text-sm uppercase tracking-widest">Final Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8E3E9]/30">
                {rows.map((row, index) => (
                  <tr key={index} className="hover:bg-[#B8E3E9]/10 transition-colors group">
                    <td className="py-5 px-8">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#4F7C82]/10 rounded-lg text-[#4F7C82]">
                            <User size={16} />
                          </div>
                          <input
                            type="text"
                            value={row.eNumber}
                            onChange={(e) => handleInputChange(index, 'eNumber', e.target.value)}
                            className="bg-transparent border-none font-black text-[#0B2E33] outline-none w-24"
                          />
                       </div>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <input
                        type="text"
                        value={row.incourse}
                        onChange={(e) => handleInputChange(index, 'incourse', e.target.value)}
                        className="bg-white/50 border border-transparent rounded-xl py-2 px-4 text-center font-bold text-[#4F7C82] w-20 focus:border-[#4F7C82] focus:bg-white outline-none transition-all"
                      />
                    </td>
                    <td className="py-5 px-8 text-center">
                      <input
                        type="text"
                        value={row.endExam}
                        onChange={(e) => handleInputChange(index, 'endExam', e.target.value)}
                        className="bg-white/50 border border-transparent rounded-xl py-2 px-4 text-center font-bold text-[#4F7C82] w-20 focus:border-[#4F7C82] focus:bg-white outline-none transition-all"
                      />
                    </td>
                    <td className="py-5 px-8 text-center">
                      <input
                        type="text"
                        value={row.grade}
                        onChange={(e) => handleInputChange(index, 'grade', e.target.value)}
                        className="bg-[#0B2E33]/5 border-2 border-transparent rounded-xl py-2 px-4 text-center font-black text-[#0B2E33] w-16 focus:border-[#0B2E33] focus:bg-white outline-none transition-all uppercase"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="flex items-center gap-4 text-[#4F7C82] bg-white/50 p-6 rounded-[2rem] border border-white">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Table size={24} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#93B1B5]">Quick Info</p>
            <p className="font-bold text-[#0B2E33]">Currently managing {rows.length} student records for the selected batch.</p>
          </div>
        </div>
      </div>
    </LecturerLayout>
  );
}

export default FinalResult;
