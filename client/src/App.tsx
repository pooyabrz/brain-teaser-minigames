import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Games from './pages/GamePage';
import Account from './pages/Account';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RPS from './pages/RPS';
import Sudoku from './pages/Sudoku';

import TicTacToe from './pages/TicTacToe';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/games" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Games />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/account" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Account />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/rps" 
            element={
              <Layout>
                <RPS />
              </Layout>
            }
          />
          <Route 
            path="/tictactoe" 
            element={
                <Layout className="flex justify-center">
                  <TicTacToe />
                </Layout>
            }
          />
          <Route 
            path="/sudoku" 
            element={
              <Layout>
                <Sudoku />
              </Layout>
            }
          />
          {/* Redirect any unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
