import React, { useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Account = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    axios.post('/api/user/change-password', { currentPassword, newPassword })
      .then(response => setMessage(response.data.message))
      .catch(err => setMessage('Error changing password'));
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <form onSubmit={handleChangePassword}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            New Password
          </label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <Button type="submit">Change Password</Button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </Card>
  );
};

export default Account;
