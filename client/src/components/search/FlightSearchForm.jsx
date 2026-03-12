import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRightLeft, 
  Users, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Plane
} from 'lucide-react';
import RouteAutocomplete from './RouteAutocomplete';
import DatePickerCustom from './DatePickerCustom';
import Button from '../ui/Button';
import { TRIP_TYPES, CABIN_CLASSES } from '../../utils/constants';

const FlightSearchForm = ({ onSearch, initialData = {}, loading = false }) => {
  const [searchParams, setSearchParams] = useState({
    origin: initialData.origin || '',
    destination: initialData.destination || '',
    departureDate: initialData.departureDate || new Date(),
    returnDate: initialData.returnDate || null,
    passengers: initialData.passengers || 1,
    tripType: initialData.tripType || 'oneway',
    cabinClass: initialData.cabinClass || 'economy',
    directFlightsOnly: initialData.directFlightsOnly || false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!searchParams.origin) {
      newErrors.origin = 'Please select origin';
    }
    if (!searchParams.destination) {
      newErrors.destination = 'Please select destination';
    }
    if (searchParams.origin && searchParams.destination && 
        searchParams.origin === searchParams.destination) {
      newErrors.destination = 'Origin and destination cannot be same';
    }
    if (!searchParams.departureDate) {
      newErrors.departureDate = 'Please select departure date';
    }
    if (searchParams.tripType === 'roundtrip' && !searchParams.returnDate) {
      newErrors.returnDate = 'Please select return date';
    }
    if (searchParams.tripType === 'roundtrip' && 
        searchParams.returnDate && searchParams.departureDate &&
        searchParams.returnDate < searchParams.departureDate) {
      newErrors.returnDate = 'Return date must be after departure';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSwap = () => {
    setSearchParams({
      ...searchParams,
      origin: searchParams.destination,
      destination: searchParams.origin
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch(searchParams);
    }
  };

  const handlePassengerChange = (type) => {
    setSearchParams(prev => ({
      ...prev,
      passengers: type === 'increment' 
        ? Math.min(prev.passengers + 1, 9)
        : Math.max(prev.passengers - 1, 1)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trip Type Selection */}
      <div className="flex flex-wrap gap-4 border-b pb-4">
        {TRIP_TYPES.map((type) => (
          <label key={type.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value={type.value}
              checked={searchParams.tripType === type.value}
              onChange={(e) => setSearchParams({...searchParams, tripType: e.target.value})}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">{type.label}</span>
          </label>
        ))}
      </div>

      {/* Route Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        <RouteAutocomplete
          label="From"
          value={searchParams.origin}
          onChange={(value) => setSearchParams({...searchParams, origin: value})}
          placeholder="Enter city or airport"
          excludeCode={searchParams.destination}
          error={errors.origin}
        />

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwap}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow-md hover:shadow-lg transition-shadow hidden md:block"
        >
          <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
        </button>

        <RouteAutocomplete
          label="To"
          value={searchParams.destination}
          onChange={(value) => setSearchParams({...searchParams, destination: value})}
          placeholder="Enter city or airport"
          excludeCode={searchParams.origin}
          error={errors.destination}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePickerCustom
          label="Departure"
          selected={searchParams.departureDate}
          onChange={(date) => setSearchParams({...searchParams, departureDate: date})}
          minDate={new Date()}
          error={errors.departureDate}
        />
        
        {searchParams.tripType === 'roundtrip' && (
          <DatePickerCustom
            label="Return"
            selected={searchParams.returnDate}
            onChange={(date) => setSearchParams({...searchParams, returnDate: date})}
            minDate={searchParams.departureDate}
            error={errors.returnDate}
          />
        )}
      </div>

      {/* Passengers & Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passengers
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => handlePassengerChange('decrement')}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              -
            </button>
            <div className="flex-1 flex items-center justify-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="font-medium">{searchParams.passengers}</span>
              <span className="text-sm text-gray-600">
                {searchParams.passengers === 1 ? 'Passenger' : 'Passengers'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handlePassengerChange('increment')}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cabin Class
          </label>
          <select
            value={searchParams.cabinClass}
            onChange={(e) => setSearchParams({...searchParams, cabinClass: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {CABIN_CLASSES.map((cabin) => (
              <option key={cabin.value} value={cabin.value}>
                {cabin.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {showAdvanced ? 'Hide' : 'Show'} advanced options
      </button>

      {/* Advanced Options */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={searchParams.directFlightsOnly}
                  onChange={(e) => setSearchParams({...searchParams, directFlightsOnly: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Show direct flights only</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-7">
                Display only non-stop flights for quicker travel
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        icon={<Search className="h-5 w-5" />}
      >
        Search Flights
      </Button>
    </form>
  );
};

export default FlightSearchForm;