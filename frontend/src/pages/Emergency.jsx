import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertTriangle, ShieldAlert, Navigation, PhoneCall } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';

const Emergency = () => {
    const [loading, setLoading] = useState(false);
    const { userData, backendUrl, token } = useContext(AppContext);

    const handleEmergency = async () => {
        if (!userData) {
            toast.error("Please login to send an emergency alert");
            return;
        }

        setLoading(true);
        try {
            const emergencyData = {
                patientName: userData.name,
                phone: userData.phone,
                email: userData.email,
                address: `${userData.address.line1}, ${userData.address.line2}`,
                gender: userData.gender,
                dob: userData.dob,
                message: "EMERGENCY: Heart Support Requested!"
            };

            const { data } = await axios.post(
                backendUrl + '/api/emergency/send-alert', 
                emergencyData, 
                { headers: { token } }
            );

            if (data.success) {
                toast.success(" Emergency alert sent to Admin Dashboard!");
            } else {
                toast.error("❌ Failed to send alert.");
            }
        } catch (err) {
            toast.error("❌ Error connecting to emergency service.");
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#FEF2F2]">
            <div className="w-full max-w-2xl">
                
                <div className="relative overflow-hidden bg-white border shadow-2xl rounded-[3rem] border-red-100 p-8 md:p-12">
                    
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse"></div>
                    
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-20"></div>
                            <div className="relative flex items-center justify-center w-24 h-24 bg-red-50 rounded-[2rem] border-2 border-red-100 text-red-600">
                                <ShieldAlert size={48} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <h1 className="mb-4 text-4xl font-black tracking-tighter text-red-700 uppercase md:text-5xl">
                            Critical <span className="italic text-slate-800">Alert</span>
                        </h1>
                        <p className="mb-8 font-medium leading-relaxed text-slate-500">
                            Hello <span className="font-bold text-red-600">{userData?.name}</span>. 
                            Activating this protocol will instantly broadcast your <span className="underline decoration-red-200 decoration-2">medical profile</span>, 
                            <span className="underline decoration-red-200 decoration-2"> current contact</span>, and <span className="underline decoration-red-200 decoration-2">address</span> to our emergency response team.
                        </p>

                        <div className="grid grid-cols-1 gap-4 mb-10 text-left md:grid-cols-2">
                            <div className="flex items-center gap-3 p-4 border bg-slate-50 rounded-2xl border-slate-100">
                                <Navigation className="text-red-500" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Location</p>
                                    <p className="text-xs font-bold truncate text-slate-700">{userData?.address?.line1 || "Not Set"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 border bg-slate-50 rounded-2xl border-slate-100">
                                <PhoneCall className="text-red-500" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</p>
                                    <p className="text-xs font-bold text-slate-700">{userData?.phone || "Not Set"}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleEmergency}
                            disabled={loading}
                            className={`group relative w-full py-6 rounded-3xl font-black text-xl md:text-2xl uppercase tracking-[0.2em] transition-all overflow-hidden shadow-xl active:scale-95 ${
                                loading 
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                                : "bg-red-600 text-white hover:bg-red-700 shadow-red-200"
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                                    Transmitting...
                                </span>
                            ) : (
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <AlertTriangle size={28} className="animate-bounce" />
                                    Send Alert Now
                                </span>
                            )}
                            
                            {!loading && (
                                <div className="absolute top-0 w-1/2 h-full transition-all duration-500 -skew-x-12 bg-white/20 -left-full group-hover:left-full"></div>
                            )}
                        </button>
                    </div>

                    <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center">
                        Secure Connection // Emergency Services v2.1
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Emergency;