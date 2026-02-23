import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';

import DashboardLayout from './dashboard/DashboardLayout';
import Dashboard from './dashboard/Dashboard';
import Profile from './dashboard/Profile';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import NotFound from './pages/NotFound';
import Diet from './pages/Diet';
import Exercise from './pages/Exercise';
import HydrateMore from './pages/Hydrate';
import Habits from './pages/Habits';
import Progress from './pages/Progress';
import ProtectedRoute from './auth/ProtectedRoute';


function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard (protected by DashboardLayout) */}
         <Route path="/dashboard" element={
         <ProtectedRoute>
           <DashboardLayout />
         </ProtectedRoute>
           }
         >
          <Route index element={<Dashboard />} />
          {/* relative path (correct nesting) */}
          <Route path="profile" element={<Profile />} />
          <Route path="habits" element={<Habits />} />
          <Route path="progress" element={<Progress />} />
        </Route>
        <Route path="/diet" element={<Diet/>} />
        <Route path="/exercise" element={<Exercise/>} />
        <Route path="/hydrate" element={<HydrateMore/>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
