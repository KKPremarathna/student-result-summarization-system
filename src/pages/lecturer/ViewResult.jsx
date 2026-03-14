import { useState, useEffect } from "react";
import LecturerLayout from "../../components/Layout/LecturerLayout.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  FileDown, 
  Filter, 
  Search, 
  GraduationCap, 
  LayoutDashboard, 
  ClipboardCheck,
  ChevronRight
} from "lucide-react";

function ViewResult() {
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [eNumber, setENumber] = useState("");
  const [results, setResults] = useState([]);

  // Default structure for frontend before backend
  const [structure, setStructure] = useState({
    assignments: 3,
    quizzes: 2,
    labs: 4
  });

  const API = "http://localhost:5000/api";

  useEffect(() => {
    axios.get(`${API}/marks/structure`)
      .then(res => setStructure(res.data))
      .catch(err => console.warn("Backend not connected, showing default table"));
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API}/marks/filter`, {
        params: { course, batch, eNumber }
      });
      setResults(res.data);
    } catch (err) {
      console.warn("Backend not connected, results will be empty");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const columns = [];
    const rows = [];

    columns.push("E.No");
    for (let i = 1; i <= structure.assignments; i++) columns.push(`A${i}`);
    for (let i = 1; i <= structure.quizzes; i++) columns.push(`Q${i}`);
    for (let i = 1; i <= structure.labs; i++) columns.push(`L${i}`);
    columns.push("Mid", "Incourse", "End Marks", "Before Senate", "After Senate");

    results.forEach(r => {
      rows.push([
        r.eNumber,
        ...r.assignments,
        ...r.quizzes,
        ...r.labs,
        r.mid,
        r.incourse,
        r.endMarks,
        r.beforeSenate,
        r.afterSenate
      ]);
    });

    autoTable(doc, { head: [columns], body: rows });
    doc.save("results.pdf");
  };

  const defaultRows = [...Array(5)].map((_, idx) => ({
    eNumber: `E00${idx + 1}`,
    assignments: Array(structure.assignments).fill("***"),
    quizzes: Array(structure.quizzes).fill("***"),
    labs: Array(structure.labs).fill("***"),
    mid: "***",
    incourse: "***",
    endMarks:"***",
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
              <span className="text-[#0B2E33]">View Results</span>
            </div>
            <h2 className="text-4xl font-black text-[#0B2E33]">Academic Results</h2>
          </div>
          
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-[#0B2E33] hover:bg-[#1a454c] text-white px-6 py-3 rounded-2xl font-bold transition-all transform hover:-translate-y-1 shadow-lg"
          >
            <FileDown size={20} />
            Export to PDF
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#B8E3E9]/30 rounded-lg text-[#0B2E33]">
              <Filter size={20} />
            </div>
            <h3 className="text-xl font-extrabold text-[#0B2E33]">Search Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest flex items-center gap-2">
                <ClipboardCheck size={14} />
                Course Code
              </label>
              <select 
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-[#B8E3E9]/10 border-none rounded-xl py-3 px-4 text-[#0B2E33] font-bold outline-none focus:ring-2 focus:ring-[#4F7C82] transition-ring"
              >
                <option value="">Select Course</option>
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
                className="w-full bg-[#B8E3E9]/10 border-none rounded-xl py-3 px-4 text-[#0B2E33] font-bold outline-none focus:ring-2 focus:ring-[#4F7C82] transition-ring"
              >
                <option value="">Select Batch</option>
                <option>2021</option>
                <option>2022</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest flex items-center gap-2">
                <Search size={14} />
                E Number
              </label>
              <select 
                onChange={(e) => setENumber(e.target.value)}
                className="w-full bg-[#B8E3E9]/10 border-none rounded-xl py-3 px-4 text-[#0B2E33] font-bold outline-none focus:ring-2 focus:ring-[#4F7C82] transition-ring"
              >
                <option value="">Select E.No</option>
                <option>E001</option>
                <option>E002</option>
              </select>
            </div>

            <button 
              onClick={fetchResults}
              className="bg-[#4F7C82] hover:bg-[#3d646a] text-white py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Apply Filter
            </button>
          </div>
        </div>

        {/* Results Table Card */}
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
                  <th rowSpan="2" className="py-6 px-4 font-extrabold text-sm uppercase tracking-wider border-r border-white/10">Incourse</th>
                  <th rowSpan="2" className="py-6 px-4 font-extrabold text-sm uppercase tracking-wider border-r border-white/10">End</th>
                  <th colSpan="2" className="py-4 px-4 font-extrabold text-sm uppercase tracking-wider border-b border-white/10">Senate Results</th>
                </tr>
                <tr className="bg-[#1a454c] text-white/90">
                  {[...Array(structure.assignments)].map((_, i) => <th key={i} className="py-3 px-4 text-xs font-bold border-r border-white/10">A{i + 1}</th>)}
                  {[...Array(structure.quizzes)].map((_, i) => <th key={i} className="py-3 px-4 text-xs font-bold border-r border-white/10">Q{i + 1}</th>)}
                  {[...Array(structure.labs)].map((_, i) => <th key={i} className="py-3 px-4 text-xs font-bold border-r border-white/10">L{i + 1}</th>)}
                  <th className="py-3 px-4 text-xs font-bold border-r border-white/10">Before</th>
                  <th className="py-3 px-4 text-xs font-bold">After</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#B8E3E9]/30">
                {tableRows.map((r, index) => (
                  <tr key={index} className="hover:bg-[#B8E3E9]/10 transition-colors group">
                    <td className="py-4 px-4 text-center text-[#0B2E33] font-black group-hover:bg-[#B8E3E9]/20">{r.eNumber}</td>
                    {r.assignments.map((a, i) => <td key={i} className="py-4 px-4 text-center text-[#4F7C82] font-medium">{a}</td>)}
                    {r.quizzes.map((q, i) => <td key={i} className="py-4 px-4 text-center text-[#4F7C82] font-medium">{q}</td>)}
                    {r.labs.map((l, i) => <td key={i} className="py-4 px-4 text-center text-[#4F7C82] font-medium">{l}</td>)}
                    <td className="py-4 px-4 text-center text-[#0B2E33] font-bold">{r.mid}</td>
                    <td className="py-4 px-4 text-center text-[#0B2E33] font-bold bg-[#B8E3E9]/5">{r.incourse}</td>
                    <td className="py-4 px-4 text-center text-[#0B2E33] font-bold">{r.endMarks}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.beforeSenate === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {r.beforeSenate}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.afterSenate === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {r.afterSenate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </LecturerLayout>
  );
}

export default ViewResult;