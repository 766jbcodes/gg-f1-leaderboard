import React from 'react';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-border mt-auto">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/season/2023" className="hover:text-foreground transition-colors">2023 Season</Link>
          <Link to="/season/2024" className="hover:text-foreground transition-colors">2024 Season</Link>
          <Link to="/season/2025" className="hover:text-foreground transition-colors">2025 Season</Link>
        </div>
        <p>© {new Date().getFullYear()} aufintools. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
