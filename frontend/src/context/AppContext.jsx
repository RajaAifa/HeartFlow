import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = " DT ";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const aiUrl = import.meta.env.VITE_AI_URL;

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userData, setUserData] = useState(false);

    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    const addToCart = (item) => {
        setCart((prev) => {
            const exist = prev.find((i) => i._id === item._id);

            if (exist) {
                return prev.map((i) =>
                    i._id === item._id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [...prev, { ...item, quantity: 1 }];
        });

        toast.success(`${item.name} ajouté au panier`);
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item._id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotal = () => {
        return cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    };

const placeOrder = async (addressData = null) => {
    try {
        if (!token) return toast.error("Please login first");
        if (cart.length === 0) return toast.error("Cart is empty");

        const formattedItems = cart.map(item => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        const { data } = await axios.post(
            `${backendUrl}/api/user/place-order`,
            {
                items: formattedItems,
                amount: getTotal(),

                patient: {
                    id: userData?._id,
                    name: userData?.name,
                    email: userData?.email,
                    phone: userData?.phone,
                    image: userData?.image,
                    gender: userData?.gender,
                    dob: userData?.dob,
                },

                address: addressData || userData?.address || {
                    line1: "",
                    line2: "",
                    city: "",
                    phone: userData?.phone || "00000000",
                },
            },
            { headers: { token } }
        );

        if (data.success) {
            toast.success("Order placed successfully");

            clearCart();
            getUserOrders();

            window.dispatchEvent(new Event("refresh-meds"));
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
};
    const getDoctosData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/list`
            );
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/user/get-profile`,
                { headers: { token } }
            );

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };


    // GET USER ORDERS
    const getUserOrders = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/user/orders`,
                { headers: { token } }
            );

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/cancel-order`,
                { orderId },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getUserOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };


    useEffect(() => {
        getDoctosData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
            getUserOrders();
        }
    }, [token]);


    const value = {
        
        currencySymbol,
        backendUrl,
        aiUrl,

        
        token,
        setToken,

        
        userData,
        setUserData,
        loadUserProfileData,

        
        doctors,
        getDoctosData,

        
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotal,
        placeOrder,

        orders,
        getUserOrders,
        cancelOrder,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;