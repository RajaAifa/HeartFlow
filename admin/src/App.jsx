import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import EmergencyAlerts from './pages/Admin/EmergencyAlerts';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import ContactMessages from './pages/Admin/ContactMessages';
import DoctorPredictor from './pages/Doctor/DoctorPredictor';
import MLPrediction from './pages/Doctor/MLPrediction';
import DiabetesForm from './pages/Doctor/DiabetesForm'
import ResetPassword from './pages/ResetPassword';
import MedicationOrders from './pages/Admin/MedicationOrders'; 
import Comments from "./pages/Admin/Comments";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminUserProfile from "./pages/Admin/AdminUserProfile";
import DoctorPro from "./pages/Admin/DoctorPro";
import DoctorSchedule from "./pages/Doctor/DoctorSchedule";
import EditUser from "./pages/Admin/EditUser"
import CreateUser from "./pages/Admin/CreateUser"
import EditDoctor from './pages/Admin/EditDoctor';
import AdminMedication from "./pages/Admin/AdminMedication";
import PatientDossier from './pages/Doctor/Patientdossier';
const App = () => {
  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      
      {(dToken || aToken) && <Navbar />}

      <div className='flex items-start'>
        {(dToken || aToken) && <Sidebar />}

        <Routes>
          {!dToken && !aToken && (
            <>
              <Route path='/' element={<Login />} />
              <Route path='/login' element={<Login />} />
              <Route path='/reset-password/:role/:token' element={<ResetPassword />} />
            </>
          )}

          {(dToken || aToken) && (
            <>
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllAppointments />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/doctor-list' element={<DoctorsList />} />
              <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
              <Route path='/doctor-appointments' element={<DoctorAppointments />} />
              <Route path='/doctor-profile' element={<DoctorProfile />} />
              <Route path='/medication-orders' element={<MedicationOrders />} />
              <Route path='/emergency-alerts' element={<EmergencyAlerts />} />
              <Route path='/contact-messages' element={<ContactMessages />} />
              <Route path='/doctor-predictor' element={< DoctorPredictor/>} />
             <Route path='/doctor-diabetes' element={< DiabetesForm/>} />
             <Route path='/doctor-heart-disease' element={<MLPrediction/>} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
             <Route path="/admin/user/:userId" element={<AdminUserProfile />} />
             <Route path="/admin/doctor/:doctorId" element={<DoctorPro />} />
             <Route path="/doctor/schedule" element={<DoctorSchedule />} />
              <Route path="/admin/medication" element={<AdminMedication />} />
              <Route path="/admin/comments" element={<Comments />} />
            <Route path="/admin/create-user" element={<CreateUser />} />
            <Route path="/admin/user/edit/:id" element={<EditUser />} />  ""
            <Route path="/admin/doctor/edit/:id" element={<EditDoctor />} />
             <Route path='/patient-dossier' element={<PatientDossier />} />
              {/* ... add your other routes here ... */}
            </>
          )}
          
          <Route path='*' element={!(dToken || aToken) ? <Login /> : <></>} />
        </Routes>
      </div>
    </div>
  )
}
export default App ;