import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AlertCircle,
  Search,
  PackagePlus,
  Coins,
  Archive,
  Pill,
  Edit3,
  Check,
  X,
  ImagePlus,
} from "lucide-react";

const AdminMedication = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const [meds, setMeds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fileInputRef = useRef();
  const editFileInputRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImageFile(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const addMedication = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", Number(form.price));
    data.append("stock", Number(form.stock));
    if (imageFile) data.append("image", imageFile);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/medication/add`,
        data
      );
      if (res.data.success) {
        toast.success("Medication added successfully");
        setForm({ name: "", description: "", price: "", stock: "" });
        setImageFile(null);
        setPreview(null);
        fetchMeds();
      } else {
        toast.error(res.data.message || "Add failed");
      }
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error(err.response?.data?.message || "Error adding medication");
    }
  };

  const fetchMeds = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/medication/all`
      );
      if (res.data.success) setMeds(res.data.meds || []);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStock = async (id, stock) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/medication/update-stock`,
        { id, stock: Number(stock) }
      );
      if (res.data.success) {
        toast.success("Stock updated");
        fetchMeds();
      }
    } catch (err) {
      toast.error("Error updating stock");
    }
  };

  const startEdit = (med) => {
    setEditingId(med._id);
    setEditForm({
      name: med.name,
      description: med.description,
      price: med.price,
      stock: med.stock,
    });
    setEditImageFile(null);
    setEditPreview(med.image || null);
  };

  const updateMedication = async () => {
    const data = new FormData();
    data.append("name", editForm.name);
    data.append("description", editForm.description);
    data.append("price", Number(editForm.price));
    data.append("stock", Number(editForm.stock));
    if (editImageFile) data.append("image", editImageFile);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/medication/update-medication/${editingId}`,
        data
      );
      if (res.data.success) {
        toast.success("Medication updated");
        setEditingId(null);
        setEditImageFile(null);
        setEditPreview(null);
        fetchMeds();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const filteredMeds = meds.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F1F5F9] font-sans">

      <div className="flex-1 p-6 lg:p-10">
        <div className="flex flex-col items-start justify-between gap-4 mb-10 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-1 bg-red-600 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Portal</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight uppercase text-slate-900">
              Live <span className="text-red-600">Inventory</span>
            </h1>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
            <input
              className="w-full py-3 pl-12 pr-4 font-medium transition-all bg-white border shadow-sm outline-none border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-600/5 focus:border-red-600 text-slate-900 placeholder:text-slate-400"
              placeholder="Search meds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMeds.map((m) => (
            <div key={m._id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300">

              {/* Image */}
              <div className="relative flex items-center justify-center h-40 mb-6 overflow-hidden border bg-slate-50 rounded-3xl border-slate-50">
                <img
                  src={editingId === m._id && editPreview ? editPreview : m.image}
                  className="object-contain transition-transform duration-500 h-28 group-hover:scale-110"
                  alt={m.name}
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.stock > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-600 text-white"}`}>
                    {m.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {editingId === m._id ? (
                <div className="space-y-3">
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 text-sm font-bold border border-slate-200 rounded-xl text-slate-900"
                    placeholder="Name"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full h-20 p-3 text-xs border border-slate-200 rounded-xl text-slate-600"
                    placeholder="Description"
                  />

                  {/* Image upload for edit */}
                  <div
                    onClick={() => editFileInputRef.current.click()}
                    className="flex items-center gap-2 p-3 text-xs font-bold transition-all border border-dashed cursor-pointer border-slate-300 rounded-xl text-slate-500 hover:border-red-400 hover:text-red-500"
                  >
                    <ImagePlus size={14} />
                    {editImageFile ? editImageFile.name : "Change image (optional)"}
                  </div>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleEditImageChange}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="p-3 text-sm font-bold border border-slate-200 rounded-xl"
                      placeholder="Price"
                    />
                    <div className="flex gap-1">
                      <button onClick={updateMedication} className="flex items-center justify-center flex-1 text-white bg-emerald-500 rounded-xl">
                        <Check size={18} />
                      </button>
                      <button onClick={() => { setEditingId(null); setEditImageFile(null); setEditPreview(null); }} className="flex items-center justify-center flex-1 bg-slate-200 text-slate-600 rounded-xl">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-black leading-tight text-slate-900">{m.name}</h3>
                    <button onClick={() => startEdit(m)} className="transition-colors text-slate-400 hover:text-red-600">
                      <Edit3 size={16} />
                    </button>
                  </div>
                  <p className="h-8 mb-4 text-xs font-medium text-slate-400 line-clamp-2">{m.description}</p>

                  <div className="flex items-center justify-between py-4 mb-4 border-y border-slate-50">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</span>
                      <span className="text-lg font-black text-slate-900">{m.price} <small className="text-[10px]">DT</small></span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available</span>
                      <span className={`text-lg font-black ${m.stock < 5 ? "text-red-600" : "text-slate-900"}`}>{m.stock}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Archive className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-300" size={14} />
                      <input
                        type="number"
                        defaultValue={m.stock}
                        onBlur={(e) => updateStock(m._id, e.target.value)}
                        className="w-full py-3 pr-3 text-xs font-black outline-none pl-9 bg-slate-50 rounded-xl text-slate-900 focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <button onClick={() => updateStock(m._id, 0)} className="p-3 text-red-600 transition-all shadow-sm bg-red-50 hover:bg-red-600 hover:text-white rounded-xl">
                      <AlertCircle size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[450px] bg-red-600 p-8 lg:p-12 text-white flex flex-col relative overflow-hidden">
        <div className="relative sticky z-10 top-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl">
              <PackagePlus size={28} />
            </div>
            <h2 className="text-3xl font-black leading-none uppercase">
              New <br /> <span className="text-red-200">Product</span>
            </h2>
          </div>

          <form onSubmit={addMedication} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Product Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Paracetamol 500mg" className="w-full p-4 text-sm font-bold transition-all border outline-none bg-white/10 border-white/20 rounded-2xl focus:bg-white focus:text-slate-900 placeholder:text-white/40" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Indication, dosage..." className="w-full h-24 p-4 text-sm transition-all border outline-none resize-none bg-white/10 border-white/20 rounded-2xl focus:bg-white focus:text-slate-900 placeholder:text-white/40" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Price (DT)</label>
                <div className="relative">
                  <Coins className="absolute -translate-y-1/2 opacity-50 left-4 top-1/2" size={16} />
                  <input name="price" value={form.price} onChange={handleChange} placeholder="0.00" type="number" className="w-full py-4 pl-12 pr-4 font-bold transition-all border outline-none bg-white/10 border-white/20 rounded-2xl focus:bg-white focus:text-slate-900 placeholder:text-white/40" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Initial Qty</label>
                <div className="relative">
                  <Pill className="absolute -translate-y-1/2 opacity-50 left-4 top-1/2" size={16} />
                  <input name="stock" value={form.stock} onChange={handleChange} placeholder="0" type="number" className="w-full py-4 pl-12 pr-4 font-bold transition-all border outline-none bg-white/10 border-white/20 rounded-2xl focus:bg-white focus:text-slate-900 placeholder:text-white/40" required />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Product Image</label>
              <div
                onClick={() => fileInputRef.current.click()}
                className="flex flex-col items-center justify-center w-full gap-2 p-4 transition-all border border-dashed cursor-pointer border-white/30 rounded-2xl bg-white/10 hover:bg-white/20"
              >
                {preview ? (
                  <img src={preview} alt="preview" className="object-contain w-full rounded-xl max-h-32" />
                ) : (
                  <>
                    <ImagePlus size={28} className="opacity-60" />
                    <span className="text-xs font-bold opacity-60">Click to upload from your device</span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imageFile && (
                <p className="text-[10px] opacity-60 ml-1 truncate">{imageFile.name}</p>
              )}
            </div>

            <button type="submit" className="w-full py-5 bg-white text-red-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98] shadow-2xl mt-4">
              Register Medication
            </button>
          </form>

          <div className="p-6 mt-12 border bg-black/10 rounded-3xl border-white/5">
            <p className="text-[10px] font-bold text-center leading-relaxed opacity-60 uppercase tracking-tighter">
              Notice: All pharmaceutical entries are subject to immediate audit for pricing compliance.
            </p>
          </div>
        </div>

        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AdminMedication;
