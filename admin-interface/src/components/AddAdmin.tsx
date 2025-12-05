import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AddAdmin = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/create', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setForm({ username: '', password: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating admin');
    }
  };

  return (
    <div className="p-4">
      <h2>Add New Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit">Create Admin</Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddAdmin;