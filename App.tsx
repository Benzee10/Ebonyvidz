import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import AddVideoPage from './pages/AddVideoPage';
// Assuming these new pages will be created in the 'pages' directory
// import ManageVideosPage from './pages/ManageVideosPage';
// import AnalyticsPage from './pages/AnalyticsPage';
import { FilmIcon, SearchIcon } from './components/Icons';
import StickyWidget from './components/StickyWidget';
import DailyPopup from './components/DailyPopup';
// Import PWA components
import PWAInstallButton from './components/PWAInstallButton';
import OfflineIndicator from './components/OfflineIndicator';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search videos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-48 sm:w-64 bg-white border border-red-300 rounded-lg py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
        aria-label="Search videos"
      />
    </form>
  );
}

function App() {
  useEffect(() => {
    // Force dark mode permanently
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        {/* Header with red navigation styling */}
        <header className="sticky top-0 z-50 bg-red-600 border-b border-red-700 shadow-xl">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-2 text-lg font-bold text-white hover:text-red-300 transition-colors duration-300 group">
                <div className="p-1.5 bg-gradient-to-r from-red-600 to-red-800 rounded-lg group-hover:shadow-lg group-hover:shadow-red-600/40 transition-all">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c-1.5 0-2.8.8-3.5 2-.3.5-.5 1.1-.5 1.7 0 .8.3 1.5.7 2.1.2.3.4.6.6.8l.2.2c.1.1.2.2.3.3.5.5 1.1.9 1.7 1.1.3.1.6.2.9.2h.2c.3 0 .6-.1.9-.2.6-.2 1.2-.6 1.7-1.1.1-.1.2-.2.3-.3l.2-.2c.2-.2.4-.5.6-.8.4-.6.7-1.3.7-2.1 0-.6-.2-1.2-.5-1.7C14.8 2.8 13.5 2 12 2zm0 15c-2.5 0-4.5 1.5-4.5 3.5V22h9v-1.5c0-2-2-3.5-4.5-3.5z"/>
                    <path d="M8 12c-.5 0-1 .2-1.4.6-.8.8-.8 2 0 2.8.4.4.9.6 1.4.6s1-.2 1.4-.6c.8-.8.8-2 0-2.8C9 12.2 8.5 12 8 12zm8 0c-.5 0-1 .2-1.4.6-.8.8-.8 2 0 2.8.4.4.9.6 1.4.6s1-.2 1.4-.6c.8-.8.8-2 0-2.8C17 12.2 16.5 12 16 12z"/>
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-red-100 to-red-200 bg-clip-text text-transparent">
                  XXXPULSE
                </span>
              </Link>

              <div className="flex items-center gap-6">
                <SearchBar />
                <div className="hidden md:flex items-center gap-4">
                    <Link
                      to="/add"
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg hover:shadow-red-600/40 transition-all font-medium hover:from-red-500 hover:to-red-600"
                    >
                      Upload
                    </Link>
                    <button className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all font-medium border border-red-300">
                      Sign In
                    </button>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Main content with responsive background */}
        <main className="bg-white dark:bg-gray-900 transition-colors">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/video/:slug" element={<WatchPage />} />
            <Route path="/add" element={<AddVideoPage />} />
            {/* New routes for management and analytics */}
            {/* <Route path="/manage-videos" element={<ManageVideosPage />} /> */}
            {/* <Route path="/analytics" element={<AnalyticsPage />} /> */}
          </Routes>
        </main>

        <StickyWidget />
        <DailyPopup />
      </div>
    </HashRouter>
  );
}

export default App;