import React, { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
     const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
   const [dashData, setDashData] = useState([]);
    const [emergencies, setEmergencies] = useState([]);
    const [messages, setMessages] = useState([]);
    const [orders, setOrders] = useState([]);

   
    const [comments, setComments] = useState([]);

    const getAllComments = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/admin/comments",
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                setComments(data.comments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const { data } = await axios.delete(
                backendUrl + "/api/admin/comment",
                {
                    headers: { atoken: aToken },
                    data: { commentId }
                }
            );

            if (data.success) {
                toast.success("Comment deleted");
                getAllComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const blockUser = async (userId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/block-user",
                { userId },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success("User blocked");
                getAllComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const unblockUser = async (userId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/unblock-user",
                { userId },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success("User unblocked");
                getAllComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    //////////////////////user managenment 
    const getAllUsers = async () => {
    try {
        const { data } = await axios.get(
            backendUrl + "/api/admin/users",
            { headers: { atoken: aToken } }
        );

        if (data.success) {
            setUsers(data.users);
        } else {
            toast.error(data.message);
        }

    } catch (error) {
        toast.error(error.message);
    }
};
/////////////////only 1 user

const getUserProfile = async (userId) => {
    try {
        const { data } = await axios.get(
            backendUrl + `/api/admin/user/${userId}`,
            { headers: { atoken: aToken } }
        );

        if (data.success) {
            setSelectedUser(data);
        } else {
            toast.error(data.message);
        }

    } catch (error) {
        toast.error(error.message);
    }
};

 
    
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/admin/all-doctors",
                { headers: { atoken: aToken } }
            );

            if (data.success) setDoctors(data.doctors);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/change-availability",
                { docId },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/admin/appointments",
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/cancel-appointment",
                { appointmentId },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

   
    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/admin/admin-dashboard",
                { headers: { aToken } }
            );

            if (data.success) setDashData(data.dashData);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAllOrders = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/admin/orders",
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                setOrders(data.orders.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/update-order-status",
                { orderId, status },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/delete-order",
                { orderId },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getContactMessages = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/contact/all",
                { headers: { atoken: aToken } }
            );

            if (data.success) setMessages(data.messages);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteContactMessage = async (id) => {
        try {
            const { data } = await axios.delete(
                backendUrl + `/api/contact/delete/${id}`,
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getContactMessages();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAllEmergencies = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/emergency/all",
                { headers: { atoken: aToken } }
            );

            if (Array.isArray(data)) {
                setEmergencies(data);
            } else if (data.success) {
                setEmergencies(data.emergencies);
            } else {
                setEmergencies([]);
            }
        } catch (error) {
            setEmergencies([]);
        }
    };

    const resolveEmergency = async (id) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/emergency/resolve",
                { id },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                setEmergencies(prev => prev.filter(e => e._id !== id));
                toast.success("Alert resolved");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        aToken,
        setAToken,
        backendUrl,

        doctors,
        getAllDoctors,
        changeAvailability,

        appointments,
        getAllAppointments,
        cancelAppointment,

        dashData,
        getDashData,

        emergencies,
        getAllEmergencies,
        resolveEmergency,

        messages,
        getContactMessages,
        deleteContactMessage,

        orders,
        getAllOrders,
        updateOrderStatus,
        deleteOrder,

          users,
         getAllUsers,
         selectedUser,
         getUserProfile,
         
        comments,
        getAllComments,
        deleteComment,
        blockUser,
        unblockUser
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;