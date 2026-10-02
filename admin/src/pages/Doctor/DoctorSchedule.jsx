import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const generateDates = (days = 7) => {
  const result = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    result.push(`${day}_${month}_${year}`);
  }
  return result;
};

const formatDate = (dateStr) => {
  const [d, m, y] = dateStr.split("_");
  const date = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const DoctorSchedule = () => {
  const { getDoctorSchedule, toggleSlot, dToken } = useContext(DoctorContext);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);

  const slots = useMemo(() => {
    const res = [];
    for (let h = 10; h <= 17; h++) {
      res.push(`${h.toString().padStart(2, "0")}:00`);
      res.push(`${h.toString().padStart(2, "0")}:30`);
    }
    res.push("18:00");
    return res;
  }, []);

  const loadSchedule = useCallback(async () => {
    if (!dToken) return;
    setLoading(true);
    const res = await getDoctorSchedule();
    setSchedule(res || {});
    setLoading(false);
  }, [dToken, getDoctorSchedule]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const sortedDates = useMemo(() => generateDates(7), []);

  const getSlotStatus = (date, time) => {
    const day = schedule[date] || [];
    const found = day.find((s) => s.time === time);
    if (!found) return "free";
    if (found.type === "blocked") return "blocked";
    if (found.cancelled) return "free";
    return "booked";
  };

  const handleClick = async (date, time) => {
    if (loading) return;
    const status = getSlotStatus(date, time);
    if (status === "booked") return;
    setLoading(true);
    const res = await toggleSlot(date, time);
    if (res?.success) {
      await loadSchedule();
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center w-full min-h-screen px-6 py-12 bg-rose-50/50">
      
      <div className="w-full max-w-6xl overflow-hidden bg-white border shadow-2xl rounded-[2.5rem] border-rose-100">
        
        <div className="flex flex-col items-center pb-10 text-center bg-white pt-14">
          <div className="inline-block px-5 py-1.5 mb-5 text-[11px] font-black tracking-[0.25em] text-red-600 uppercase rounded-full bg-rose-100/50">
            Doctor Management
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-800">
            Work <span className="text-red-600">Schedule</span>
          </h1>
          <p className="max-w-xl px-6 mt-4 text-lg font-medium text-slate-500">
            Manage your availability. Blocked slots prevent patient bookings instantly.
          </p>
        </div>

        <div className="px-10 pb-14">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {sortedDates.map((date) => (
              <div key={date} className="flex flex-col overflow-hidden border bg-rose-50/40 rounded-3xl border-rose-100">
                
                <div className="py-5 text-center bg-white border-b border-rose-100">
                  <p className="text-[11px] uppercase tracking-widest font-black text-rose-300">Day</p>
                  <h2 className="text-xl font-black text-slate-800">{formatDate(date)}</h2>
                </div>

                <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {slots.map((time) => {
                    const status = getSlotStatus(date, time);
                    return (
                      <button
                        key={time}
                        disabled={loading || status === "booked"}
                        onClick={() => handleClick(date, time)}
                        className={`w-full group relative flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-300 border-2
                          ${status === "free" 
                            ? "bg-white border-transparent hover:border-red-200 hover:shadow-md text-slate-600" 
                            : ""}
                          ${status === "blocked" 
                            ? "bg-slate-800 border-slate-800 text-white shadow-xl scale-[0.97]" 
                            : ""}
                          ${status === "booked" 
                            ? "bg-rose-100/50 border-rose-200 text-red-400 cursor-not-allowed opacity-60" 
                            : ""}
                          ${loading ? "animate-pulse" : ""}
                        `}
                      >
                        <span className="text-base font-black">{time}</span>
                        <span className={`text-[10px] uppercase font-black tracking-tighter 
                          ${status === "free" ? "text-rose-200 group-hover:text-red-400" : "opacity-80"}`}>
                          {status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-10 pt-10 mt-10 border-t border-rose-100">
             <div className="flex items-center gap-3 text-xs font-black tracking-widest uppercase text-rose-300">
                <div className="w-4 h-4 bg-white border-2 rounded-full border-rose-200"></div> Available
             </div>
             <div className="flex items-center gap-3 text-xs font-black tracking-widest uppercase text-rose-300">
                <div className="w-4 h-4 rounded-full shadow-md bg-slate-800"></div> Blocked
             </div>
             <div className="flex items-center gap-3 text-xs font-black tracking-widest uppercase text-rose-300">
                <div className="w-4 h-4 border rounded-full bg-rose-200 border-rose-300"></div> Booked
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;