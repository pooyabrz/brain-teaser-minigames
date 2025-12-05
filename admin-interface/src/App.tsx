import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import EditGame from './components/EditGame';

const AppContent = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4">
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <AdminLogin />} 
          />
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <AdminLogin />} 
          />
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/edit-game/:id" 
            element={isLoggedIn ? <EditGame /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;