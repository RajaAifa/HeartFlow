import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";

const AdminUserProfile = () => {
  const { userId } = useParams();

  const {
    selectedUser,
    getUserProfile,
    blockUser,
    unblockUser,
    deleteComment
  } = useContext(AdminContext);

  const [activeTab, setActiveTab] = useState("appointments");
  const [openAppointmentId, setOpenAppointmentId] = useState(null);

  useEffect(() => {
    getUserProfile(userId);
  }, [userId]);

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this medical feedback?");
    if (!confirmDelete) return;

    await deleteComment(commentId);
    await getUserProfile(userId);
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-black tracking-tighter text-red-600 animate-pulse">
          LOADING PATIENT FILE...
        </div>
      </div>
    );
  }

  const {
    user,
    stats,
    appointments = [],
    orders = [],
    comments = []
  } = selectedUser;

  return (
    <div className="w-full min-h-screen bg-[#FDFBFB] p-6 lg:p-10">
      
      {/* 1. USER HEADER CARD */}
      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-xl border-t-8 border-red-600 overflow-hidden mb-10 transition-all">
        <div className="flex flex-col items-center gap-10 p-8 md:p-12 md:flex-row">
          <div className="relative">
            <img
              src={user?.image || "https://via.placeholder.com/150"}
              className="object-cover w-40 h-40 border-4 shadow-lg rounded-3xl border-red-50"
              alt="Profile"
            />
            <div className={`absolute -bottom-3 -right-3 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-md ${user?.isBlocked ? 'bg-red-600 text-white' : 'bg-green-500 text-white'}`}>
              {user?.isBlocked ? 'Restricted' : 'Verified'}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="mb-2 text-5xl font-black tracking-tight text-gray-800">{user?.name}</h2>
            <p className="mb-4 text-xl font-medium text-gray-400 lowercase">{user?.email}</p>
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
               <span className="px-5 py-2 text-sm font-bold text-gray-600 border border-gray-100 bg-gray-50 rounded-xl">
                 📞 {user?.phone || "No phone linked"}
               </span>
               <span className="px-5 py-2 text-sm font-bold text-gray-600 border border-gray-100 bg-gray-50 rounded-xl">
                 🎂 {user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
               </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            {user?.isBlocked ? (
              <button
                onClick={() => { unblockUser(user._id); getUserProfile(userId); }}
                className="w-full py-4 font-black text-white transition-all bg-green-500 shadow-lg rounded-2xl hover:bg-green-600 active:scale-95"
              >
                RESTORE ACCESS
              </button>
            ) : (
              <button
                onClick={() => { blockUser(user._id); getUserProfile(userId); }}
                className="w-full py-4 font-black text-white transition-all bg-red-600 shadow-lg rounded-2xl hover:bg-red-700 active:scale-95"
              >
                SUSPEND USER
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto mb-10 md:grid-cols-3">
        {[
          { label: "Appointments", value: stats?.appointments, icon: "📅", color: "text-blue-600" },
          { label: "Pharmacy Orders", value: stats?.orders, icon: "💊", color: "text-red-600" },
          { label: "Medical Feedback", value: stats?.comments, icon: "💬", color: "text-green-600" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="mb-1 text-sm font-black tracking-widest text-gray-400 uppercase">{item.label}</p>
              <p className={`text-4xl font-black ${item.color}`}>{item.value || 0}</p>
            </div>
            <span className="text-4xl transition-all filter grayscale group-hover:grayscale-0">{item.icon}</span>
          </div>
        ))}
      </div>

      <div className="flex max-w-6xl gap-2 p-2 mx-auto mb-6 bg-gray-200/50 rounded-3xl w-fit">
        {["appointments", "orders", "comments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-tighter transition-all ${
              activeTab === tab
                ? "bg-white text-red-600 shadow-sm scale-105"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-8 min-h-[400px]">
        
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="py-20 font-bold text-center text-gray-300">No clinical appointments found.</div>
            ) : (
              appointments.map((a) => (
                <div key={a._id} className="overflow-hidden transition-all border-2 group border-gray-50 rounded-3xl hover:border-red-100">
                  <div
                    className="flex items-center justify-between p-6 transition-all bg-white cursor-pointer hover:bg-red-50/30"
                    onClick={() => setOpenAppointmentId(openAppointmentId === a._id ? null : a._id)}
                  >
                    <div className="flex items-center gap-6">
                      <div className="bg-red-600 text-white p-4 rounded-2xl font-black text-center min-w-[80px]">
                         <p className="text-xs uppercase opacity-80">Date</p>
                         <p className="text-lg">{new Date(a.date).toLocaleDateString([], {day:'2-digit', month:'short'})}</p>
                      </div>
                      <div>
                        <p className="text-xl font-black text-gray-800">
                          {a.cancelled ? <span className="mr-2 text-xs text-red-600 uppercase">[Cancelled]</span> : ""}
                          Meeting with {a.docData?.name}
                        </p>
                        <p className="font-medium text-gray-400">{a.slotTime}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-bold text-sm ${a.payment ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {a.payment ? "PAID" : "UNPAID"}
                    </div>
                  </div>

                  {openAppointmentId === a._id && (
                    <div className="flex flex-col gap-10 p-8 border-t-2 border-white bg-gray-50 md:flex-row">
                      <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
                        <img src={a.docData?.image} className="object-cover w-16 h-16 rounded-xl" />
                        <div>
                          <p className="font-black text-gray-800">{a.docData?.name}</p>
                          <p className="text-xs font-bold text-red-600 uppercase">{a.docData?.speciality}</p>
                        </div>
                      </div>
                      <div className="grid flex-1 grid-cols-2 gap-4">
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Slot Ref</p>
                            <p className="font-bold">{a.slotDate} | {a.slotTime}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Booking Status</p>
                            <p className="font-bold">{a.cancelled ? "Terminated" : "Active / Confirmed"}</p>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="py-20 font-bold text-center text-gray-300">No prescription orders found.</div>
            ) : (
              orders.map((o) => (
                <div key={o._id} className="flex items-center justify-between p-6 transition-all border-2 border-gray-50 rounded-3xl hover:bg-gray-50">
                  <div>
                    <p className="text-xs font-black tracking-widest text-red-600 uppercase">Order Reference: {o._id.slice(-8)}</p>
                    <p className="text-2xl font-black text-gray-800">{o.amount} DT</p>
                  </div>
                  <div className="text-right">
                    <span className="px-6 py-2 text-xs font-black tracking-widest text-white uppercase bg-gray-900 rounded-xl">
                       {o.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="py-20 font-bold text-center text-gray-300">No medical feedback recorded.</div>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="p-8 border-2 border-gray-50 rounded-[2rem] flex items-center justify-between group hover:border-red-200 transition-all bg-white">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       {[...Array(5)].map((_, i) => (
                         <span key={i} className={`text-xl ${i < c.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                       ))}
                    </div>
                    <p className="text-xl italic font-medium text-gray-700">"{c.comment}"</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="px-6 py-3 ml-6 text-xs font-black text-white transition-all bg-red-600 shadow-lg opacity-0 rounded-xl group-hover:opacity-100 hover:bg-red-700"
                  >
                    PURGE COMMENT
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminUserProfile;