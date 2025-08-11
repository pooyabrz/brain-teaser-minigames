import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin, MessageSquare } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Game Management System</h3>
            <p className="text-sm text-gray-400">
              The ultimate solution for managing your gaming platform.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-800 hover:text-white">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-800 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-800 hover:text-white">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-800 hover:text-white">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Features</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Releases</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Terms</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Licenses</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} Game Management System. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;