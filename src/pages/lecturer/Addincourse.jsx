import { useState, useEffect } from "react";
import LecturerLayout from "../../components/Layout/LecturerLayout.jsx";
import axios from "axios";
import { 
  Save, 
  Filter, 
  Search, 
  GraduationCap, 
  LayoutDashboard, 
  ChevronRight,
  ClipboardCheck,
  Edit3
} from "lucide-react";

function AddIncourse() {
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [eNumber, setENumber] = useState("");
  const [results, setResults] = useState([]);

  const [structure, setStructure] = useState({
    assignments: 3,
    quizzes: 2,
    labs: 4
  });

  const API = "http://localhost:5000/api";

  useEffect(() => {
    axios.get(`${API}/marks/structure`)
      .then(res => setStructure(res.data))
      .catch(() => console.warn("Backend not connected, using default structure"));
  }, []);

  const defaultRows = [...Array(5)].map((_, idx) => ({
    eNumber: `E00${idx + 1}`,
    assignments: Array(structure.assignments).fill(""),
    quizzes: Array(structure.quizzes).fill(""),
    labs: Array(structure.labs).fill(""),
    mid: "",
    incourse: "",
    endMarks: "",
    beforeSenate: "Pending",
    afterSenate: "Pending"
  }));

  const tableRows = results.length > 0 ? results : defaultRows;

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
              <span className="text-[#0B2E33]">Result Entry</span>
            </div>
            <h2 className="text-4xl font-black text-[#0B2E33] flex items-center gap-3">
              <Edit3 size={32} className="text-[#4F7C82]" />
              Add Incourse Marks
            </h2>
          </div>
          
          <button className="flex items-center gap-2 bg-[#0B2E33] hover:bg-[#1a454c] text-white px-8 py-4 rounded-2xl font-black transition-all transform hover:-translate-y-1 shadow-2xl">
            <Save size={20} />
            Save Changes
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#B8E3E9]/30 rounded-lg text-[#0B2E33]">
              <Filter size={20} />
            </div>
            <h3 className="text-xl font-extrabold text-[#0B2E33]">Selection Criteria</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest flex items-center gap-2">
                <ClipboardCheck size={14} />
                Course Code
              </label>
              <select 
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-[#B8E3E9]/10 border-none rounded-xl py-3 px-4 text-[#0B2E33] font-bold outline-none focus:ring-2 focus:ring-[#4F7C82] transition-ring appearance-none"
              >
                <option>Select Course</option>
                <option>EC9630</option>
                <option>EC6060</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest flex items-center gap-2">
                <GraduationCap size={14} />
                Batch
              </label>
              <select 
                onChange={(e) => setBatch(e.target.value)}
                className="w-full bg-[#B8E3E9]/10 border-none rounded-xl py-3 px-4 text-[#0B2E33] font-bold outline-none focus:ring-2 focus:ring-[#4F7C82] transition-ring appearance-none"
              >
                <option>Select Batch</option>
                <option>2021</option>
                <option>2022</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest flex items-center gap-2">
                <Search size={14} />
                E Number (Optional)
              </label>
              <select 
                onChange={(e) => setENumber(e.target.value)}
                className="w-full bg-[#B8E3E9]/10 border-none rounded-xl py-3 px-4 text-[#0B2E33] font-bold outline-none focus:ring-2 focus:ring-[#4F7C82] transition-ring appearance-none"
              >
                <option>Select E.No</option>
                <option>E001</option>
                <option>E002</option>
              </select>
            </div>
          </div>
        </div>

        {/* Entry Table Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0B2E33] text-white">
                  <th rowSpan="2" className="py-6 px-4 font-extrabold text-sm uppercase tracking-wider border-r border-white/10">E.No</th>
                  <th colSpan={structure.assignments} className="py-4 px-4 font-extrabold text-sm uppercase tracking-wider border-b border-white/10 border-r border-white/10">Assignments</th>
                  <th colSpan={structure.quizzes} className="py-4 px-4 font-extrabold text-sm uppercase tracking-wider border-b border-white/10 border-r border-white/10">Quizzes</th>
                  <th colSpan={structure.labs} className="py-4 px-4 font-extrabold text-sm uppercase tracking-wider border-b border-white/10 border-r border-white/10">Labs</th>
                  <th rowSpan="2" className="py-6 px-4 font-extrabold text-sm uppercase tracking-wider border-r border-white/10">Mid</th>
                  <th rowSpan="2" className="py-6 px-4 font-extrabold text-sm uppercase tracking-wider border-r border-white/10">Incr.</th>
                  <th rowSpan="2" className="py-6 px-4 font-extrabold text-sm uppercase tracking-wider border-r border-white/10">End</th>
                  <th colSpan="2" className="py-4 px-4 font-extrabold text-sm uppercase tracking-wider border-b border-white/10">Senate Status</th>
                </tr>
                <tr className="bg-[#1a454c] text-white/90">
                  {[...Array(structure.assignments)].map((_, i) => <th key={i} className="py-3 px-2 text-[10px] font-black border-r border-white/10">A{i + 1}</th>)}
                  {[...Array(structure.quizzes)].map((_, i) => <th key={i} className="py-3 px-2 text-[10px] font-black border-r border-white/10">Q{i + 1}</th>)}
                  {[...Array(structure.labs)].map((_, i) => <th key={i} className="py-3 px-2 text-[10px] font-black border-r border-white/10">L{i + 1}</th>)}
                  <th className="py-3 px-4 text-[10px] font-black border-r border-white/10">Before</th>
                  <th className="py-3 px-4 text-[10px] font-black">After</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#B8E3E9]/30">
                {tableRows.map((r, index) => (
                  <tr key={index} className="hover:bg-[#B8E3E9]/10 transition-colors group">
                    <td className="py-4 px-4 text-center text-[#0B2E33] font-black bg-[#B8E3E9]/5">{r.eNumber}</td>
                    
                    {r.assignments.map((a, i) => (
                      <td key={i} className="p-2 border-r border-[#B8E3E9]/20">
                        <input 
                          type="number" 
                          defaultValue={a} 
                          placeholder="-"
                          className="w-full bg-white/50 border border-transparent rounded-lg py-2 px-1 text-center font-bold text-[#0B2E33] focus:border-[#4F7C82] focus:bg-white outline-none transition-all"
                        />
                      </td>
                    ))}

                    {r.quizzes.map((q, i) => (
                      <td key={i} className="p-2 border-r border-[#B8E3E9]/20">
                        <input 
                          type="number" 
                          defaultValue={q} 
                          placeholder="-"
                          className="w-full bg-white/50 border border-transparent rounded-lg py-2 px-1 text-center font-bold text-[#0B2E33] focus:border-[#4F7C82] focus:bg-white outline-none transition-all"
                        />
                      </td>
                    ))}

                    {r.labs.map((l, i) => (
                      <td key={i} className="p-2 border-r border-[#B8E3E9]/20">
                        <input 
                          type="number" 
                          defaultValue={l} 
                          placeholder="-"
                          className="w-full bg-white/50 border border-transparent rounded-lg py-2 px-1 text-center font-bold text-[#0B2E33] focus:border-[#4F7C82] focus:bg-white outline-none transition-all"
                        />
                      </td>
                    ))}

                    <td className="p-2 border-r border-[#B8E3E9]/20">
                      <input 
                        type="number" 
                        defaultValue={r.mid} 
                        placeholder="-"
                        className="w-full bg-[#4F7C82]/5 border border-transparent rounded-lg py-2 px-1 text-center font-black text-[#0B2E33] focus:border-[#4F7C82] focus:bg-white outline-none transition-all"
                      />
                    </td>

                    <td className="py-4 px-4 text-center text-[#0B2E33] font-black bg-[#B8E3E9]/20">{r.incourse}</td>

                    <td className="p-2 border-r border-[#B8E3E9]/20 font-black">
                      <input 
                        type="number" 
                        defaultValue={r.endMarks} 
                        placeholder="-"
                        className="w-full bg-[#0B2E33]/5 border border-transparent rounded-lg py-2 px-1 text-center font-black text-[#0B2E33] focus:border-[#4F7C82] focus:bg-white outline-none transition-all"
                      />
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="text-[10px] font-black text-[#4F7C82] uppercase tracking-tighter">{r.beforeSenate}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[10px] font-black text-[#4F7C82] uppercase tracking-tighter">{r.afterSenate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center bg-[#0B2E33] p-6 rounded-[2rem] text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <ClipboardCheck size={24} className="text-[#B8E3E9]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#B8E3E9] uppercase tracking-widest">Global Status</p>
              <p className="text-lg font-black">All marks strictly validated against course structure</p>
            </div>
          </div>
          <button className="bg-white text-[#0B2E33] hover:bg-[#B8E3E9] px-10 py-3 rounded-xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-lg">
            Finalize Marks
          </button>
        </div>

      </div>
    </LecturerLayout>
  );
}

export default AddIncourse;