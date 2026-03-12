import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Plane, 
  Download, 
  Mail, 
  Calendar,
  Clock,
  User,
  MapPin,
  CreditCard,
  Printer
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import { formatCurrency, formatTime, formatDate } from '../utils/helpers';
import { useBooking } from '../hooks/useBooking';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { downloadTicket, emailTicket, currentBooking } = useBooking();
  const { booking: stateBooking, flight: stateFlight, seat: stateSeat, passengers: statePassengers, paymentDetails: statePayment } =
    location.state || {};

  // stateBooking comes from navigation; fallback to redux store if available (useful on refresh)
  const booking = stateBooking || currentBooking;
  const flight = stateFlight || booking?.flightId;
  const seat = stateSeat || (booking ? { seatNumber: booking.seatNumber } : null);
  const passengers = statePassengers || booking?.passengers;
  const paymentDetails = statePayment;

  if (!booking || !flight) {
    navigate('/');
    return null;
  }

  const handleDownloadTicket = async () => {
    try {
      await downloadTicket(booking._id);
      toast.success('Ticket downloaded successfully');
    } catch (error) {
      toast.error('Failed to download ticket');
    }
  };

  const handleEmailTicket = async () => {
    try {
      await emailTicket(booking._id);
      toast.success('Ticket sent to your email');
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-full print:px-0">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 print:hidden"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your booking has been confirmed. A confirmation email has been sent to your registered email address.
          </p>
        </motion.div>

        {/* Ticket/Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none"
        >
          {/* PNR Header */}
          <div className="bg-indigo-600 px-6 py-4 print:bg-gray-100 print:text-gray-900">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-indigo-100 text-sm print:text-gray-600">PNR Number</p>
                <p className="text-2xl font-mono font-bold text-white print:text-gray-900">
                  {booking.pnr}
                </p>
              </div>
              <div className="text-right">
                <p className="text-indigo-100 text-sm print:text-gray-600">Booking Status</p>
                <p className="text-lg font-semibold text-white print:text-green-600">
                  Confirmed
                </p>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5 text-indigo-600" />
              Flight Details
            </h2>

            <div className="bg-gray-50 rounded-xl p-6">
              {/* Airline Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Plane className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <div className="font-semibold text-lg">{flight.airline}</div>
                  <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                </div>
              </div>

              {/* Route */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <div className="text-3xl font-bold">{flight.origin}</div>
                  <div className="text-sm text-gray-500">Departure</div>
                  <div className="font-medium text-lg">{formatTime(flight.departureTime)}</div>
                </div>

                <div className="flex-1 mx-4">
                  <div className="relative">
                    <div className="border-t-2 border-gray-300 border-dashed"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full text-sm font-medium text-indigo-600">
                      {Math.floor((new Date(flight.arrivalTime) - new Date(flight.departureTime)) / (1000 * 60))} min
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-3xl font-bold">{flight.destination}</div>
                  <div className="text-sm text-gray-500">Arrival</div>
                  <div className="font-medium text-lg">{formatTime(flight.arrivalTime)}</div>
                </div>
              </div>

              {/* Date & Other Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formatDate(flight.departureTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{flight.origin} → {flight.destination}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger & Seat Details */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Passenger & Seat Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Passenger Info */}
              <div className="space-y-3">
                {passengers?.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">Passenger {index + 1}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {passenger.firstName} {passenger.lastName}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                      <span>Age: {passenger.age}</span>
                      <span>Gender: {passenger.gender}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seat Info */}
              <div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Selected Seat</p>
                  <p className="text-4xl font-bold text-indigo-600 mb-2">{seat?.seatNumber}</p>
                  <p className="text-sm text-gray-600">
                    {seat?.seatNumber.includes('A') || seat?.seatNumber.includes('F') ? 'Window Seat' : 
                     seat?.seatNumber.includes('C') || seat?.seatNumber.includes('D') ? 'Aisle Seat' : 'Middle Seat'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              Payment Summary
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-medium">{formatCurrency(flight.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">{formatCurrency(Math.round(flight.price * 0.18))}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Paid</span>
                    <span className="text-indigo-600">
                      {formatCurrency(flight.price + Math.round(flight.price * 0.18))}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Payment Method: {paymentDetails?.method || 'Credit Card'}
              </p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="p-6 bg-gray-50 print:bg-white">
            <p className="text-xs text-gray-500">
              * This is an electronically generated ticket. No signature required.
              Please carry a valid ID proof during travel.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              * Check-in opens 48 hours before departure. Web check-in is recommended.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center print:hidden">
          <Button
            onClick={handleDownloadTicket}
            variant="primary"
            icon={<Download className="h-4 w-4" />}
          >
            Download Ticket
          </Button>
          <Button
            onClick={handleEmailTicket}
            variant="outline"
            icon={<Mail className="h-4 w-4" />}
          >
            Email Ticket
          </Button>
          <Button
            onClick={handlePrintTicket}
            variant="outline"
            icon={<Printer className="h-4 w-4" />}
          >
            Print Ticket
          </Button>
        </div>

        <div className="mt-8 text-center print:hidden">
          <button
            onClick={() => navigate('/my-bookings')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All My Bookings →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;