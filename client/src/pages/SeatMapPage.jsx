import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Clock, 
  ChevronLeft, 
  AlertCircle, 
  Info,
  Wifi,
  Coffee,
  Tv,
  Battery
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import SeatGrid from '../components/booking/SeatGrid';
import Button from '../components/ui/Button';
import { useFlights } from '../hooks/useFlights';
import { useBooking } from '../hooks/useBooking';
import { useSocket } from '../hooks/useSocket';
import { formatCurrency, formatTime, formatDate } from '../utils/helpers';

const SeatMapPage = () => {
  const { flightId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchParams } = location.state || {};

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getSeats, seats, holdSeat, releaseSeat, heldSeat } = useFlights();
  const { savePassengerDetails } = useBooking();
  const { socket, emit } = useSocket(flightId);

  useEffect(() => {
    if (!flight) {
      navigate('/');
      return;
    }
    loadSeats();
  }, [flightId, flight]);

  useEffect(() => {
    if (heldSeat?.expiresAt) {
      const timer = setInterval(() => {
        const now = new Date();
        const expiry = new Date(heldSeat.expiresAt);
        const diff = expiry - now;

        if (diff <= 0) {
          clearInterval(timer);
          setSelectedSeat(null);
          setTimeLeft(null);
          toast.error('Seat hold expired');
          loadSeats();
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [heldSeat]);

  // Socket event listeners for real-time seat updates
  useEffect(() => {
    if (socket) {
      const handleSeatUpdate = (data) => {
        // Update seat status in real-time
        console.log('Seat updated:', data);
      };

      socket.on('seat-updated', handleSeatUpdate);
      return () => {
        socket.off('seat-updated', handleSeatUpdate);
      };
    }
  }, [socket]);

  const loadSeats = async () => {
    try {
      setLoading(true);
      await getSeats(flightId);
    } catch (error) {
      toast.error('Error loading seats');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = async (seat) => {
    try {
      setSelectedSeat(seat.seatNumber);
      await holdSeat(seat._id);
      
      // Emit socket event for real-time update
      emit('seat-held', { 
        flightId, 
        seatId: seat._id, 
        seatNumber: seat.seatNumber 
      });
      
      toast.success('Seat held for 10 minutes');
    } catch (error) {
      setSelectedSeat(null);
      toast.error(error.message || 'Could not hold seat');
    }
  };

  const handleProceed = () => {
    if (!selectedSeat) {
      toast.error('Please select a seat');
      return;
    }

    const selectedSeatData = seats.find(s => s.seatNumber === selectedSeat);
    
    navigate('/checkout', {
      state: {
        flight,
        seat: selectedSeatData,
        searchParams,
        holdId: heldSeat?._id
      }
    });
  };

  const totalPrice = flight ? flight.price + Math.round(flight.price * 0.18) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Select Your Seat</h1>
              <p className="text-sm text-gray-600">
                {flight?.airline} • {flight?.flightNumber} • {flight?.origin} → {flight?.destination}
              </p>
            </div>

            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading seat map...</p>
              </div>
            ) : (
              <SeatGrid
                seats={seats}
                onSeatSelect={handleSeatSelect}
                selectedSeat={selectedSeat}
                heldSeat={heldSeat}
                flight={flight}
              />
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              {/* Flight Summary Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-indigo-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    Flight Summary
                  </h3>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Plane className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-medium">{flight?.airline}</div>
                      <div className="text-sm text-gray-500">{flight?.flightNumber}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From</span>
                      <span className="font-medium">{flight?.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To</span>
                      <span className="font-medium">{flight?.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {formatDate(flight?.departureTime) || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departure</span>
                      <span className="font-medium">
                        {formatTime(flight?.departureTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrival</span>
                      <span className="font-medium">
                        {formatTime(flight?.arrivalTime)}
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wifi className="h-4 w-4" /> WiFi
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Coffee className="h-4 w-4" /> Meals
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tv className="h-4 w-4" /> Entertainment
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Battery className="h-4 w-4" /> Charging
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Selected Seat Card */}
              {selectedSeat ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-500"
                >
                  <div className="bg-green-500 px-6 py-3">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Selected Seat
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Seat Number</p>
                        <p className="text-4xl font-bold text-green-600">{selectedSeat}</p>
                      </div>
                      {timeLeft && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Time Left</p>
                          <p className="text-2xl font-bold text-yellow-600">{timeLeft}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Please select a seat to proceed with your booking. You have 10 minutes to complete your booking once you select a seat.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Price Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-medium">{formatCurrency(flight?.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">{formatCurrency(Math.round(flight?.price * 0.18))}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-indigo-600">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleProceed}
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!selectedSeat}
                  className="mt-6"
                >
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  By proceeding, you agree to our terms and conditions
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatMapPage;