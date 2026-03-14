import React, { useState } from "react";
import LecturerLayout from "../../components/Layout/LecturerLayout.jsx";
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
      <div className="flex flex-col gap-8 pb-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#4F7C82] text-sm font-bold uppercase tracking-wider mb-2">
            <LayoutDashboard size={14} />
            <span>Lecturer Portal</span>
            <ChevronRight size={14} />
            <span className="text-[#0B2E33]">Senate Approvals</span>
          </div>
          <h2 className="text-4xl font-black text-[#0B2E33]">Pending Submissions</h2>
        </div>

        {!selectedResult ? (
          /* List View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedResult(item)}
                className="group relative bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden transform hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8E3E9]/20 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-[#4F7C82]/20 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-[#B8E3E9]/30 rounded-2xl text-[#0B2E33] group-hover:bg-[#0B2E33] group-hover:text-white transition-all">
                      <FileText size={32} />
                    </div>
                    <span className="px-4 py-1.5 bg-[#4F7C82]/10 text-[#4F7C82] text-[10px] font-black uppercase tracking-widest rounded-full">
                      Waiting Confirmation
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#0B2E33] mb-4 leading-tight group-hover:text-[#4F7C82] transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center gap-6 text-[#93B1B5]">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Calendar size={14} />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Clock size={14} />
                      2 days ago
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-2 text-[#0B2E33] font-black text-sm group-hover:gap-4 transition-all">
                    View Details
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Detail View */
          <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-500">
            <button 
              className="flex items-center gap-2 text-[#4F7C82] font-black uppercase tracking-widest text-xs hover:text-[#0B2E33] transition-colors"
              onClick={() => setSelectedResult(null)}
            >
              <ChevronLeft size={16} />
              Return to Submissions
            </button>

            <div className="bg-white/90 backdrop-blur-2xl border border-white rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="bg-[#0B2E33] p-10 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-black mb-2">{selectedResult.name}</h3>
                  <p className="opacity-70 font-bold uppercase tracking-widest text-xs">Generated on {selectedResult.date}</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl">
                  <FileText size={40} />
                </div>
              </div>

              <div className="p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-[#B8E3E9]/20 rounded-full flex items-center justify-center mb-8 border-4 border-dashed border-[#B8E3E9]">
                   <FileText size={40} className="text-[#4F7C82]" />
                </div>
                <h4 className="text-2xl font-black text-[#0B2E33] mb-4">Document Content Preview</h4>
                <p className="text-[#4F7C82] max-w-lg font-medium leading-relaxed italic border-l-4 border-[#B8E3E9] pl-6 py-2">
                  "This section would render a detailed summary of all marks, batch details, and statistical distributions for the selected module before final sign-off."
                </p>
                
                <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="text-orange-500" size={20} />
                    <div className="text-left">
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Action Needed</p>
                      <p className="text-sm font-bold text-orange-700">Audit Marks</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                    <Clock className="text-blue-500" size={20} />
                    <div className="text-left">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Expiration</p>
                      <p className="text-sm font-bold text-blue-700">48h Left</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#F8FBFC] border-t border-[#B8E3E9]/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <p className="text-[#4F7C82] text-sm font-bold flex items-center gap-2">
                  <AlertCircle size={16} />
                  Please verify all data before signing.
                </p>
                <div className="flex gap-4">
                  <button className="px-8 py-3 rounded-xl border-2 border-[#E5F3F5] text-[#4F7C82] font-black hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all flex items-center gap-2">
                    <AlertCircle size={18} />
                    Raise Complaint
                  </button>
                  <button className="px-10 py-4 rounded-xl bg-[#0B2E33] text-white font-black hover:bg-[#1a454c] transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2">
                    <CheckCircle size={20} />
                    Approve & Sign
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
