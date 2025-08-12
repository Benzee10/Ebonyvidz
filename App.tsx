
import React, { useState } from 'react';
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

  return (
    <HashRouter>
      <div className="min-h-screen bg-white text-gray-900" style={{backgroundColor: '#ffffff !important'}}>
        {/* Header with red navigation styling */}
        <header className="sticky top-0 z-50 bg-red-600 border-b border-red-700 shadow-xl">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-3 text-2xl font-bold text-white hover:text-red-300 transition-colors duration-300 group">
                <div className="p-2 bg-gradient-to-r from-red-600 to-red-800 rounded-lg group-hover:shadow-lg group-hover:shadow-red-600/40 transition-all">
                  <FilmIcon className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-red-100 to-red-200 bg-clip-text text-transparent">
                  Ebony Banger
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

        {/* Main content with white background */}
        <main className="bg-white">
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
