
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
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search videos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-48 sm:w-64 bg-dark-800/80 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all backdrop-blur-sm"
        aria-label="Search videos"
      />
    </form>
  );
}

function App() {

  return (
    <HashRouter>
      <div className="min-h-screen bg-tube text-gray-100">
        {/* Header with tube site styling */}
        <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-dark-800/50 shadow-xl">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-3 text-2xl font-bold text-white hover:text-accent-orange transition-colors duration-300 group">
                <div className="p-2 bg-gradient-to-r from-accent-orange to-accent-pink rounded-lg group-hover:shadow-lg group-hover:shadow-accent-orange/30 transition-all">
                  <FilmIcon className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Ebony Banger
                </span>
              </Link>

              <div className="flex items-center gap-6">
                <SearchBar />
                <div className="hidden md:flex items-center gap-4">
                  <Link 
                    to="/add" 
                    className="px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-pink text-white rounded-lg hover:shadow-lg hover:shadow-accent-orange/30 transition-all font-medium"
                  >
                    Upload
                  </Link>
                  <button className="px-4 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700 hover:text-white transition-all font-medium border border-dark-700">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Main content with tube site background */}
        <main className="bg-gradient-to-b from-dark-900 to-tube">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/video/:slug" element={<WatchPage />} />
            <Route path="/add" element={<AddVideoPage />} />
            {/* New routes for management and analytics */}
            {/* <Route path="/manage-videos" element={<ManageVideosPage />} /> */}
            {/* <Route path="/analytics" element={<AnalyticsPage />} /> */}
          </Routes>
        </main>

        {/* Footer with tube site styling */}
        <footer className="bg-dark-950 border-t border-dark-800 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-white font-bold mb-3">Categories</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-accent-orange transition-colors">Popular</a></li>
                  <li><a href="#" className="hover:text-accent-orange transition-colors">Trending</a></li>
                  <li><a href="#" className="hover:text-accent-orange transition-colors">New</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3">Community</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-accent-orange transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-accent-orange transition-colors">Forums</a></li>
                  <li><a href="#" className="hover:text-accent-orange transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3">About</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-accent-orange transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-accent-orange transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-accent-orange transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3">Follow Us</h3>
                <div className="flex space-x-3">
                  <a href="#" className="w-8 h-8 bg-dark-800 rounded-full flex items-center justify-center hover:bg-accent-orange transition-colors">
                    <span className="text-sm">T</span>
                  </a>
                  <a href="#" className="w-8 h-8 bg-dark-800 rounded-full flex items-center justify-center hover:bg-accent-orange transition-colors">
                    <span className="text-sm">F</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-dark-800 mt-6 pt-6 text-center text-gray-500">
              <p>&copy; 2024 Ebony Banger. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <StickyWidget />
        <DailyPopup />
      </div>
    </HashRouter>
  );
}

export default App;
