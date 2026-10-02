import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [cart, setCart] = useState([]);

    const addToCart = (med) => {
        setCart((prev) => {
            const existing = prev.find(item => item._id === med._id);

            if (existing) {
                return prev.map(item =>
                    item._id === med._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { ...med, quantity: 1 }];
        });
    };

    
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter(item => item._id !== id));
    };

    
    const clearCart = () => {
        setCart([]);
    };

    
    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };


    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        return dateArray[0] + " " + months[Number(dateArray[1] - 1)] + " " + dateArray[2];
    };

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    };

    

    const value = {
        backendUrl,
        currency,

        
        slotDateFormat,
        calculateAge,

        
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;