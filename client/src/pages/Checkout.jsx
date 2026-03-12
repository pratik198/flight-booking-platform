import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PassengerForm from '../components/booking/PassengerForm';
import PaymentForm from '../components/booking/PaymentForm';
import BookingSummary from '../components/booking/BookingSummary';
import { useBooking } from '../hooks/useBooking';
import { useAuth } from '../hooks/useAuth';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, seat, searchParams, holdId } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [passengers, setPassengers] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const { createBooking, processPayment, currentBooking } = useBooking();
  const { user, isAuthenticated } = useAuth();

  if (!flight || !seat) {
    navigate('/');
    return null;
  }

  // ensure user is logged in before proceeding
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const totalAmount = flight.price + Math.round(flight.price * 0.18);

  const steps = [
    { number: 1, name: 'Passenger Details' },
    { number: 2, name: 'Payment' },
    { number: 3, name: 'Confirmation' }
  ];

  const handlePassengerSubmit = async (passengerData) => {
    setPassengers(passengerData);
    setCurrentStep(2);
  };

  // keep a local reference so we can navigate later if the redux store hasn't updated yet
  const [bookingResponse, setBookingResponse] = useState(null);

  const handlePaymentSubmit = async (paymentData) => {
    setLoading(true);
    setPaymentDetails(paymentData);

    try {
      // Create booking (backend will attach logged in user)
      const bookingData = {
        flightId: flight._id,
        seatNumber: seat.seatNumber,
        passengers: passengers,
        totalAmount: totalAmount,
        holdId: holdId
      };

      const booking = await createBooking(bookingData);
      setBookingResponse(booking);

      // Process payment
      const paymentResponse = await processPayment({
        bookingId: booking._id,
        amount: totalAmount,
        method: paymentData.method || 'card',
        details: paymentData
      });

      if (paymentResponse.status === 'success') {
        setCurrentStep(3);
        toast.success('Booking confirmed!');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmation = () => {
    const booking = bookingResponse || currentBooking;
    if (!booking) {
      toast.error('Unable to retrieve booking information');
      return;
    }
    navigate('/booking-confirmation', {
      state: {
        booking,
        flight,
        seat,
        passengers,
        paymentDetails
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>

          {/* Progress Steps */}
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                    ${currentStep > step.number 
                      ? 'bg-green-500 text-white' 
                      : currentStep === step.number
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {currentStep > step.number ? <CheckCircle className="h-4 w-4" /> : step.number}
                  </div>
                  <span className={`
                    ml-2 text-sm font-medium hidden sm:block
                    ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-12 h-0.5 mx-2
                    ${currentStep > step.number + 1 ? 'bg-green-500' : 'bg-gray-300'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="passenger"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <PassengerForm
                    onSubmit={handlePassengerSubmit}
                    passengerCount={searchParams?.passengers || 1}
                    onBack={handleBack}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <PaymentForm
                    onSubmit={handlePaymentSubmit}
                    onBack={handleBack}
                    totalAmount={totalAmount}
                    loading={loading}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-lg p-8 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your booking has been confirmed. Check your email for the ticket.
                  </p>
                  <button
                    onClick={handleConfirmation}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                  >
                    View Booking Details
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingSummary
                flight={flight}
                seat={seat}
                passengers={passengers}
                paymentDetails={paymentDetails}
                // only show the primary action during payment step
                onConfirm={currentStep === 2 ? () => {} : undefined}
                onEdit={currentStep < 3 ? () => setCurrentStep(1) : undefined}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;