import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Package, Trash2, CheckCircle, Clock, MapPin, Phone, Hash, Calendar, Paperclip, FileText, Eye, Sparkles, X } from 'lucide-react';

const MedicationOrders = () => {
    const { aToken, orders, getAllOrders, updateOrderStatus, deleteOrder } = useContext(AdminContext);
    const [viewerUrl, setViewerUrl] = useState(null);
    const [viewerType, setViewerType] = useState(null); // "image" | "pdf"

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (aToken) {
            getAllOrders();
        }
    }, [aToken]);

    const handleStatusUpdate = async (id, status) => {
        await updateOrderStatus(id, status);
        getAllOrders();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanent Action: Are you sure you want to delete this record?")) {
            await deleteOrder(id);
            getAllOrders();
        }
    };

    const openViewer = (fileUrl, fileType) => {
        setViewerUrl(`${backendUrl}${fileUrl}`);
        setViewerType(fileType);
    };

    const closeViewer = () => {
        setViewerUrl(null);
        setViewerType(null);
    };

    return (
        <div className='p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900'>

            <div className='flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between'>
                <div>
                    <div className='flex items-center gap-2 mb-2'>
                        <span className='w-8 h-1 rounded-full bg-slate-900'></span>
                        <p className='text-xs font-bold tracking-[0.2em] text-slate-500 uppercase'>Management Console</p>
                    </div>
                    <h1 className='text-4xl font-black tracking-tight uppercase text-slate-900'>
                        Medication <span className='text-red-600'>Orders</span>
                    </h1>
                </div>

                <div className='flex items-center gap-4 p-1 bg-white border shadow-sm rounded-2xl border-slate-200'>
                    <div className='px-4 py-2 text-sm font-bold text-white shadow-md bg-slate-900 rounded-xl shadow-slate-200'>
                        {orders?.length || 0} Total Requests
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3'>

                {orders && orders.length > 0 ? (
                    orders.map((item) => (
                        <div key={item._id} className='group flex flex-col bg-white border border-slate-200 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden'>
                            
                            <div className='flex items-center justify-between p-5 border-b border-slate-50 bg-slate-50/50'>
                                <div className='flex items-center gap-3'>
                                    <img
                                        className='w-10 h-10 border-2 border-white rounded-full shadow-sm ring-1 ring-slate-200'
                                        src={item.userId?.image || 'https://via.placeholder.com/100'}
                                        alt=""
                                    />
                                    <div>
                                        <h3 className='text-sm font-black leading-tight text-slate-900'>
                                            {item.userId?.name || "Anonymous Patient"}
                                        </h3>
                                        <p className='text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5 uppercase tracking-wider'>
                                            <Calendar size={10} /> {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-1'>
                                    {item.prescription?.hasPrescription && (
                                        <span className='flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase bg-violet-50 text-violet-600 border border-violet-100'>
                                            <Paperclip size={10} /> Rx
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className='p-2 transition-colors rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50'
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className='p-6'>
                                <div className='mb-6 space-y-3'>
                                    <div className='flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.1em] mb-4'>
                                        <Hash size={12} className="text-red-600"/> Prescription Details
                                    </div>
                                    
                                    {item.items?.map((med, i) => (
                                        <div key={i} className='flex items-center justify-between px-1'>
                                            <span className='text-sm font-bold text-slate-700'>
                                                {med?.name} 
                                                <span className='ml-2 font-black text-red-600'>×{med?.quantity || 1}</span>
                                            </span>
                                            <div className='flex-1 h-px mx-4 border-t border-dotted border-slate-200'></div>
                                            <span className='text-xs font-bold text-slate-400'>
                                                {med?.price ? `${med.price.toFixed(2)} DT` : '--'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* ============ PRESCRIPTION SECTION ============ */}
                                {item.prescription?.hasPrescription && (
                                    <div className='p-4 mb-6 space-y-4 border bg-violet-50/50 border-violet-100 rounded-2xl'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2 text-[10px] font-black text-violet-700 uppercase tracking-[0.1em]'>
                                                <Paperclip size={12} /> Uploaded Prescription
                                            </div>
                                            <button
                                                onClick={() => openViewer(item.prescription.originalFileUrl, item.prescription.fileType)}
                                                className='flex items-center gap-1 px-3 py-1.5 bg-white border border-violet-200 rounded-lg text-[10px] font-black uppercase text-violet-600 hover:bg-violet-600 hover:text-white transition-colors'
                                            >
                                                <Eye size={12} /> View Original
                                            </button>
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            {item.prescription.fileType === 'pdf' ? (
                                                <div
                                                    onClick={() => openViewer(item.prescription.originalFileUrl, item.prescription.fileType)}
                                                    className='flex items-center justify-center bg-white border cursor-pointer w-14 h-14 border-violet-100 rounded-xl'
                                                >
                                                    <FileText className='text-violet-400' size={22} />
                                                </div>
                                            ) : (
                                                <img
                                                    src={`${backendUrl}${item.prescription.originalFileUrl}`}
                                                    alt="prescription"
                                                    onClick={() => openViewer(item.prescription.originalFileUrl, item.prescription.fileType)}
                                                    className='object-cover border cursor-pointer w-14 h-14 border-violet-100 rounded-xl'
                                                />
                                            )}

                                            <div className='flex-1'>
                                                <div className='flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1'>
                                                    <Sparkles size={10} className='text-violet-500' /> AI Extracted Medications
                                                </div>
                                                {item.prescription.extractedMeds?.length > 0 ? (
                                                    <div className='space-y-1'>
                                                        {item.prescription.extractedMeds.map((med, i) => (
                                                            <p key={i} className='text-xs font-bold text-slate-700'>
                                                                {med.name}
                                                                {med.dosage && <span className='ml-1 font-medium text-slate-400'>({med.dosage})</span>}
                                                                {med.quantity && <span className='ml-1 font-black text-violet-600'>×{med.quantity}</span>}
                                                            </p>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className='text-xs italic font-medium text-slate-400'>No medications detected by AI — check original file.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* ============ END PRESCRIPTION SECTION ============ */}

                                <div className='flex items-center justify-between p-4 mb-6 shadow-lg text-slate-400 rounded-2xl shadow-slate-200'>
                                    <span className='text-xs font-bold tracking-widest uppercase text-slate-400'>Amount Due</span>
                                    <span className='text-xl font-black tracking-tight text-white'>
                                        <span className='mr-1 text-red-500'>{item.amount?.toFixed(2)}</span> 
                                        <span className='text-[10px] text-slate-400'>DT</span>
                                    </span>
                                </div>

                                <div className='px-1 mb-8 space-y-3'>
                                    <div className='flex items-center gap-3 text-xs font-bold text-slate-600'>
                                        <div className='p-1.5 bg-slate-100 rounded-md text-slate-900'><Phone size={12} /></div>
                                        {item.userId?.phone || "No Contact"}
                                    </div>
                                    <div className='flex items-start gap-3 text-xs font-medium leading-relaxed text-slate-500'>
                                        <div className='p-1.5 bg-slate-100 rounded-md text-slate-900 mt-0.5'><MapPin size={12} /></div>
                                        {item.address?.line1} {item.address?.line2}
                                    </div>
                                </div>

                                <div className='flex gap-3'>
                                    <button
                                        onClick={() => handleStatusUpdate(item._id, 'In Progress')}
                                        className='flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all active:scale-95'
                                    >
                                        <Clock size={14} /> Process
                                    </button>

                                    <button
                                        onClick={() => handleStatusUpdate(item._id, 'Delivered')}
                                        className='flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase text-slate-900 border-2 border-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95'
                                    >
                                        <CheckCircle size={14} /> Delivered
                                    </button>
                                </div>

                                <div className='flex items-center justify-center pt-4 mt-6 border-t border-slate-50'>
                                    <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                                        item.status === 'Delivered' 
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                        : "bg-red-50 text-red-600 border border-red-100"
                                    }`}>
                                        {item.status}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div className='py-24 text-center bg-white border border-dashed rounded-3xl border-slate-200 col-span-full'>
                        <Package size={40} className='mx-auto mb-4 text-slate-200' />
                        <p className='text-xs font-bold tracking-widest uppercase text-slate-400'>No Orders Found</p>
                    </div>
                )}

            </div>

            {/* ============ FULLSCREEN PRESCRIPTION VIEWER MODAL ============ */}
            {viewerUrl && (
                <div
                    onClick={closeViewer}
                    className='fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm'
                >
                    <div onClick={(e) => e.stopPropagation()} className='relative w-full max-w-3xl overflow-hidden bg-white shadow-2xl rounded-3xl'>
                        <button
                            onClick={closeViewer}
                            className='absolute z-10 p-2 rounded-full top-4 right-4 bg-white/90 hover:bg-white text-slate-700'
                        >
                            <X size={18} />
                        </button>
                        {viewerType === 'pdf' ? (
                            <iframe src={viewerUrl} title="prescription" className='w-full h-[80vh]' />
                        ) : (
                            <img src={viewerUrl} alt="prescription" className='w-full max-h-[80vh] object-contain bg-slate-50' />
                        )}
                    </div>
                </div>
            )}
            {/* ============ END VIEWER MODAL ============ */}
        </div>
    );
};

export default MedicationOrders;