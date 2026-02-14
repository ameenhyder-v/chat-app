import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

//components
import Navbar from './components/Navbar';
import { Loader } from "lucide-react";

//pages:
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader className="size-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div data-theme={theme} className="min-h-screen bg-background">
      <Navbar />
      {/* Spacer for fixed navbar; content fills rest so no gap below input */}
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="h-14 sm:h-16 flex-shrink-0" aria-hidden />
        <div className="flex-1 min-h-0 overflow-hidden">
          <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default App