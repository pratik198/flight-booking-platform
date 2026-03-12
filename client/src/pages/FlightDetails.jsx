import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane,
  Calendar,
  Clock,
  MapPin,
  Wifi,
  Coffee,
  Tv,
  Battery,
  Luggage,
  Users,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import { useFlights } from '../hooks/useFlights';
import { formatCurrency, formatTime, formatDate, calculateDuration } from '../utils/helpers';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFlightById, selectedFlight, loading } = useFlights();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadFlightDetails();
  }, [id]);

  const loadFlightDetails = async () => {
    try {
      await getFlightById(id);
    } catch (error) {
      toast.error('Failed to load flight details');
      navigate('/');
    }
  };

  if (loading || !selectedFlight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  const amenities = [
    { icon: <Wifi className="h-5 w-5" />, name: 'WiFi', available: true },
    { icon: <Coffee className="h-5 w-5" />, name: 'Complimentary Meals', available: true },
    { icon: <Tv className="h-5 w-5" />, name: 'Entertainment', available: true },
    { icon: <Battery className="h-5 w-5" />, name: 'Power Outlets', available: true },
    { icon: <Luggage className="h-5 w-5" />, name: '15kg Check-in', available: true },
    { icon: <Users className="h-5 w-5" />, name: 'Extra Legroom', available: false }
  ];

  const fareDetails = [
    { name: 'Base Fare', price: selectedFlight.price },
    { name: 'Taxes & Fees', price: Math.round(selectedFlight.price * 0.18) },
    { name: 'Convenience Fee', price: 199 },
    { name: 'Total', price: selectedFlight.price + Math.round(selectedFlight.price * 0.18) + 199, isTotal: true }
  ];

  const handleBookNow = () => {
    navigate(`/seat-map/${selectedFlight._id}`, {
      state: { flight: selectedFlight }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Search Results
        </button>

        {/* Flight Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 mb-4 lg:mb-0">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <Plane className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedFlight.airline}</h1>
                <p className="text-gray-600">Flight {selectedFlight.flightNumber}</p>
              </div>
            </div>
            <Button onClick={handleBookNow} variant="primary" size="lg">
              Book Now
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Flight Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold mb-6">Flight Route</h2>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <div className="text-3xl font-bold">{selectedFlight.origin}</div>
                  <div className="text-sm text-gray-500 mt-1">Departure</div>
                  <div className="font-semibold text-lg mt-2">
                    {formatTime(selectedFlight.departureTime)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedFlight.departureTime)}
                  </div>
                </div>

                <div className="flex-1 mx-8">
                  <div className="relative">
                    <div className="border-t-2 border-gray-300 border-dashed"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full text-sm font-medium text-indigo-600">
                      {calculateDuration(selectedFlight.departureTime, selectedFlight.arrivalTime)}
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-4">
                    {selectedFlight.origin} → {selectedFlight.destination}
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold">{selectedFlight.destination}</div>
                  <div className="text-sm text-gray-500 mt-1">Arrival</div>
                  <div className="font-semibold text-lg mt-2">
                    {formatTime(selectedFlight.arrivalTime)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedFlight.arrivalTime)}
                  </div>
                </div>
              </div>

              {/* Aircraft Info */}
              <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Aircraft</p>
                  <p className="font-medium">{selectedFlight.aircraft || 'Airbus A320'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Seats</p>
                  <p className="font-medium">{selectedFlight.totalSeats || 180}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cabin Class</p>
                  <p className="font-medium">Economy</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Operated By</p>
                  <p className="font-medium">{selectedFlight.airline}</p>
                </div>
              </div>
            </motion.div>

            {/* Amenities Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={amenity.available ? 'text-indigo-600' : 'text-gray-400'}>
                      {amenity.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${amenity.available ? 'text-gray-900' : 'text-gray-400'}`}>
                        {amenity.name}
                      </p>
                      {amenity.available ? (
                        <p className="text-xs text-green-600">Available</p>
                      ) : (
                        <p className="text-xs text-gray-400">Not Available</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fare Rules Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Fare Rules</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Cancellation</p>
                    <p className="text-sm text-gray-600">
                      Free cancellation up to 24 hours before departure. 
                      ₹{Math.round(selectedFlight.price * 0.1)} fee after that.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Date Change</p>
                    <p className="text-sm text-gray-600">
                      Free date change up to 12 hours before departure.
                      Fare difference may apply.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Name Change</p>
                    <p className="text-sm text-gray-600">
                      Name changes are not permitted after booking.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Fare Summary & Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Fare Summary Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Fare Summary</h2>
                <div className="space-y-3">
                  {fareDetails.map((item, index) => (
                    <div key={index} className={`flex justify-between ${item.isTotal ? 'border-t pt-3 mt-3' : ''}`}>
                      <span className={item.isTotal ? 'font-bold' : 'text-gray-600'}>{item.name}</span>
                      <span className={item.isTotal ? 'font-bold text-indigo-600' : 'font-medium'}>
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800">
                      Prices include all taxes and fees. Additional baggage charges may apply at check-in.
                    </p>
                  </div>
                </div>

                <Button onClick={handleBookNow} variant="primary" size="lg" fullWidth className="mt-6">
                  Book Now
                </Button>
              </motion.div>

              {/* Alternative Dates Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="font-semibold mb-4">Check Other Dates</h3>
                <input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button className="w-full mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Check Availability
                </button>
              </motion.div>

              {/* Need Help Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-indigo-50 rounded-xl p-6"
              >
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is available 24/7 to assist you with your booking.
                </p>
                <Button variant="outline" size="sm" fullWidth>
                  Contact Support
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;