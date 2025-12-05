import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div>Loading...</div>;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <div className="mt-4">
        <p>
          Favorite Games: {user.favorites && user.favorites.length > 0 
            ? user.favorites.join(', ') 
            : 'None'}
        </p>
        <p>
          Starred Games: {user.starred && user.starred.length > 0 
            ? user.starred.join(', ') 
            : 'None'}
        </p>
      </div>
      <div className="mt-6">
        <Button onClick={() => navigate('/games')} className="mr-2">
          View Games
        </Button>
        <Button onClick={() => navigate('/account')}>
          Account Settings
        </Button>
      </div>
    </Card>
  );
};

export default Dashboard;
