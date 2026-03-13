import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plane, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { AIRPORTS } from '../../utils/constants';

const RouteAutocomplete = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  excludeCode,
  error 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const airport = AIRPORTS.find(a => a.code === value);
      setInputValue(airport ? `${airport.city} (${airport.code})` : '');
    } else {
      setInputValue('');
    }
  }, [value]);

  const fuse = useMemo(() => {
    return new Fuse(AIRPORTS, {
      keys: [
        { name: 'code', weight: 0.3 },
        { name: 'city', weight: 0.4 },
        { name: 'name', weight: 0.2 },
        { name: 'country', weight: 0.1 },
      ],
      includeScore: true,
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, []);

  const handleInputChange = (e) => {
    const search = e.target.value;
    setInputValue(search);
    setSelectedIndex(-1);

    if (search.length >= 2) {
      const results = fuse.search(search, { limit: 8 });
      const filtered = results
        .map((result) => result.item)
        .filter((airport) => airport.code !== excludeCode);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (airport) => {
    onChange(airport.code);
    setInputValue(`${airport.city} (${airport.code})`);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    onChange('');
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const popularAirports = AIRPORTS.filter(a => 
    ['DEL', 'BOM', 'BLR', 'HYD', 'MAA'].includes(a.code)
  );

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10 pr-10 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          autoComplete="off"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
          >
            {/* Recent/Popular Section */}
            {suggestions.length === 0 && inputValue.length >= 2 ? (
              <div className="p-4 text-center text-gray-500">
                No airports found
              </div>
            ) : (
              <>
                {suggestions.length > 0 && (
                  <div className="p-2">
                    {suggestions.map((airport, index) => (
                      <motion.div
                        key={airport.code}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(airport)}
                        className={`p-3 rounded-lg cursor-pointer flex items-start gap-3 ${
                          index === selectedIndex 
                            ? 'bg-indigo-50 border-indigo-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          index === selectedIndex ? 'bg-indigo-100' : 'bg-gray-100'
                        }`}>
                          <Plane className={`h-4 w-4 ${
                            index === selectedIndex ? 'text-indigo-600' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{airport.city}</span>
                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                              index === selectedIndex ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {airport.code}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">{airport.name}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Popular Airports Quick Select */}
            {!inputValue && (
              <div className="border-t p-3">
                <p className="text-xs font-medium text-gray-500 mb-2">POPULAR AIRPORTS</p>
                <div className="flex flex-wrap gap-2">
                  {popularAirports.map(airport => (
                    <button
                      key={airport.code}
                      onClick={() => handleSelect(airport)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                    >
                      {airport.code} - {airport.city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RouteAutocomplete;