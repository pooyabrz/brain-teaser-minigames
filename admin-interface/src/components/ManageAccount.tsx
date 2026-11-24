// src/components/ManageAccount.jsx
import { useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ManageAccount = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Assumes the token is stored here after login
    try {
      const response = await axios.post('/api/admin/change-password', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setForm({ currentPassword: '', newPassword: '' });
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setMessage(message || 'Error changing password');
    }
  };

  return (
    <div className="p-4">
      <h2>Manage Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
        />
        <Button type="submit">Change Password</Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ManageAccount;
