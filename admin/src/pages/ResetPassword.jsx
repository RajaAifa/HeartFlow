import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Lock, ShieldCheck, ArrowRight, Loader2, KeyRound } from "lucide-react";

const ResetPassword = () => {
  const { token, role } = useParams(); 
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = role === "admin";
  const isDoctor = role === "doctor";
  
  const themeColor = isAdmin ? '#1e293b' : isDoctor ? '#dc2626' : '#2563eb';
  const bgGradient = isAdmin ? 'bg-slate-100' : isDoctor ? 'bg-red-50' : 'bg-blue-50';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      let endpoint = "";
      if (role === "admin") endpoint = "/api/admin/reset-password";
      else if (role === "doctor") endpoint = "/api/doctor/reset-password";
      else endpoint = "/api/user/reset-password";

      const { data } = await axios.post(
        backendUrl + endpoint,
        {
          token,
          newPassword: password,
        }
      );

      if (data.success) {
        toast.success("Security updated! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${bgGradient}`}>
      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-[420px] p-8 sm:p-10 text-sm border shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-white/20 rounded-[2.5rem] text-zinc-600 bg-white/90 backdrop-blur-lg animate-in fade-in zoom-in duration-500 relative overflow-hidden"
      >
        <div 
          className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full opacity-10"
          style={{ backgroundColor: themeColor }}
        ></div>

        <div className="relative w-full mb-8 text-center">
          <div 
            className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-500 shadow-sm rounded-2xl"
            style={{ backgroundColor: `${themeColor}15` }} // 15 = opacité hex
          >
            <KeyRound className="w-8 h-8" style={{ color: themeColor }} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-800">
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'} <span className="font-light">Security</span>
          </h1>

          <p className="mt-2 text-zinc-400">
            Regain access by setting a new strong password.
          </p>
        </div>

        <div className="w-full space-y-5">
          {/* Nouveau Mot de Passe */}
          <div className="relative group">
            <Lock className="absolute w-4 h-4 left-4 top-[38px] text-zinc-300 group-focus-within:text-zinc-500 transition-colors" />
            <p className="mb-1.5 ml-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">New Password</p>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pr-4 transition-all border outline-none border-zinc-100 rounded-xl pl-11 bg-zinc-50 focus:bg-white focus:ring-4 focus:ring-opacity-10"
              style={{ '--tw-ring-color': themeColor }}
              required
            />
          </div>

          <div className="relative group">
            <ShieldCheck className="absolute w-4 h-4 left-4 top-[38px] text-zinc-300 group-focus-within:text-zinc-500 transition-colors" />
            <p className="mb-1.5 ml-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Confirm Password</p>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-3 pr-4 transition-all border outline-none border-zinc-100 rounded-xl pl-11 bg-zinc-50 focus:bg-white focus:ring-4 focus:ring-opacity-10"
              style={{ '--tw-ring-color': themeColor }}
              required
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="flex items-center justify-center gap-2 text-white w-full py-4 rounded-2xl mt-10 font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
          style={{ backgroundColor: themeColor }}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Update Password
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="mt-8 text-xs text-center text-zinc-400">
          Security Tip: Use a mix of letters, numbers, and symbols.
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;