import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { 
  ShoppingCart, 
  Package, 
  Trash2, 
  CreditCard, 
  ShoppingBag, 
  ChevronRight, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  FileText,
  X,
  Paperclip,
  Loader2,
  Sparkles,
  Pencil
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// Extrait le premier tableau JSON "équilibré" d'un texte, en comptant les crochets.
// Plus robuste qu'un regex greedy car il s'arrête dès que le tableau se referme,
// peu importe ce qui suit (texte explicatif, crochets parasites, etc.).
function extractFirstJsonArray(text) {
  const start = text.indexOf("[");
  if (start === -1) return null;

  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "[") depth++;
    else if (text[i] === "]") {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }
  return null; // tableau jamais refermé correctement
}

const Medication = () => {
  const [meds, setMeds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Prescription attachment + AI extraction (via backend proxy) ---
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedMeds, setExtractedMeds] = useState(null); // null = pas encore analysé
  const [aiError, setAiError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const fileInputRef = useRef(null);

  const {
    addToCart,
    cart,
    removeFromCart,
    getTotal,
    clearCart,
    backendUrl,
    token,
    userData
  } = useContext(AppContext);

  const fetchMeds = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/medication/all`);
      if (res.data.success) setMeds(res.data.meds || []);
    } catch (err) {
      console.log("MEDS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/order/user-orders`, { headers: { token } });
      if (res.data.success) setOrders(res.data.orders || []);
    } catch (err) {
      console.log("ORDERS ERROR:", err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.post(`${backendUrl}/api/order/cancel`, { orderId }, { headers: { token } });
      if (res.data.success) fetchOrders();
    } catch (err) {
      console.log("CANCEL ERROR:", err);
    }
  };

  useEffect(() => {
    fetchMeds();
    fetchOrders();
  }, []);

  const filteredMeds = meds.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- Prescription + AI handlers ---

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePrescriptionChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAiError("");
    setExtractedMeds(null);
    setPrescriptionFile(file);
    setPrescriptionPreview(file.type === "application/pdf" ? "pdf" : URL.createObjectURL(file));

    if (file.type === "application/pdf") {
      setAiError("L'analyse IA automatique fonctionne uniquement avec des images (JPG/PNG) pour l'instant. Le PDF sera quand même joint à la commande.");
      return;
    }

    await analyzeWithGroq(file);
  };

  const analyzeWithGroq = async (file) => {
    try {
      setAnalyzing(true);
      setAiError("");

      const base64Image = await fileToBase64(file);

      const response = await axios.post(
        `${backendUrl}/api/groq/chat`,
        {
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are a medical assistant. Carefully read the prescription in the image (handwritten or printed) and extract every medication mentioned.

Return ONLY a raw JSON array, no markdown, no explanation, no extra text before or after.

Each element must have exactly these three keys: "name", "dosage", "quantity".

Example of the expected structure (this is illustrative only — do NOT copy these example values, replace them with what you actually read in the image):
[{"name": "Paracetamol", "dosage": "500mg", "quantity": 2}, {"name": "Amoxicilline", "dosage": "1g", "quantity": 1}]

Rules:
- "name" must be the real medication name read from the image, never a placeholder.
- "dosage" must be the real dosage text read from the image, or "" (empty string) if not visible.
- "quantity" must be a number; default to 1 if not specified.
- If no medication is visible in the image, return an empty array: []`
                },
                {
                  type: "image_url",
                  image_url: { url: `data:${file.type};base64,${base64Image}` }
                }
              ]
            }
          ],
          temperature: 0,
          max_tokens: 4096
        },
        {
          headers: { token }
        }
      );

      const rawContent = response.data.choices[0].message.content;

      // 1. Retirer le bloc de raisonnement des modèles "thinking" (ex: qwen reasoning models)
      const withoutThink = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

      // 2. Retirer d'éventuels fences markdown restants
      const withoutFences = withoutThink.replace(/```json|```/g, "").trim();

      // 3. Extraire uniquement le PREMIER tableau JSON équilibré, même s'il y a du texte
      //    avant/après (ex: notes du modèle, ou crochets parasites comme "[voir notice]").
      //    Un simple regex greedy /\[[\s\S]*\]/ échoue dans ce cas car il va jusqu'au
      //    DERNIER "]" du texte entier, pas jusqu'à la fin du premier tableau réel.
      const cleaned = extractFirstJsonArray(withoutFences) || withoutFences;

      const parsed = JSON.parse(cleaned);
      const parsedArray = Array.isArray(parsed) ? parsed : [];

      // Filet de sécurité : élimine les entrées où le modèle a recopié le
      // placeholder de l'exemple au lieu d'extraire une vraie valeur
      // (ex: name === "...", ou vide après nettoyage).
      const isPlaceholder = (value) => {
        if (typeof value !== "string") return false;
        const trimmed = value.trim();
        return trimmed === "" || /^\.{2,}$/.test(trimmed);
      };

      const sanitized = parsedArray.filter((med) => med && !isPlaceholder(med.name));

      if (parsedArray.length > 0 && sanitized.length === 0) {
        setAiError("L'IA n'a pas réussi à lire l'ordonnance correctement. Vous pouvez quand même l'envoyer, ou réessayer avec une photo plus nette.");
      }

      setExtractedMeds(sanitized);
    } catch (err) {
      console.log("GROQ AI ERROR:", err);
      setAiError("L'IA n'a pas pu analyser l'ordonnance. Vous pouvez quand même l'envoyer.");
      setExtractedMeds([]);
    } finally {
      setAnalyzing(false);
    }
  };

  const updateExtractedMed = (index, field, value) => {
    setExtractedMeds((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeExtractedMed = (index) => {
    setExtractedMeds((prev) => prev.filter((_, i) => i !== index));
  };

  const removePrescription = () => {
    setPrescriptionFile(null);
    setPrescriptionPreview(null);
    setExtractedMeds(null);
    setAiError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const placeOrderWithPrescription = async () => {
    if (cart.length === 0) return;
    try {
      setPlacingOrder(true);
      setOrderError("");

      const formData = new FormData();
      formData.append("items", JSON.stringify(cart));
      formData.append("amount", getTotal());
      formData.append("address", JSON.stringify(userData?.address || {}));

      if (prescriptionFile) {
        formData.append("prescription", prescriptionFile);
        formData.append("extractedMeds", JSON.stringify(extractedMeds || []));
      }

      const res = await axios.post(
        `${backendUrl}/api/order/place`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("Order placed successfully !");
        removePrescription();
        if (clearCart) clearCart();
        fetchOrders();
        fetchMeds();
      } else {
        const message = res.data.message || "Error";
        setOrderError(message);
        toast.error(message);
      }
    } catch (err) {
      console.log("ORDER ERROR:", err);
      const message = "Error";
      setOrderError(message);
      toast.error(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFD]">
      
      <div className="flex-1 p-6 overflow-y-auto md:p-10 lg:p-12">
        
        <div className="flex flex-col items-start justify-between gap-4 mb-10 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Health<span className="text-rose-500">Store</span></h1>
            <p className="mt-1 font-medium text-slate-500">Quality medications delivered to your door.</p>
          </div>
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search pharmacy..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 transition-all bg-white border shadow-sm outline-none border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500"
            />
            <ShoppingBag className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={18} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-rose-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMeds.map((m) => (
              <div key={m._id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500">
                <div className="relative flex items-center justify-center h-48 mb-6 overflow-hidden bg-slate-50 rounded-3xl">
                  <img src={m.image} alt={m.name} className="object-contain h-32 transition-transform duration-500 group-hover:scale-110" />
                  {m.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-black leading-tight text-slate-900">{m.name}</h3>
                  <span className="text-lg font-black text-rose-500">{m.price}<small className="text-[10px] ml-0.5 uppercase">DT</small></span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  {m.stock > 0 ? (
                    <CheckCircle className="text-emerald-500" size={14} />
                  ) : (
                    <AlertCircle className="text-slate-300" size={14} />
                  )}
                  <p className={`text-xs font-bold uppercase tracking-wider ${m.stock > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                    {m.stock > 0 ? `${m.stock} Units left` : "Replenishing Stock"}
                  </p>
                </div>

                <button
                  disabled={m.stock <= 0}
                  onClick={() => addToCart(m)}
                  className="w-full py-4 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-slate-900 rounded-2xl hover:bg-rose-500 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 shadow-slate-900/10"
                >
                  {m.stock > 0 ? "Add to Selection" : "Unavailable"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-12 mt-20 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-500"><Clock size={20}/></div>
            <h2 className="text-2xl font-black tracking-tight uppercase text-slate-900">Recent Activity</h2>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                <p className="italic font-bold text-slate-400">Your purchase history is empty</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="flex flex-col justify-between p-6 transition-colors bg-white border md:flex-row md:items-center border-slate-100 rounded-3xl hover:border-rose-200">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className={`p-3 rounded-2xl ${order.status === 'Cancelled' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-500'}`}>
                      <Package size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black uppercase text-slate-900">Order #{order._id.slice(-6)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {order.status}
                        </span>
                        {order.prescription?.hasPrescription && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-violet-100 text-violet-600 flex items-center gap-1">
                            <Paperclip size={10} /> Rx
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {order.items?.map(i => i.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-8 md:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Paid</p>
                      <p className="font-black text-md text-slate-900">{order.amount} DT</p>
                    </div>
                    {order.status === "Pending" && (
                      <button 
                        onClick={() => cancelOrder(order._id)}
                        className="p-2 transition-all text-rose-500 hover:bg-rose-50 rounded-xl"
                      >
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px] bg-slate-50 lg:border-l border-slate-200 flex flex-col">
        <div className="sticky top-0 flex flex-col h-screen p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <ShoppingCart size={28} className="text-slate-900" />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-4 ring-slate-50">{cart.length}</span>}
            </div>
            <h2 className="text-xl font-black uppercase text-slate-900">Your Cart</h2>
          </div>

          <div className="flex-1 pr-2 space-y-4 overflow-y-auto custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <ShoppingBag size={48} className="mb-4" />
                <p className="text-sm font-bold tracking-widest uppercase">Bag is Empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 bg-white border shadow-sm rounded-2xl border-slate-100 group">
                  <img src={item.image} className="object-contain w-12 h-12" alt={item.name} />
                  <div className="flex-1">
                    <p className="w-32 text-sm font-black truncate text-slate-900">{item.name}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase">{item.quantity} × {item.price} DT</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 transition-colors text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ============ PRESCRIPTION + AI EXTRACTION ============ */}
          <div className="pt-6 mt-6 border-t border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              Prescription (optional)
            </p>

            {!prescriptionFile ? (
              <label className="flex items-center justify-center gap-2 py-3 text-xs font-bold transition-colors bg-white border-2 border-dashed cursor-pointer text-slate-500 border-slate-200 rounded-2xl hover:border-rose-300 hover:bg-rose-50/30">
                <Upload size={16} />
                Attach prescription
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handlePrescriptionChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white border shadow-sm border-slate-100 rounded-2xl">
                  {prescriptionPreview === "pdf" ? (
                    <div className="flex items-center justify-center w-10 h-10 bg-slate-50 rounded-xl">
                      <FileText className="text-slate-400" size={18} />
                    </div>
                  ) : (
                    <img src={prescriptionPreview} alt="prescription" className="object-cover w-10 h-10 rounded-xl" />
                  )}
                  <p className="flex-1 text-xs font-bold truncate text-slate-700">{prescriptionFile.name}</p>
                  <button onClick={removePrescription} className="text-slate-300 hover:text-rose-500">
                    <X size={16} />
                  </button>
                </div>

                {analyzing && (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-violet-500">
                    <Loader2 className="animate-spin" size={14} /> Analyse IA en cours...
                  </div>
                )}

                {aiError && (
                  <p className="text-[11px] font-bold text-center text-amber-600">{aiError}</p>
                )}

                {extractedMeds && extractedMeds.length > 0 && (
                  <div className="p-3 space-y-2 border bg-violet-50/50 border-violet-100 rounded-2xl">
                    <p className="text-[9px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={10} /> Detected by AI
                    </p>
                    {extractedMeds.map((med, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-xl">
                        <Pencil size={12} className="text-slate-300" />
                        <input
                          value={med.name}
                          onChange={(e) => updateExtractedMed(index, "name", e.target.value)}
                          className="flex-1 text-xs font-bold outline-none text-slate-800"
                        />
                        <input
                          value={med.dosage || ""}
                          onChange={(e) => updateExtractedMed(index, "dosage", e.target.value)}
                          placeholder="dosage"
                          className="w-16 text-[10px] font-medium text-center outline-none text-slate-500"
                        />
                        <button onClick={() => removeExtractedMed(index)} className="text-slate-300 hover:text-rose-500">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* ============ END PRESCRIPTION SECTION ============ */}

          <div className="pt-6 mt-2 border-t border-slate-200">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Bill</p>
                <p className="text-3xl font-black text-slate-900">{getTotal()} <span className="text-sm">DT</span></p>
              </div>
              <CreditCard className="text-slate-300" size={32} />
            </div>

            {orderError && (
              <p className="mb-3 text-xs font-bold text-center text-rose-500">{orderError}</p>
            )}

            <button
              onClick={placeOrderWithPrescription}
              disabled={cart.length === 0 || placingOrder || analyzing}
              className="group w-full py-5 bg-rose-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all active:scale-95 disabled:bg-slate-200 disabled:cursor-not-allowed shadow-xl shadow-rose-500/20"
            >
              {placingOrder ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Placing order...
                </>
              ) : (
                <>
                  Confirm Checkout
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            <p className="text-[9px] text-center mt-6 text-slate-400 font-bold uppercase tracking-widest">Secure encrypted checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medication;