
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches] = useState(['London', 'New York', 'Tokyo', 'Paris', 'Sydney']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm('');
    }
  };

  const handleRecentSearch = (city: string) => {
    onSearch(city);
    setSearchTerm('');
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a city..."
          className="w-full backdrop-blur-lg text-white placeholder-white/70 rounded-2xl px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/20"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-200"
        >
          <Search className="w-6 h-6" />
        </button>
      </form>
      
      {/* Recent Searches */}
      <div className="mt-4">
        <p className="text-white/70 text-sm mb-2">Recent searches:</p>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((city, index) => (
            <button
              key={index}
              onClick={() => handleRecentSearch(city)}
              className="backdrop-blur-lg hover:backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
