import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AddGame = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    show: false,
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('show', form.show);
    // No need to set 'load' – it defaults to 0 in the backend model.
    if (file) {
      formData.append('cover', file);
    }
    try {
      const response = await axios.post('/api/games', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      if (response.status === 201) {
        alert('Game added successfully');
        setForm({ title: '', description: '', show: false });
        setFile(null);
        setUploadProgress(0);
      }
    } catch (err) {
      console.error('Error adding game', err);
      alert('Error adding game');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        placeholder="Game Title"
        value={form.title}
        onChange={handleChange}
      />
      <Textarea
        name="description"
        placeholder="Game Description"
        value={form.description}
        onChange={handleChange}
      />
      <label className="flex items-center space-x-2">
        <input
          name="show"
          type="checkbox"
          checked={form.show}
          onChange={handleChange}
        />
        <span>Show Game</span>
      </label>
      <Input
        name="cover"
        type="file"
        onChange={handleFileChange}
      />
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded">
          <div
            className="bg-blue-600 text-xs leading-none py-1 text-center text-white rounded"
            style={{ width: `${uploadProgress}%` }}
          >
            {uploadProgress}%
          </div>
        </div>
      )}
      <Button type="submit">Add Game</Button>
    </form>
  );
};

export default AddGame;
