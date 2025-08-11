import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const Header = () => {
  const navigate = useNavigate();
  const { user, slogan } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.get('/api/logout'); // Make sure your backend handles logout here.
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-900 border-gray-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Game Management System
          </h1>
          {user && (
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Button variant="ghost" className="text-gray-300 hover:bg-gray-800 hover:text-white">
                Dashboard
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:bg-gray-800 hover:text-white">
                Games
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:bg-gray-800 hover:text-white">
                Users
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:bg-gray-800 hover:text-white">
                Analytics
              </Button>
            </nav>
          )}
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-800">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gray-700 text-gray-300">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-white" align="end" forceMount>
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gray-700 text-gray-300">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-400">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
              <Separator className="bg-gray-800" />
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                <User className="mr-2 h-4 w-4 text-gray-400" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                <Settings className="mr-2 h-4 w-4 text-gray-400" />
                <span>Settings</span>
              </DropdownMenuItem>
              <Separator className="bg-gray-800" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
              >
                <LogOut className="mr-2 h-4 w-4 text-gray-400" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;