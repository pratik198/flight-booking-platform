import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  Clock, 
  Filter, 
  SlidersHorizontal,
  ChevronDown,
  X,
  ArrowUpDown,
  Wifi,
  Coffee,
  Battery
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import FilterSidebar from '../components/search/FilterSidebar';
import { FlightCardSkeleton } from '../components/common/Loader';
import { formatCurrency, formatTime, calculateDuration } from '../utils/helpers';
import flightService from '../services/flightService';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flights: initialFlights = [], searchParams } = location.state || {};
  
  const [filteredFlights, setFilteredFlights] = useState(initialFlights);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    airlines: [],
    priceRange: [0, 20000],
    stops: [],
    departureTimes: [],
    arrivalTimes: []
  });

  useEffect(() => {
    if (!initialFlights.length && !searchParams) {
      // No flight data and no search params, redirect to home
      navigate('/');
      return;
    }
    
    if (!initialFlights.length) {
      toast.error('No flights found');
    }
  }, [initialFlights, searchParams, navigate]);

  // Apply filters and sort server-side
  const applyFiltersAndSort = async () => {
    if (!searchParams) return;
    
    setLoading(true);
    try {
      const searchParamsWithFilters = {
        ...searchParams,
        sortBy,
        sortOrder: sortBy.includes('-desc') ? 'desc' : 'asc',
        airlines: filters.airlines.length > 0 ? filters.airlines : undefined,
        minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        maxPrice: filters.priceRange[1] < 20000 ? filters.priceRange[1] : undefined,
        maxStops: filters.stops.length > 0 ? Math.max(...filters.stops.map(s => parseInt(s))) : undefined,
        // Convert time slots to time ranges
        ...(filters.departureTimes.length > 0 && getTimeRangeFromSlots(filters.departureTimes, 'departure')),
        ...(filters.arrivalTimes.length > 0 && getTimeRangeFromSlots(filters.arrivalTimes, 'arrival'))
      };

      const results = await flightService.searchFlights(searchParamsWithFilters);
      setFilteredFlights(results.flights);
    } catch (error) {
      console.error('Filter error:', error);
      toast.error('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert time slots to time ranges
  const getTimeRangeFromSlots = (slots, type) => {
    const timeRanges = {
      morning: { start: '06:00', end: '12:00' },
      afternoon: { start: '12:00', end: '18:00' },
      evening: { start: '18:00', end: '24:00' },
      night: { start: '00:00', end: '06:00' }
    };

    if (slots.length === 0) return {};

    // For simplicity, use the first slot. In a real app, you might want to handle multiple slots
    const slot = slots[0];
    const range = timeRanges[slot];

    return {
      [`${type}TimeStart`]: range.start,
      [`${type}TimeEnd`]: range.end
    };
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      airlines: [],
      priceRange: [0, 20000],
      stops: [],
      departureTimes: [],
      arrivalTimes: []
    });
  };

  const handleApplyFilters = () => {
    applyFiltersAndSort();
    setShowFilters(false);
  };

  const handleSelectFlight = (flight) => {
    navigate(`/seat-map/${flight._id}`, { 
      state: { flight, searchParams } 
    });
  };

  const getAirlineLogo = (airline) => {
    const logos = {
      'IndiGo': '6E',
      'Air India': 'AI',
      'Vistara': 'UK',
      'SpiceJet': 'SG',
      'Go First': 'G8',
      'Akasa Air': 'QP'
    };
    return logos[airline] || airline.substring(0, 2);
  };

  if (!filteredFlights.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Plane className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Flights Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any flights matching your search criteria. Please try different dates or routes.
          </p>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
          >
            Search Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Route Info */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {searchParams?.origin} → {searchParams?.destination}
              </h1>
              <p className="text-sm text-gray-600">
                {searchParams?.departureDate
                  ? format(new Date(searchParams.departureDate), 'EEEE, d MMM yyyy')
                  : 'Any date'}
                &nbsp;• {searchParams?.passengers} {searchParams?.passengers === 1 ? 'Passenger' : 'Passengers'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="departure">Departure: Earliest</option>
                  <option value="duration">Duration: Shortest</option>
                </select>
                <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {Object.values(filters).flat().length > 0 && (
                  <span className="bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {Object.values(filters).flat().length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.airlines.length > 0 || filters.priceRange[1] < 20000) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {filters.airlines.map(airline => (
                <span key={airline} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                  {airline}
                  <button
                    onClick={() => handleFilterChange('airlines', filters.airlines.filter(a => a !== airline))}
                    className="hover:text-indigo-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filters.priceRange[1] < 20000 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                  Up to ₹{filters.priceRange[1]}
                  <button
                    onClick={() => handleFilterChange('priceRange', [0, 20000])}
                    className="hover:text-indigo-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-32 bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h3>

              {/* Airlines Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-sm mb-3">Airlines</h4>
                <div className="space-y-2">
                  {['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'Go First'].map(airline => (
                    <label key={airline} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.airlines.includes(airline)}
                          onChange={(e) => {
                            const newAirlines = e.target.checked
                              ? [...filters.airlines, airline]
                              : filters.airlines.filter(a => a !== airline);
                            handleFilterChange('airlines', newAirlines);
                          }}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">{airline}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {filteredFlights.filter(f => f.airline === airline).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-sm mb-3">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>₹0</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredFlights.length} of {initialFlights.length} flights
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              <AnimatePresence>
                {loading ? (
                  [...Array(3)].map((_, i) => <FlightCardSkeleton key={i} />)
                ) : (
                  filteredFlights.map((flight, idx) => (
                    <motion.div
                      key={flight._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 overflow-hidden"
                      onClick={() => handleSelectFlight(flight)}
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          {/* Airline Info */}
                          <div className="flex items-center gap-4 mb-4 lg:mb-0">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                              {getAirlineLogo(flight.airline)}
                            </div>
                            <div>
                              <div className="font-semibold">{flight.airline}</div>
                              <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                            </div>
                          </div>

                          {/* Flight Times */}
                          <div className="flex items-center gap-6 mb-4 lg:mb-0">
                            <div className="text-center min-w-20">
                              <div className="text-2xl font-bold">
                                {formatTime(flight.departureTime)}
                              </div>
                              <div className="text-sm text-gray-500">{flight.origin}</div>
                            </div>

                            <div className="flex flex-col items-center px-4">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <div className="text-xs text-gray-500 mt-1">
                                {calculateDuration(flight.departureTime, flight.arrivalTime)}
                              </div>
                              <div className="w-20 h-px bg-gray-300 mt-1 relative">
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-gray-400 rotate-45"></div>
                              </div>
                            </div>

                            <div className="text-center min-w-20">
                              <div className="text-2xl font-bold">
                                {formatTime(flight.arrivalTime)}
                              </div>
                              <div className="text-sm text-gray-500">{flight.destination}</div>
                            </div>
                          </div>

                          {/* Price & Book */}
                          <div className="text-right">
                            <div className="text-3xl font-bold text-indigo-600">
                              {formatCurrency(flight.price)}
                            </div>
                            <div className="text-sm text-gray-500 mb-2">per person</div>
                            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                              Select
                            </button>
                          </div>
                        </div>

                        {/* Flight Features */}
                        <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Wifi className="h-4 w-4" />
                            <span>WiFi</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Coffee className="h-4 w-4" />
                            <span>Meal</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Battery className="h-4 w-4" />
                            <span>Charging</span>
                          </div>
                          <div className="text-gray-400">•</div>
                          <div className="text-gray-500">
                            {flight.aircraft || 'Airbus A320'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              {filteredFlights.length === 0 && !loading && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <p className="text-gray-600">No flights match your filters</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={() => setShowFilters(false)}
        onClear={handleClearFilters}
      />
    </div>
  );
};

export default SearchResults;