import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface GameForm {
  title: string;
  description: string;
  show: boolean;
}

const EditGame = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<GameForm>({
    title: '',
    description: '',
    show: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      const toastId = toast.loading('Loading game data...');
      try {
        const response = await axios.get(`http://localhost:5000/api/games/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.status === 200) {
          const game = response.data;
          setForm({
            title: game.title,
            description: game.description || '',
            show: game.show || false
          });
          setCurrentImage(game.picture ? `http://localhost:5000/${game.picture}` : '');
          toast.success('Game loaded successfully', { id: toastId });
        }
      } catch (error) {
        console.error('Error fetching game:', error);
        toast.error('Failed to load game data', { 
          id: toastId,
          description: error.response?.data?.message || 'Please try again later'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File too large', {
          description: 'Maximum file size is 5MB'
        });
        return;
      }
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('show', String(form.show));
    if (file) formData.append('cover', file);

    const toastId = toast.loading('Updating game...');
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/games/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('Game updated successfully', { id: toastId });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error updating game:', error);
      toast.error('Failed to update game', { 
        id: toastId,
        description: error.response?.data?.message || 'Please check your input and try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">Edit Game</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            placeholder="Game Title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Game Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="show"
            name="show"
            type="checkbox"
            checked={form.show}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            disabled={isSubmitting}
          />
          <Label htmlFor="show">Show this game to users</Label>
        </div>

        {currentImage && (
          <div className="space-y-2">
            <Label>Current Cover Image</Label>
            <div className="border rounded-md p-2 max-w-xs">
              <img 
                src={currentImage} 
                alt="Current cover" 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="cover">
            {currentImage ? 'Replace Cover Image' : 'Add Cover Image'}
          </Label>
          <Input
            id="cover"
            name="cover"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <p className="text-sm text-muted-foreground">
            Supports JPG, PNG, WEBP (Max 5MB)
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-32"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditGame;