import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Pencil, Eye, EyeOff, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Game {
  _id: string;
  title: string;
  description: string;
  picture: string;
  load: number;
  show: boolean;
  createdAt: string;
  updatedAt: string;
}

const SearchGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Game; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games');
        if (!res.ok) throw new Error('Failed to fetch games');
        const data = await res.json();
        setGames(data);
        setFilteredGames(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const results = games.filter(game =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGames(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, games]);

  const requestSort = (key: keyof Game) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedGames = React.useMemo(() => {
    if (!sortConfig) return filteredGames;

    return [...filteredGames].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredGames, sortConfig]);

  // Pagination logic
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = sortedGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(sortedGames.length / gamesPerPage);

  const getSortIcon = (key: keyof Game) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown className="ml-1 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Search games by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstGame + 1}-{Math.min(indexOfLastGame, sortedGames.length)} of {sortedGames.length} games
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {getSortIcon('title')}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('load')}
              >
                <div className="flex items-center">
                  Players
                  {getSortIcon('load')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('show')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('show')}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentGames.length > 0 ? (
              currentGames.map((game) => (
                <TableRow key={game._id}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell className="text-gray-600 line-clamp-1">
                    {game.description || 'No description'}
                  </TableCell>
                  <TableCell>{game.load}</TableCell>
                  <TableCell>
                    <Badge variant={game.show ? 'default' : 'secondary'}>
                      {game.show ? (
                        <>
                          <Eye className="mr-1 h-3 w-3" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" /> Hidden
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/edit-game/${game._id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchTerm ? 'No matching games found' : 'No games available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchGames;