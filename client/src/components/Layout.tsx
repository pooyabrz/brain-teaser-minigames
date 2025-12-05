import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer'
import Header from '../components/Header'


interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout : React.FC<LayoutProps> = ({ children, className = '' }) => {

  return (
    <div className="flex flex-col min-h-screen">
    <Header/>
      <main className={`flex-grow container mx-auto p-4 ${className}`}>
        {children}
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;