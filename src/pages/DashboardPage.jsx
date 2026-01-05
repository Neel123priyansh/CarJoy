import React, { useEffect, useState } from "react";
import axios from "axios";

const apiBaseURL = "http://127.0.0.1:5000/api";
const headerImg = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000";

function DashboardPage() {
  /* ---------------- STATE MANAGEMENT ---------------- */
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelStep, setLabelStep] = useState(1); 
  const [selectedOrder, setSelectedOrder] = useState(null);

  // High-Fidelity Dummy Data
  const [orders] = useState([
    { id: "ORD-9921", customer: "John Doe", total: 120.50, address: "123 Maple St, NY", status: "Pending" },
    { id: "ORD-9922", customer: "Sarah Smith", total: 45.00, address: "456 Oak Ave, CA", status: "Processing" },
    { id: "ORD-9923", customer: "Mike Ross", total: 210.00, address: "789 Pine Rd, IL", status: "Pending" },
  ]);

  const [shipments] = useState([
    { id: 1, date: "2024-03-10", tracking: "SMP-772190", courier: "BlueDart", status: "Delivered" },
    { id: 2, date: "2024-03-11", tracking: "SMP-881022", courier: "Delhivery", status: "In-Transit" },
    { id: 3, date: "2024-03-12", tracking: "SMP-110293", courier: "FedEx", status: "Picked" },
  ]);

  /* ---------------- VIEW 1: DASHBOARD ---------------- */
  const renderDashboard = () => (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Live Tracking</h2>
          <p className="text-slate-400 text-sm">Overview of all active parcels in the network.</p>
        </div>
        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {["All", "Delivered", "In-Transit", "Picked"].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} 
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeFilter === f ? "bg-white text-[#FF8474] shadow-sm" : "text-slate-400"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {shipments.filter(s => activeFilter === "All" || s.status === activeFilter).map((s) => (
          <div key={s.id} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">📦</div>
              <div>
                <p className="font-mono font-bold text-slate-800">{s.tracking}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{s.courier} • {s.date}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${s.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  /* ---------------- VIEW 2: ORDERS ---------------- */
  const renderOrders = () => (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-2xl font-black text-slate-800 mb-6">Fulfillment Queue</h2>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="flex flex-col md:flex-row justify-between items-center p-6 border border-slate-100 rounded-[2.5rem] bg-white group hover:border-[#FF8474]/30 transition-all">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xs italic">NEW</div>
                <div>
                    <p className="font-black text-slate-800">{o.id} • {o.customer}</p>
                    <p className="text-xs text-slate-400 font-medium">{o.address}</p>
                </div>
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
                <p className="font-mono font-black text-slate-700">${o.total.toFixed(2)}</p>
                <button onClick={() => { setSelectedOrder(o); setLabelStep(1); setShowLabelModal(true); }} 
                  className="bg-[#FF8474] text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all">
                  CREATE LABEL
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ---------------- VIEW 3: ADMIN ---------------- */
  const renderAdmin = () => (
    <div className="p-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">CONSOLE_ROOT</h2>
        <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> API Online
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl font-black italic">$$$</div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Total Managed Revenue</p>
            <h4 className="text-5xl font-black tracking-tighter">$142,800</h4>
            <div className="mt-8 flex gap-2">
               <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-orange-400 w-3/4"></div></div>
               <div className="h-1 flex-1 bg-white/20 rounded-full"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex justify-between items-center shadow-sm">
                <div><p className="text-slate-400 text-[10px] font-black uppercase">Active Nodes</p><h5 className="text-2xl font-black">12 Server Instances</h5></div>
                <div className="text-emerald-500 font-black">ACTIVE</div>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex justify-between items-center shadow-sm">
                <div><p className="text-slate-400 text-[10px] font-black uppercase">Webhooks</p><h5 className="text-2xl font-black">99.8% Success</h5></div>
                <div className="text-blue-500 font-black">STABLE</div>
            </div>
        </div>
      </div>
    </div>
  );

  /* ---------------- VIEW 4: REPORTS ---------------- */
  const renderReports = () => (
    <div className="p-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-10 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 text-3xl">📊</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Monthly P&L Report</h2>
          <p className="text-slate-400 mb-8 max-w-xs mx-auto">Full financial breakdown for March 2024 is currently being calculated.</p>
          <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-[#FF8474] transition-all">REQUEST DATA SYNC</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-orange-100">
      {/* HEADER & NAV */}
      <header className="relative bg-slate-900 text-white pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center scale-110" style={{ backgroundImage: `url(${headerImg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/90 to-slate-900" />

        <nav className="relative z-20 flex justify-between items-center px-10 py-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FF8474] rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-orange-500/30 rotate-3 transition-transform hover:rotate-0">S</div>
            <h1 className="text-2xl font-black tracking-tighter">ShipMyParcel <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md font-bold text-orange-400">v2.1</span></h1>
          </div>

          <div className="hidden md:flex bg-white/10 backdrop-blur-2xl border border-white/10 p-1.5 rounded-[2rem] gap-1 shadow-2xl">
            {["Dashboard", "Orders", "Admin", "Reports"].map((item) => (
              <button key={item} onClick={() => setActiveTab(item)}
                className={`px-8 py-3 rounded-[1.5rem] transition-all text-[11px] font-black uppercase tracking-widest ${activeTab === item ? "bg-white text-slate-900 shadow-xl scale-105" : "text-white/50 hover:text-white"}`}>
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 relative">
             <button className="flex items-center gap-3 bg-white text-slate-900 pl-2 pr-6 py-2 rounded-2xl font-black text-sm shadow-2xl hover:scale-105 transition-transform active:scale-95">
              <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-black text-xs italic">SY</div>
              Sunny
            </button>
          </div>
        </nav>

        <div className="relative z-10 px-10 pt-16 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
          <div>
              <p className="text-orange-400 font-black uppercase text-[10px] tracking-[0.3em] mb-4">Enterprise Control Module</p>
              <h2 className="text-7xl font-black mb-4 tracking-tighter leading-none">{activeTab}<span className="text-[#FF8474]">.</span></h2>
          </div>
          <div className="hidden lg:flex gap-6 mb-2">
              <div className="text-right">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Total Assets</p>
                  <h4 className="text-3xl font-black tracking-tighter italic">2.4k</h4>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-right">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Global Reach</p>
                  <h4 className="text-3xl font-black tracking-tighter italic">148+</h4>
              </div>
          </div>
        </div>
      </header>

      {/* DYNAMIC CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-10 -mt-20 relative z-30 pb-20">
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-300/50 border border-slate-100 overflow-hidden min-h-[600px] animate-in slide-in-from-bottom-8 duration-700">
          {activeTab === "Dashboard" && renderDashboard()}
          {activeTab === "Orders" && renderOrders()}
          {activeTab === "Admin" && renderAdmin()}
          {activeTab === "Reports" && renderReports()}
        </div>
      </main>

      {/* FULFILLMENT MODAL (Stepped Workflow) */}
      {showLabelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowLabelModal(false)} />
          <div className="relative bg-white rounded-[3.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {labelStep === 1 ? (
              <div className="p-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black tracking-tighter">Final Config</h2>
                    <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase">Step 01</span>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shipment to:</p>
                    <p className="text-xl font-black text-slate-800">{selectedOrder?.customer}</p>
                    <p className="text-sm text-slate-500 mt-1">{selectedOrder?.address}</p>
                </div>
                <button onClick={() => setLabelStep(2)} className="w-full bg-[#FF8474] text-white py-6 rounded-[2.5rem] font-black shadow-2xl shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    GENERATE AIRWAY BILL
                </button>
              </div>
            ) : (
              <div className="p-12 text-center">
                <h2 className="text-3xl font-black mb-8 tracking-tighter">Label Output</h2>
                {/* Visual Shipping Label Simulation */}
                <div className="mx-auto w-[300px] border-4 border-slate-900 p-8 bg-white text-left shadow-2xl mb-8 transform hover:scale-105 transition-transform cursor-pointer">
                    <div className="border-b-4 border-slate-900 pb-4 mb-6 font-black italic text-2xl tracking-tighter">SMP_GLOBAL</div>
                    <div className="text-[10px] font-black uppercase mb-6 leading-tight">CONSINEE:<br/>{selectedOrder?.customer}<br/>{selectedOrder?.address}</div>
                    <div className="h-24 bg-slate-900 mb-4 flex items-center justify-center gap-1.5 p-3">
                        {[2,4,1,3,1,5,2,1,3,2,4,1].map((w,i)=><div key={i} className="bg-white h-full" style={{width:`${w*2.5}px`}}></div>)}
                    </div>
                    <div className="text-center font-mono font-black text-[12px] tracking-[0.2em] uppercase">ID: {selectedOrder?.id}-BLU-X</div>
                </div>
                <div className="flex gap-4">
                    <button className="flex-1 bg-slate-100 text-slate-800 py-5 rounded-[2rem] font-black text-sm hover:bg-slate-200 transition-all">DOWNLOAD PDF</button>
                    <button onClick={() => setShowLabelModal(false)} className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm">CLOSE</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;