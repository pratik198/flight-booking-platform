import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp,
  Plane,
  Clock,
  DollarSign
} from 'lucide-react';
import Button from '../ui/Button';

const FilterSidebar = ({ isOpen, onClose, filters, onFilterChange, onApply, onClear }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    airlines: true,
    stops: true,
    departure: true,
    arrival: true
  });

  const airlines = [
    { code: '6E', name: 'IndiGo', count: 45 },
    { code: 'AI', name: 'Air India', count: 32 },
    { code: 'UK', name: 'Vistara', count: 28 },
    { code: 'SG', name: 'SpiceJet', count: 24 },
    { code: 'IX', name: 'Air India Express', count: 18 },
    { code: 'G8', name: 'Go First', count: 15 },
  ];

  const stops = [
    { label: 'Non-stop', value: '0', count: 28 },
    { label: '1 Stop', value: '1', count: 42 },
    { label: '2+ Stops', value: '2', count: 15 },
  ];

  const timeSlots = [
    { label: 'Morning (6AM - 12PM)', value: 'morning', icon: '🌅' },
    { label: 'Afternoon (12PM - 6PM)', value: 'afternoon', icon: '☀️' },
    { label: 'Evening (6PM - 12AM)', value: 'evening', icon: '🌆' },
    { label: 'Night (12AM - 6AM)', value: 'night', icon: '🌙' },
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = [...filters.priceRange];
    if (type === 'min') {
      newPriceRange[0] = value;
    } else {
      newPriceRange[1] = value;
    }
    onFilterChange('priceRange', newPriceRange);
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {expandedSections[section] ? 
          <ChevronUp className="h-4 w-4 text-gray-500" /> : 
          <ChevronDown className="h-4 w-4 text-gray-500" />
        }
      </button>
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto lg:static lg:shadow-none lg:z-auto lg:w-auto lg:transform-none"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Sections */}
              <div className="space-y-2">
                {/* Price Range */}
                <FilterSection title="Price Range" section="price">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Min (₹)</label>
                        <input
                          type="number"
                          value={filters.priceRange[0]}
                          onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                          className="w-full p-2 border rounded-lg text-sm"
                          min="0"
                          max={filters.priceRange[1]}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Max (₹)</label>
                        <input
                          type="number"
                          value={filters.priceRange[1]}
                          onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                          className="w-full p-2 border rounded-lg text-sm"
                          min={filters.priceRange[0]}
                          max="20000"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{filters.priceRange[0]}</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </FilterSection>

                {/* Airlines */}
                <FilterSection title="Airlines" section="airlines">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {airlines.map(airline => (
                      <label key={airline.code} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.airlines?.includes(airline.code)}
                            onChange={(e) => {
                              const newAirlines = e.target.checked
                                ? [...(filters.airlines || []), airline.code]
                                : filters.airlines?.filter(a => a !== airline.code);
                              onFilterChange('airlines', newAirlines);
                            }}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-indigo-600">
                            {airline.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">({airline.count})</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Stops */}
                <FilterSection title="Stops" section="stops">
                  <div className="space-y-2">
                    {stops.map(stop => (
                      <label key={stop.value} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.stops?.includes(stop.value)}
                            onChange={(e) => {
                              const newStops = e.target.checked
                                ? [...(filters.stops || []), stop.value]
                                : filters.stops?.filter(s => s !== stop.value);
                              onFilterChange('stops', newStops);
                            }}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-indigo-600">
                            {stop.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">({stop.count})</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Departure Time */}
                <FilterSection title="Departure Time" section="departure">
                  <div className="space-y-2">
                    {timeSlots.map(slot => (
                      <label key={slot.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.departureTimes?.includes(slot.value)}
                          onChange={(e) => {
                            const newTimes = e.target.checked
                              ? [...(filters.departureTimes || []), slot.value]
                              : filters.departureTimes?.filter(t => t !== slot.value);
                            onFilterChange('departureTimes', newTimes);
                          }}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{slot.icon} {slot.label}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={onApply}
                  variant="primary"
                  fullWidth
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={onClear}
                  variant="outline"
                  fullWidth
                >
                  Clear All
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;