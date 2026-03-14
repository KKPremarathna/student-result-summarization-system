import { useState } from "react";
import LecturerLayout from "../../components/Layout/LecturerLayout.jsx";
import { 
  PlusCircle, 
  BookOpen, 
  Settings2, 
  Percent, 
  LayoutDashboard, 
  ChevronRight,
  ClipboardList
} from "lucide-react";

function AddSubject() {
  const [subjectDetails, setSubjectDetails] = useState({
    courseCode: "",
    batch: "",
    courseName: "",
    credit: "",
    assignments: "",
    labs: "",
    quizzes: "",
    percentAssignments: "",
    percentLabs: "",
    percentQuizzes: "",
    percentMid: "",
    percentEndExam: "",
  });

  const handleChange = (e) => {
    setSubjectDetails({ ...subjectDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subject Details:", subjectDetails);
    // Here you can call backend API to save subject details
  };

  return (
    <LecturerLayout>
      <div className="flex flex-col gap-8 pb-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#4F7C82] text-sm font-bold uppercase tracking-wider mb-2">
            <LayoutDashboard size={14} />
            <span>Lecturer Portal</span>
            <ChevronRight size={14} />
            <span className="text-[#0B2E33]">Course Management</span>
          </div>
          <h2 className="text-4xl font-black text-[#0B2E33] flex items-center gap-3">
            <PlusCircle className="text-[#4F7C82]" size={32} />
            Add New Subject
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Section 1: Core Details */}
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#B8E3E9]/30 rounded-2xl text-[#0B2E33]">
                <BookOpen size={24} />
              </div>
              <h3 className="text-2xl font-black text-[#0B2E33]">Course Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest pl-1">Course Code</label>
                <input
                  type="text"
                  name="courseCode"
                  value={subjectDetails.courseCode}
                  onChange={handleChange}
                  placeholder="e.g. EC9630"
                  className="w-full bg-[#B8E3E9]/10 border-2 border-transparent rounded-2xl py-4 px-6 text-[#0B2E33] font-bold outline-none focus:border-[#4F7C82] focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest pl-1">Batch</label>
                <input
                  type="text"
                  name="batch"
                  value={subjectDetails.batch}
                  onChange={handleChange}
                  placeholder="e.g. 2022"
                  className="w-full bg-[#B8E3E9]/10 border-2 border-transparent rounded-2xl py-4 px-6 text-[#0B2E33] font-bold outline-none focus:border-[#4F7C82] focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest pl-1">Course Name</label>
                <input
                  type="text"
                  name="courseName"
                  value={subjectDetails.courseName}
                  onChange={handleChange}
                  placeholder="e.g. Advanced Software Engineering"
                  className="w-full bg-[#B8E3E9]/10 border-2 border-transparent rounded-2xl py-4 px-6 text-[#0B2E33] font-bold outline-none focus:border-[#4F7C82] focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest pl-1">Credits</label>
                <input
                  type="number"
                  name="credit"
                  value={subjectDetails.credit}
                  onChange={handleChange}
                  placeholder="3"
                  className="w-full bg-[#B8E3E9]/10 border-2 border-transparent rounded-2xl py-4 px-6 text-[#0B2E33] font-bold outline-none focus:border-[#4F7C82] focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Component Structure */}
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#B8E3E9]/30 rounded-2xl text-[#0B2E33]">
                <Settings2 size={24} />
              </div>
              <h3 className="text-2xl font-black text-[#0B2E33]">Component Structure</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest pl-1">Assignments</label>
                <input
                  type="number"
                  name="assignments"
                  value={subjectDetails.assignments}
                  onChange={handleChange}
                  placeholder="No. of items"
                  className="w-full bg-[#B8E3E9]/10 border-2 border-transparent rounded-2xl py-4 px-6 text-[#0B2E33] font-bold outline-none focus:border-[#4F7C82] focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest pl-1">Labs</label>
                <input
                  type="number"
                  name="labs"
                  value={subjectDetails.labs}
                  onChange={handleChange}
                  placeholder="No. of items"
                  className="w-full bg-[#B8E3E9]/10 border-2 border-transparent rounded-2xl py-4 px-6 text-[#0B2E33] font-bold outline-none focus:border-[#4F7C82] focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-[#4F7C82] uppercase tracking-widest pl-1">Quizzes</label>
                <input
                  type="number"
                  name="quizzes"
                  value={subjectDetails.quizzes}
                  onChange={handleChange}
                  placeholder="No. of items"
                  className="w-full bg-[#B8E3E9]/10 border-2 border-transparent rounded-2xl py-4 px-6 text-[#0B2E33] font-bold outline-none focus:border-[#4F7C82] focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Evaluation Percentages */}
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#B8E3E9]/30 rounded-2xl text-[#0B2E33]">
                <Percent size={24} />
              </div>
              <h3 className="text-2xl font-black text-[#0B2E33]">Evaluation Weights</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { name: "percentAssignments", label: "Assignments" },
                { name: "percentLabs", label: "Labs" },
                { name: "percentQuizzes", label: "Quizzes" },
                { name: "percentMid", label: "Mid Exam" },
                { name: "percentEndExam", label: "End Exam" }
              ].map((field) => (
                <div key={field.name} className="space-y-3">
                  <label className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest pl-1">{field.label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      name={field.name}
                      value={subjectDetails[field.name]}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-[#B8E3E9]/10 border-2 border-transparent rounded-2xl py-4 pl-6 pr-10 text-[#0B2E33] font-bold outline-none focus:border-[#4F7C82] focus:bg-white transition-all shadow-inner"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4F7C82] font-black text-xs">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="bg-[#0B2E33] hover:bg-[#1a454c] text-white px-12 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              <ClipboardList size={24} />
              Register Subject
            </button>
          </div>
        </form>
      </div>
    </LecturerLayout>
  );
}

export default AddSubject;