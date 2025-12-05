import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  const handleAppleLogin = () => {
    window.location.href = '/auth/apple';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Sign In</h1>
      <div className="space-x-4">
        <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
        <Button onClick={handleAppleLogin}>Sign in with Apple</Button>
      </div>
    </div>
  );
};

export default Login;
