import React, { useState, useRef } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

function OpenAIChat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const responseRef = useRef(null);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000"}/api/chat`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post(backendUrl, { message });

      if (res.data.success) {
        setResponse(res.data.reply);
        setTimeout(() => {
          responseRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setResponse("The assistant encountered an analytical error.");
      }
    } catch (err) {
      console.error("Chatbot Error:", err);
      setResponse("System offline: Unable to reach the Neural Engine. Ensure the backend is running.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[600px]">
      <div className="w-full max-w-2xl bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">
        
        <div className="relative p-8 overflow-hidden text-center bg-gray-900">
            <div className="absolute top-0 right-0 p-4">
                <span className="flex w-3 h-3">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
                    <span className="relative inline-flex w-3 h-3 rounded-full bg-emerald-500"></span>
                </span>
            </div>
            <h2 className="text-2xl font-black tracking-widest text-white uppercase">
                HeartFlow <span className="text-3xl text-red-500">AI</span>
            </h2>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em] mt-2">
                Neural Diagnostic Assistant
            </p>
        </div>

        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe symptoms or ask about cardiac health..."
                        className="w-full p-5 text-gray-700 transition-all border-2 border-transparent outline-none bg-gray-50 rounded-2xl focus:border-red-500 focus:bg-white focus:shadow-lg placeholder:text-gray-400"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center w-full gap-3 p-5 font-black tracking-widest text-white uppercase transition-all bg-red-600 shadow-xl rounded-2xl hover:bg-gray-900 shadow-red-100 hover:shadow-gray-200 disabled:bg-gray-200 active:scale-95"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-4 rounded-full border-white/30 border-t-white animate-spin"></div>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        "Generate Analysis"
                    )}
                </button>
            </form>

            {response && (
                <div
                    ref={responseRef}
                    className="mt-8 animate-fade-in"
                >
                    <div className="relative p-6 border-l-8 border-red-600 bg-red-50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-600 rounded-lg shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xs font-black tracking-widest text-red-900 uppercase">Diagnostic Report</span>
                        </div>
                        
                        <p className="text-sm italic font-medium leading-relaxed text-gray-800 whitespace-pre-line">
                            {response}
                        </p>
                        
                        <div className="pt-4 mt-6 border-t border-red-200">
                            <p className="text-[9px] text-red-400 uppercase font-black tracking-tight">
                                Note: This AI analysis is for informational purposes only. Consult a specialist for clinical confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            {!response && !loading && (
                <div className="grid grid-cols-2 gap-4 mt-10">
                    <div className="p-4 border border-gray-200 border-dashed bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Suggested Query</p>
                        <p className="mt-1 text-xs text-gray-600">"Analyze risks of hypertension."</p>
                    </div>
                    <div className="p-4 border border-gray-200 border-dashed bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Suggested Query</p>
                        <p className="mt-1 text-xs text-gray-600">"Explain ECG results."</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default OpenAIChat;