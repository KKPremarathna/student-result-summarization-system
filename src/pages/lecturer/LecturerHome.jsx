import { useEffect, useState } from "react";
import LecturerLayout from "../../components/Layout/LecturerLayout.jsx";
import { getLecturerDetails } from "../../services/lecturerApi.js";
import profile from '../../assets/profile.png';
import dashboardBg from '../../assets/dashboard-bg.png';
import {
  User,
  BookOpen,
  GraduationCap,
  Settings,
  Bell,
  Search,
  LayoutDashboard,
  Calendar
} from "lucide-react";

function LecturerHome() {
  const [lecturer, setLecturer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example lecturer id
        const res = await getLecturerDetails("123");
        setLecturer(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <LecturerLayout>
      <div className="flex flex-col gap-8 pb-10">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 group h-80">
          <img
            src={dashboardBg}
            alt="Dashboard Background"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2E33]/90 via-[#0B2E33]/50 to-transparent flex flex-col justify-center px-12 text-white">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                Staff Dashboard
              </span>
              <span className="flex items-center gap-2 text-white/80 text-sm">
                <Calendar size={14} />
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2 drop-shadow-lg text-[#B8E3E9]">
              Welcome back, <span className="text-[#B8E3E9]">{lecturer?.name || "Mrs K.B Ranathunga"}</span>..!
            </h1>
            <p className="text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Your academic performance and subject management portal is up to date.
              Check your assigned modules and recent results below.
            </p>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-xl flex flex-col items-center text-center">
              <div className="relative group mb-8">
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#4F7C82] to-[#B8E3E9] rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={lecturer?.profileImage || profile}
                    alt="Lecturer Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-black text-[#0B2E33] mb-1">{lecturer?.name || "User Name"}</h2>
              <div className="flex items-center gap-2 text-[#4F7C82] font-bold text-sm uppercase tracking-wide mb-8 bg-[#B8E3E9]/20 px-4 py-1.5 rounded-full">
                <GraduationCap size={18} />
                {lecturer?.position || "Senior Lecturer"}
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#B8E3E9]/10 rounded-2xl border border-[#B8E3E9]/20">
                  <div className="flex items-center gap-3 text-[#4F7C82]">
                    <LayoutDashboard size={18} />
                    <span className="font-bold text-sm">Faculty</span>
                  </div>
                  <span className="text-[#0B2E33] font-extrabold">{lecturer?.faculty || "Faculty Of Engineering"}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#B8E3E9]/10 rounded-2xl border border-[#B8E3E9]/20">
                  <div className="flex items-center gap-3 text-[#4F7C82]">
                    <User size={18} />
                    <span className="font-bold text-sm">University</span>
                  </div>
                  <span className="text-[#0B2E33] font-extrabold">{lecturer?.university || "University Of Jaffna"}</span>
                </div>
              </div>

              {/* Quick Profile Actions */}
              <div className="mt-8 flex gap-3 w-full">
                <button className="flex-1 bg-[#0B2E33] hover:bg-[#1a454c] text-white py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2">
                  <Settings size={18} />
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Information Sections */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="bg-[#4F7C82] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                    <BookOpen size={28} />
                  </div>
                  <span className="text-white/60 font-black text-4xl">01</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-1 relative z-10">Total Subjects</h3>
                <p className="text-white/70 text-sm relative z-10 font-bold uppercase tracking-wide">Modules Managed</p>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              </div>

              <div className="bg-[#0B2E33] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Bell size={28} />
                  </div>
                  <span className="text-white/60 font-black text-4xl">04</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-1 relative z-10">Recent Activities</h3>
                <p className="text-white/70 text-sm relative z-10 font-bold uppercase tracking-wide">Pending Tasks</p>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            </div>

            {/* Assigned Subjects Detailed Section */}
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[#0B2E33] flex items-center gap-3">
                  <BookOpen className="text-[#4F7C82]" />
                  Assigned Subjects
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93B1B5]" size={16} />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    className="pl-10 pr-4 py-2 bg-[#B8E3E9]/20 border-none rounded-full text-sm font-bold text-[#0B2E33] focus:ring-2 focus:ring-[#4F7C82] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lecturer?.subjects?.length > 0 ? (
                  lecturer.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-4 p-5 bg-white border border-[#B8E3E9]/30 rounded-2xl hover:bg-[#B8E3E9]/10 hover:border-[#4F7C82]/30 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 bg-[#4F7C82]/10 text-[#4F7C82] rounded-xl flex items-center justify-center font-bold text-xl group-hover:bg-[#4F7C82] group-hover:text-white transition-colors">
                        {subject.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0B2E33] text-lg leading-tight">{subject}</h4>
                        <p className="text-[#93B1B5] text-xs font-bold uppercase tracking-wider mt-1">Academic Year 2024</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-12 flex flex-col items-center justify-center text-center bg-[#B8E3E9]/10 rounded-3xl border-2 border-dashed border-[#B8E3E9]/30">
                    <BookOpen size={48} className="text-[#B8E3E9] mb-4" />
                    <p className="text-[#0B2E33] font-black text-xl italic opacity-50">No subjects assigned yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </LecturerLayout>
  );
}

export default LecturerHome;
