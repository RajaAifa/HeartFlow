import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/reset-password",
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
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-md p-8 text-sm border shadow-2xl border-zinc-200 rounded-2xl text-zinc-600 bg-white/80 backdrop-blur-md"
      >
        <div className="w-full mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
            <ShieldCheck className="w-8 h-8 text-[#dc2626]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-800">
            Secure Reset
          </h1>
          <p className="mt-2 text-zinc-400">
            Please enter your new strong password below to regain access to HeartFlow.
          </p>
        </div>

        <div className="w-full space-y-5">
          <div className="relative">
            <Lock className="absolute w-4 h-4 left-3 top-9 text-zinc-400" />
            <p className="mb-1 ml-1 text-xs font-medium text-zinc-700">New Password</p>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-zinc-200 rounded-lg w-full pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-[#dc2626] outline-none transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute w-4 h-4 left-3 top-9 text-zinc-400" />
            <p className="mb-1 ml-1 text-xs font-medium text-zinc-700">Confirm New Password</p>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-zinc-200 rounded-lg w-full pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-[#dc2626] outline-none transition-all"
              required
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#dc2626] text-white w-full py-3 rounded-xl text-base font-semibold mt-8 hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-100 disabled:bg-red-400"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Update Password
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-center text-zinc-400">
          Make sure your password is at least 8 characters long and includes numbers.
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;