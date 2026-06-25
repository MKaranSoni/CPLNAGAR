import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
// Importing Page Components
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import VerifyOtp from '../pages/VerifyOtp';
import HomeDashboard from '../pages/HomeDashboard';
import ComplaintUpload from '../pages/ComplaintUpload';
import ComplaintTracking from '../pages/ComplaintTracking';
import CommunityFeed from '../pages/CommunityFeed';
import VolunteerGroups from '../pages/VolunteerGroups';
import Leaderboard from '../pages/Leaderboard';
import UserProfile from '../pages/UserProfile';
import Notifications from '../pages/Notifications';
import AqiDashboard from '../pages/AqiDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AnalyticsDashboard from '../pages/AnalyticsDashboard';
import Settings from '../pages/Settings';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Guest Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          {/* /signup and /register both render the Signup page */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Signup />} />
          {/* OTP Verification — reached after successful send-otp */}
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>

        {/* Internal Application Routes wrapped inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<HomeDashboard />} />
          <Route path="/upload" element={<ComplaintUpload />} />
          <Route path="/tracking" element={<ComplaintTracking />} />
          <Route path="/feed" element={<CommunityFeed />} />
          <Route path="/volunteers" element={<VolunteerGroups />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/aqi" element={<AqiDashboard />} />

          {/* Admin specific portals */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Global Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
