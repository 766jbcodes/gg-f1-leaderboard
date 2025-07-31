import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showAdmin, setShowAdmin }) => {
  return (
    <>
      {children}
      {/* Season/Admin Links */}
      <div className="flex flex-wrap gap-4 justify-end py-4 px-4 items-center">
        <a href="/" className="text-xs text-gray-500 hover:text-navy transition-colors">Current Season</a>
        <a href="/season/2024" className="text-xs text-gray-500 hover:text-navy transition-colors">2024 Season</a>
        <a href="/season/2023" className="text-xs text-gray-500 hover:text-navy transition-colors">2023 Season</a>
        {showAdmin ? (
          <button
            onClick={() => setShowAdmin(false)}
            className="text-xs text-gray-500 hover:text-navy transition-colors"
          >
            ← Back to Leaderboard
          </button>
        ) : (
          <button
            onClick={() => setShowAdmin(true)}
            className="text-xs text-gray-500 hover:text-navy transition-colors"
          >
            Admin
          </button>
        )}
      </div>
    </>
  );
};

export default MainLayout; 