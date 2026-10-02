import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Verify from './pages/Verify';
import Services from './pages/Services';
import Emergency from './pages/Emergency';
import HeartCare from './pages/HeartCare';
import Medication from './pages/Medication';
import Nutrition from './pages/Nutrition';
import ResetPassword from './pages/ResetPassword';

import PatientPrediction from './pages/PatientPrediction'; // patient
import FormPatient from './pages/FormPatient';
import Predictor from './pages/Predictor';
 
import OpenAIChat from "./components/OpenAIChat";

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/services' element={<Services />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />

        <Route path='/emergency' element={<Emergency />} />
        <Route path='/heart-care' element={<HeartCare />} />
        <Route path='/nutrition' element={<Nutrition />} />
        <Route path='/medication' element={<Medication />} />
       

        <Route path='/chatbot' element={<OpenAIChat />} />

        <Route path='/predictor' element={<Predictor />} />
        
        <Route path='/predictor/patient' element={<PatientPrediction />} />
        <Route path='/predictor/diabetes' element={<FormPatient />} />



      <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;