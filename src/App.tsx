import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { Header } from './components/Header';
import { F1Dashboard } from './components/F1Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

const Admin = lazy(() => import('./components/Admin').then(m => ({ default: m.Admin })));
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PointsFinishPage } from './components/PointsFinishPage';
import { SetPredictions2026Page } from './components/SetPredictions2026Page';
import { EnsureRaceResultsSync } from './components/EnsureRaceResultsSync';

// Component to handle Hero visibility based on route
const HeroSection = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  // Apple-style hero: full height on home, smaller on subpages, or just cleaner overall
  // For this app, let's make it impactful but not overwhelming on subpages
  const heightClass = isHome ? 'min-h-[70vh] md:min-h-[80vh]' : 'min-h-[40vh] md:min-h-[50vh]';
  
  return (
    <div className={`relative overflow-hidden transition-all duration-700 ease-in-out ${heightClass} flex items-end`}>
      {/* Background Image with Parallax-like feel (fixed bg) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: 'url(/assets/Gunter2026.webp)',
        }}
      />
      
      {/* Sophisticated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-navy/30" />
      <div className="absolute inset-0 bg-navy/20 backdrop-blur-[1px]" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12 md:pb-20">
        <div className={`transition-all duration-700 delay-100 ${isHome ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-0 scale-95 origin-bottom-left'}`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-xl mb-2 font-display">
            Gunther's <span className="text-papaya">Groupies</span>
          </h1>
          <div className="h-1.5 w-32 bg-papaya rounded-full mb-6" />
          
          <h2 className="text-xl md:text-3xl font-medium tracking-wide text-white/90 max-w-2xl">
            F1 Leaderboard & Predictions
          </h2>
          
          
        </div>
      </div>
    </div>
  );
};

const SPLASH_DURATION_MS = 2500;
const SPLASH_FADE_MS = 800;

function AppContent() {
  const [showAdmin, setShowAdmin] = useState(false);
  const location = useLocation();
  const [splashDone, setSplashDone] = useState(false);
  const isHome = location.pathname === '/';

  // On homepage first load: show splash, then fade to page
  useEffect(() => {
    if (!isHome || splashDone) return;
    const t = setTimeout(() => setSplashDone(true), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, [isHome, splashDone]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-papaya/30">
      {/* Full-screen splash on homepage: only Gunter2026 image, then fades to page */}
      {isHome && (
        <div
          aria-hidden="true"
          className={`fixed inset-0 z-[100] bg-cover bg-center bg-no-repeat ease-out ${splashDone ? 'pointer-events-none' : ''}`}
          style={{
            backgroundImage: 'url(/assets/Gunter2026.webp)',
            opacity: splashDone ? 0 : 1,
            transition: `opacity ${SPLASH_FADE_MS}ms ease-out`,
          }}
        />
      )}

      <Header showAdmin={showAdmin} setShowAdmin={setShowAdmin} />
      
      {!showAdmin && <HeroSection />}

        <EnsureRaceResultsSync />
        {showAdmin ? (
          <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8 text-center text-navy font-bold">Loading admin…</div>}>
            <Admin onExit={() => setShowAdmin(false)} />
          </Suspense>
        ) : (
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <MainLayout>
              <F1Dashboard season="current" />
            </MainLayout>
          } />
          <Route path="/season/2023" element={
            <MainLayout>
              <F1Dashboard season="2023" />
            </MainLayout>
          } />
          <Route path="/season/2024" element={
            <MainLayout>
              <F1Dashboard season="2024" />
            </MainLayout>
          } />
          <Route path="/season/2025" element={
            <MainLayout>
              <F1Dashboard season="2025" />
            </MainLayout>
          } />
          <Route path="/season/2026" element={
            <MainLayout>
              <F1Dashboard season="2026" />
            </MainLayout>
          } />
          <Route path="/season/2026/predictions" element={
            <ProtectedRoute>
              <MainLayout>
                <SetPredictions2026Page />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/points-finish" element={
            <ProtectedRoute>
              <MainLayout>
                <PointsFinishPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
