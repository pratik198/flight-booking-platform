import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  XCircle, 
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import { useBooking } from '../hooks/useBooking';
import { formatCurrency, formatTime, formatDate } from '../utils/helpers';

const MyBookings = () => {
  const navigate = useNavigate();
  const { getMyBookings, bookings, cancelBooking, downloadTicket, isLoading } = useBooking();
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      await getMyBookings();
    } catch (error) {
      toast.error('Failed to load bookings');
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownload = async (bookingId) => {
    try {
      await downloadTicket(bookingId);
    } catch (error) {
      toast.error('Failed to download ticket');
    }
  };


  // compute effective status (completed if flight departed)
  const filteredBookings = bookings.filter(booking => {
    let effective = booking.status;
    if (effective === 'confirmed' && booking.flightId) {
      const dep = new Date(booking.flightId.departureTime);
      if (dep < new Date()) effective = 'completed';
    }

    if (filter !== 'all' && effective !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.pnr?.toLowerCase().includes(searchLower) ||
        booking.flightId?.flightNumber?.toLowerCase().includes(searchLower) ||
        booking.flightId?.origin?.toLowerCase().includes(searchLower) ||
        booking.flightId?.destination?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateRefund = (departureTime, price) => {
    const now = new Date();
    const departure = new Date(departureTime);
    const hoursDiff = (departure - now) / (1000 * 60 * 60);

    if (hoursDiff > 24) return price * 0.9;
    if (hoursDiff > 6) return price * 0.5;
    return 0;
  };

  if (isLoading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by PNR, flight number, or route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Plane className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No bookings match your search' : "You haven't made any bookings yet"}
            </p>
            <Button onClick={() => navigate('/')} variant="primary">
              Search Flights
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Booking Header */}
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* PNR and Status */}
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500">PNR</p>
                          <p className="font-mono font-bold text-lg">{booking.pnr}</p>
                        </div>
                        {(() => {
                          let effective = booking.status;
                          if (effective === 'confirmed' && booking.flightId) {
                            const dep = new Date(booking.flightId.departureTime);
                            if (dep < new Date()) effective = 'completed';
                          }
                          return (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(effective)}`}>
                              {effective}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Flight Info */}
                      <div className="flex items-center gap-6">
                        <div className="text-center min-w-15">
                          <div className="font-bold">{booking.flightId?.origin}</div>
                          <div className="text-xs text-gray-500">
                            {formatTime(booking.flightId?.departureTime)}
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <Plane className="h-4 w-4 text-gray-400" />
                          <div className="text-xs text-gray-500">
                            {Math.floor((new Date(booking.flightId?.arrivalTime) - new Date(booking.flightId?.departureTime)) / (1000 * 60))} min
                          </div>
                        </div>
                        <div className="text-center min-w-15">
                          <div className="font-bold">{booking.flightId?.destination}</div>
                          <div className="text-xs text-gray-500">
                            {formatTime(booking.flightId?.arrivalTime)}
                          </div>
                        </div>
                      </div>

                      {/* Date and Expand */}
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(booking.flightId?.departureTime)}
                        </div>
                        {expandedId === booking._id ? 
                          <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        }
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === booking._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t"
                      >
                        <div className="p-6 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Flight Details */}
                            <div>
                              <h3 className="font-semibold mb-3">Flight Details</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Airline:</span>
                                  <span className="font-medium">{booking.flightId?.airline}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Flight Number:</span>
                                  <span className="font-medium">{booking.flightId?.flightNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Aircraft:</span>
                                  <span className="font-medium">{booking.flightId?.aircraft || 'Airbus A320'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Seat:</span>
                                  <span className="font-medium text-indigo-600">{booking.seatNumber}</span>
                                </div>
                              </div>
                            </div>

                            {/* Passenger Details */}
                            <div>
                              <h3 className="font-semibold mb-3">Passenger Details</h3>
                              <div className="space-y-2 text-sm">
                                {booking.passengers?.map((passenger, idx) => (
                                  <div key={idx} className="border-b last:border-0 pb-2 last:pb-0">
                                    <p className="font-medium">{passenger.firstName} {passenger.lastName}</p>
                                    <p className="text-xs text-gray-500">
                                      Age: {passenger.age} • Gender: {passenger.gender}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Price Details */}
                            <div>
                              <h3 className="font-semibold mb-3">Price Details</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Base Fare:</span>
                                  <span>{formatCurrency(booking.flightId?.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Taxes & Fees:</span>
                                  <span>{formatCurrency(Math.round(booking.flightId?.price * 0.18))}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                  <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span className="text-indigo-600">
                                      {formatCurrency(booking.flightId?.price + Math.round(booking.flightId?.price * 0.18))}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Cancellation Policy */}
                            {booking.status === 'confirmed' && (
                              <div>
                                <h3 className="font-semibold mb-3">Cancellation Policy</h3>
                                <div className="bg-yellow-50 p-3 rounded-lg">
                                  <p className="text-sm text-yellow-800">
                                    Cancel before {format(new Date(new Date(booking.flightId?.departureTime) - 24*60*60*1000), 'dd MMM yyyy, HH:mm')} for 90% refund
                                  </p>
                                  <p className="text-xs text-yellow-600 mt-1">
                                    Refund amount: {formatCurrency(calculateRefund(booking.flightId?.departureTime, booking.flightId?.price))}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-6 flex flex-wrap gap-3">
                            <Button
                              onClick={() => handleDownload(booking._id)}
                              variant="outline"
                              size="sm"
                              icon={<Download className="h-4 w-4" />}
                            >
                              Download Ticket
                            </Button>
                            {booking.status === 'confirmed' && (
                              <Button
                                onClick={() => handleCancel(booking._id)}
                                variant="danger"
                                size="sm"
                                icon={<XCircle className="h-4 w-4" />}
                                loading={cancellingId === booking._id}
                                disabled={cancellingId === booking._id}
                              >
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;