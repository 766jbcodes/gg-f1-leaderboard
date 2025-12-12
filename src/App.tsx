import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { F1Dashboard } from './components/F1Dashboard';
import { Admin } from './components/Admin';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-silver font-sans">
        {/* Enhanced Visual Header */}
        <div className="relative overflow-hidden" style={{ minHeight: '880px' }}>
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/assets/487935280_3207694832727089_5004635654345518064_n.webp)',
      
            }}
          />
          {/* Gradient Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy/90" />
          {/* Red Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-red" />
          {/* Header Content anchored at the bottom */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col justify-end h-full" style={{ minHeight: '880px' }}>
            <div className="mb-8">
              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wider text-center text-white drop-shadow-2xl mb-3">
                Gunther's Groupies
              </h1>
              {/* Subtitle with Enhanced Styling */}
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-red drop-shadow-lg mb-2">
                  F1 Leaderboard
                </h2>
                <p className="text-lg font-semibold text-silver/90 tracking-wide max-w-2xl mx-auto">
                "Those who have knowledge, don't predict. Those who predict, don't have knowledge."
                </p>
              </div>
            </div>
          </div>
        </div>

        {showAdmin ? (
          <Admin />
        ) : (
          <Routes>
            <Route path="/" element={
              <MainLayout showAdmin={showAdmin} setShowAdmin={setShowAdmin}>
                <F1Dashboard season="current" />
              </MainLayout>
            } />
            <Route path="/season/2023" element={
              <MainLayout showAdmin={showAdmin} setShowAdmin={setShowAdmin}>
                <F1Dashboard season="2023" />
              </MainLayout>
            } />
            <Route path="/season/2024" element={
              <MainLayout showAdmin={showAdmin} setShowAdmin={setShowAdmin}>
                <F1Dashboard season="2024" />
              </MainLayout>
            } />
          </Routes>
        )}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
