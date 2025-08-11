import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/user/games')
      .then(response => {
        setGames(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching games');
        setLoading(false);
      });
  }, []);

  const handleFavorite = (gameId) => {
    axios.post(`/api/user/favorite/${gameId}`)
      .then(response => alert(response.data.message))
      .catch(err => alert('Error adding favorite'));
  };

  const handleStar = (gameId) => {
    axios.post(`/api/user/star/${gameId}`)
      .then(response => alert(response.data.message))
      .catch(err => alert('Error starring game'));
  };

  const handleJoin = (gameId) => {
    axios.post(`/api/user/join/${gameId}`)
      .then(response => alert(`Joined game! New load: ${response.data.load}`))
      .catch(err => alert('Error joining game'));
  };

  if (loading) return <div className="p-4">Loading games...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {games.map(game => (
        <Card key={game._id} className="p-4">
          <h3 className="text-xl font-semibold">{game.title}</h3>
          <p className="mt-2">{game.description}</p>
          {game.picture && (
            <img
              src={game.picture}
              alt={game.title}
              className="w-full h-auto mt-2 rounded-md"
            />
          )}
          <div className="mt-4 space-x-2">
            <Button onClick={() => handleFavorite(game._id)}>Favorite</Button>
            <Button onClick={() => handleStar(game._id)}>Star</Button>
            <Button onClick={() => handleJoin(game._id)}>Join Game</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Games;
