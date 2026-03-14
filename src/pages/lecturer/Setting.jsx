import React, { useState } from "react";
import LecturerLayout from "../../components/Layout/LecturerLayout.jsx";
import { 
  Settings, 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Key, 
  X, 
  ChevronRight, 
  LayoutDashboard,
  Building2,
  Fingerprint
} from "lucide-react";

function Setting() {
  const [userData, setUserData] = useState({
    name: "Mrs K.B Ranathunga",
    email: "kb.ranathunga@uok.lk",
    department: "Computer Science",
    lecturerId: "LEC-CS-1234"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <LecturerLayout>
      <div className="flex flex-col gap-8 pb-10 max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#4F7C82] text-sm font-bold uppercase tracking-wider mb-2">
            <LayoutDashboard size={14} />
            <span>Lecturer Portal</span>
            <ChevronRight size={14} />
            <span className="text-[#0B2E33]">Account Settings</span>
          </div>
          <h2 className="text-4xl font-black text-[#0B2E33] flex items-center gap-3">
            <Settings size={32} className="text-[#4F7C82]" />
            Settings & Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] p-10 shadow-xl flex flex-col items-center text-center sticky top-8">
              <div className="relative group mb-6">
                <div className="w-40 h-40 rounded-full border-4 border-[#B8E3E9] p-1 shadow-2xl overflow-hidden bg-white">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
                <button className="absolute bottom-2 right-2 p-3 bg-[#0B2E33] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all">
                  <Camera size={20} />
                </button>
              </div>
              
              <h3 className="text-2xl font-black text-[#0B2E33] mb-1">{userData.name}</h3>
              <p className="text-[#4F7C82] font-bold text-sm uppercase tracking-widest mb-6">Senior Lecturer</p>
              
              <div className="w-full h-px bg-[#B8E3E9]/30 mb-6" />
              
              <button className="w-full py-4 px-6 bg-[#0B2E33] text-white rounded-2xl font-black hover:bg-[#1a454c] transition-all transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-3 mb-3">
                <User size={18} />
                Edit Profile
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 px-6 bg-white border-2 border-[#E5F3F5] text-[#4F7C82] rounded-2xl font-black hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all flex items-center justify-center gap-2"
              >
                <Key size={18} />
                Security Keys
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Account Info Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#B8E3E9]/30 rounded-2xl text-[#0B2E33]">
                  <Fingerprint size={24} />
                </div>
                <h3 className="text-2xl font-black text-[#0B2E33]">Personal Information</h3>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
                  <div>
                    <p className="text-xs font-black text-[#93B1B5] uppercase tracking-widest mb-1 flex items-center gap-2">
                      <User size={12} />
                      Display Name
                    </p>
                    <p className="text-xl font-bold text-[#0B2E33]">{userData.name}</p>
                  </div>
                  <ChevronRight size={20} className="text-[#B8E3E9] hidden sm:block group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="w-full h-px bg-[#B8E3E9]/20" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
                  <div>
                    <p className="text-xs font-black text-[#93B1B5] uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Mail size={12} />
                      Email Address
                    </p>
                    <p className="text-xl font-bold text-[#0B2E33]">{userData.email}</p>
                  </div>
                  <ChevronRight size={20} className="text-[#B8E3E9] hidden sm:block group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="w-full h-px bg-[#B8E3E9]/20" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
                  <div>
                    <p className="text-xs font-black text-[#93B1B5] uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Building2 size={12} />
                      Academic Department
                    </p>
                    <p className="text-xl font-bold text-[#0B2E33]">{userData.department}</p>
                  </div>
                  <ChevronRight size={20} className="text-[#B8E3E9] hidden sm:block group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="w-full h-px bg-[#B8E3E9]/20" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
                  <div>
                    <p className="text-xs font-black text-[#93B1B5] uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Shield size={12} />
                      Lecturer ID
                    </p>
                    <code className="text-lg font-black text-[#4F7C82] bg-[#B8E3E9]/20 px-4 py-1 rounded-lg">
                      {userData.lecturerId}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-[#0B2E33] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4 text-[#B8E3E9]">
                  <Shield size={28} />
                  <h4 className="text-2xl font-black">Privacy & Security</h4>
                </div>
                <p className="text-white/70 font-medium mb-6 leading-relaxed">
                  Protect your academic account using encrypted authentication methods and two-factor verification.
                </p>
                <button 
                   onClick={() => setIsModalOpen(true)}
                  className="bg-[#B8E3E9] text-[#0B2E33] px-8 py-3 rounded-xl font-black hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Manage Passwords
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#0B2E33]/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            
            <div className="relative bg-white lg:w-[480px] w-full rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <button 
                className="absolute top-8 right-8 p-2 bg-[#F8FBFC] rounded-full text-[#4F7C82] hover:bg-[#B8E3E9] hover:text-[#0B2E33] transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mb-10">
                <div className="p-5 bg-[#B8E3E9]/30 rounded-[2rem] text-[#0B2E33] mb-6">
                  <Key size={32} />
                </div>
                <h3 className="text-3xl font-black text-[#0B2E33]">Security Update</h3>
                <p className="text-[#4F7C82] font-bold text-sm mt-2">Create a strong password to protect results</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#93B1B5] uppercase tracking-[0.2em] pl-1">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-[#B8E3E9]/10 border-2 border-transparent focus:border-[#4F7C82] rounded-2xl py-4 px-6 font-bold text-[#0B2E33] outline-none transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#93B1B5] uppercase tracking-[0.2em] pl-1">New Secure Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-[#B8E3E9]/10 border-2 border-transparent focus:border-[#4F7C82] rounded-2xl py-4 px-6 font-bold text-[#0B2E33] outline-none transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4">
                  <button className="w-full py-5 bg-[#0B2E33] text-white rounded-[2rem] font-black text-xl hover:bg-[#1a454c] transition-all transform hover:-translate-y-1 shadow-2xl">
                    Revoke & Secure
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

export default Setting;
