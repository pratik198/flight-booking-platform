import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CreditCard,
  Luggage,
  Wifi,
  Coffee,
  Tv
} from 'lucide-react';
import { formatDate, formatTime, formatCurrency, calculateDuration } from '../../utils/helpers';
import Button from '../ui/Button';

const BookingSummary = ({ flight, seat, passengers, paymentDetails, onConfirm, onEdit, loading }) => {
  const totalAmount = flight.price + Math.round(flight.price * 0.18);

  const amenities = [
    { icon: <Wifi className="h-4 w-4" />, label: 'WiFi' },
    { icon: <Coffee className="h-4 w-4" />, label: 'Meals' },
    { icon: <Tv className="h-4 w-4" />, label: 'Entertainment' },
    { icon: <Luggage className="h-4 w-4" />, label: '15kg Baggage' },
  ];

  return (
    <div className="space-y-6">
      {/* Flight Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-indigo-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Details
          </h3>
        </div>

        <div className="p-6">
          {/* Airline & Flight Number */}
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
          <div className="flex items-center justify-between mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{flight.origin}</div>
              <div className="text-sm text-gray-500">Departure</div>
              <div className="font-medium text-lg">{formatTime(flight.departureTime)}</div>
            </div>

            <div className="flex-1 mx-8">
              <div className="relative">
                <div className="border-t-2 border-gray-300 border-dashed"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full text-sm font-medium text-indigo-600">
                  {calculateDuration(flight.departureTime, flight.arrivalTime)}
                </div>
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                {flight.origin} → {flight.destination}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold">{flight.destination}</div>
              <div className="text-sm text-gray-500">Arrival</div>
              <div className="font-medium text-lg">{formatTime(flight.arrivalTime)}</div>
            </div>
          </div>

          {/* Date & Aircraft */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{formatDate(flight.departureTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{formatTime(flight.departureTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{flight.aircraft || 'Airbus A320'}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-4 flex flex-wrap gap-4">
            {amenities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-indigo-600">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Selected Seat */}
      {seat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-green-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Selected Seat
            </h3>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Seat Number</p>
                <p className="text-4xl font-bold text-green-600">{seat.seatNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Seat Type</p>
                <p className="font-medium">
                  {seat.seatNumber.includes('A') || seat.seatNumber.includes('F') ? 'Window' : 
                   seat.seatNumber.includes('C') || seat.seatNumber.includes('D') ? 'Aisle' : 'Middle'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Passenger Details */}
      {passengers && passengers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-blue-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Passenger Details
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <p className="font-medium">Passenger {index + 1}</p>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>{' '}
                      <span className="font-medium">{passenger.firstName} {passenger.lastName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Age:</span>{' '}
                      <span className="font-medium">{passenger.age}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gender:</span>{' '}
                      <span className="font-medium capitalize">{passenger.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>{' '}
                      <span className="font-medium">{passenger.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-purple-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Summary
          </h3>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Fare</span>
              <span className="font-medium">{formatCurrency(flight.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes & Fees (18% GST)</span>
              <span className="font-medium">{formatCurrency(Math.round(flight.price * 0.18))}</span>
            </div>
            {seat && (
              <div className="flex justify-between">
                <span className="text-gray-600">Seat Selection Fee</span>
                <span className="font-medium">Free</span>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-indigo-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">
              <span className="font-bold">Cancellation Policy:</span> Free cancellation within 24 hours of booking. 
              ₹{Math.round(flight.price * 0.1)} cancellation fee after that.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {(onEdit || onConfirm) && (
        <div className="flex gap-4">
          {onEdit && (
            <Button
              variant="outline"
              onClick={onEdit}
              className="flex-1"
            >
              Edit Details
            </Button>
          )}
          {onConfirm && (
            <Button
              variant="primary"
              onClick={onConfirm}
              className="flex-1"
              loading={loading}
              disabled={loading}
            >
              Confirm & Pay
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingSummary;