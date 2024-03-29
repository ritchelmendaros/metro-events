import './App.css';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardUser from './pages/DashboardUser';
import DashboardUserEvents from './pages/DashboardUserEvents';
import DashboardOrganizer from './pages/DashboardOrganizer';
import DashboardAdmin from './pages/DashboardAdmin';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import DashboardUserProfile from './pages/DashboardUserProfile';
import DashboardAdminProfile from './pages/DashboardAdminProfile';
import DashboardAdminEvents from './pages/DashboardAdminEvents';
import DashboardAdminParticipants from './pages/DashboardAdminParticipants';
import DashboardOrganizerParticipant from './pages/DashboardOrganizerParticipants';
import DashboardCreateEvents from './pages/DashboardCreateEvents';
import DashboardOrganizerProfile from './pages/DashboardOrganizerProfile';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/user" element={<DashboardUser />} />
      <Route path="/dashboard/user/events" element={<DashboardUserEvents />} />
      <Route path="/dashboard/organizer" element={<DashboardOrganizer />} />
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      <Route path="/dashboard/user/profile" element={<DashboardUserProfile />} />
      <Route path="/dashboard/admin/events" element={<DashboardAdminEvents />} />
      <Route path="/dashboard/admin/profile" element={<DashboardAdminProfile />} />
      <Route path="/dashboard/admin/participants/:eventid" element={<DashboardAdminParticipants />} />
      <Route path="/dashboard/organizer/participants/:eventid" element={<DashboardOrganizerParticipant />} />
      <Route path="/dashboard/organizer/createevents" element={<DashboardCreateEvents />} />
      <Route path="/dashboard/organizer/profile" element={<DashboardOrganizerProfile />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
