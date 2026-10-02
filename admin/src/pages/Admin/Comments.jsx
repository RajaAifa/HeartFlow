import React, { useEffect, useContext, useState } from "react"; // Added useState
import { AdminContext } from "../../context/AdminContext";

const Comments = () => {
    const {
        comments,
        getAllComments,
        deleteComment,
        blockUser,
        unblockUser,
        aToken
    } = useContext(AdminContext);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (aToken) {
            getAllComments();
        }
    }, [aToken]);

    const filteredComments = comments.filter((c) =>
        c.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full min-h-screen p-8 bg-slate-50/50">
            
            {/* PAGE HEADER */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
                            Feedback <span className="text-red-600">& Reviews</span>
                        </h1>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Moderate user discussions and manage community standards.
                        </p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 text-sm transition-all border outline-none rounded-xl border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/5"
                        />
                        <span className="absolute text-slate-400 right-3 top-2.5">🔍</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                {filteredComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border shadow-sm rounded-2xl border-slate-100">
                        <span className="mb-4 text-5xl opacity-20">💬</span>
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                            {searchTerm ? "No users match your search" : "No comments recorded"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {filteredComments.map((c) => (
                            <div
                                key={c._id}
                                className="flex flex-col justify-between p-6 transition-all duration-300 bg-white border shadow-sm group rounded-2xl border-slate-100 hover:shadow-md"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 font-bold border rounded-full bg-slate-100 text-slate-600 border-slate-200">
                                                {c.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="mb-1 font-bold leading-none text-slate-800">
                                                    {c.userName}
                                                </p>
                                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                                                    UID: {c.userId.slice(-8)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex px-2 py-1 text-sm tracking-tighter border rounded-md text-amber-400 bg-amber-50 border-amber-100">
                                            {"★".repeat(Number(c.rating))}
                                            <span className="text-slate-300">{"★".repeat(5 - Number(c.rating))}</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute font-serif text-4xl text-indigo-100 -top-2 -left-1">“</span>
                                        <p className="px-4 py-2 text-sm italic leading-relaxed text-slate-600">
                                            {c.comment}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-slate-50">
                                    <button
                                        onClick={() => deleteComment(c._id)}
                                        className="px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white"
                                    >
                                        Delete
                                    </button>

                                    {c.isBlocked ? (
                                        <button
                                            onClick={() => unblockUser(c.userId)}
                                            className="px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white"
                                        >
                                            Unblock
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => blockUser(c.userId)}
                                            className="px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-800 hover:text-white"
                                        >
                                            Block User
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;