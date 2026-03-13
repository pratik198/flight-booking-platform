import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Shield, Clock, CreditCard, Award, Headphones, Download } from 'lucide-react';
import FlightSearchForm from '../components/search/FlightSearchForm';
import { useFlights } from '../hooks/useFlights';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { searchFlights, loading } = useFlights();
  const { isAuthenticated } = useAuth();

  const handleSearch = async (searchParams) => {
    try {
      const params = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        passengers: searchParams.passengers,
        tripType: searchParams.tripType,
        cabinClass: searchParams.cabinClass,
        directFlightsOnly: searchParams.directFlightsOnly
      };

      if (searchParams.departureDate) {
        params.date = searchParams.departureDate.toISOString().split('T')[0];
      }

      if (searchParams.returnDate) {
        params.returnDate = searchParams.returnDate.toISOString().split('T')[0];
      }

      const results = await searchFlights(params);

      navigate('/search-results', {
        state: {
          flights: results.flights,
          searchParams,
          searchCriteria: results.searchCriteria
        }
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Safe & Secure',
      description: 'Your safety is our top priority with enhanced cleaning protocols'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Instant Booking',
      description: 'Get your PNR instantly after booking confirmation'
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Best Price Guarantee',
      description: 'We guarantee the lowest fares on all domestic routes'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Award Winning Service',
      description: 'Recognized as India\'s best airline for customer service'
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your queries'
    }
  ];

  const popularRoutes = [
    { from: 'DEL', to: 'BOM', fromCity: 'Delhi', toCity: 'Mumbai', price: 2999 },
    { from: 'BOM', to: 'BLR', fromCity: 'Mumbai', toCity: 'Bangalore', price: 3499 },
    { from: 'DEL', to: 'CCU', fromCity: 'Delhi', toCity: 'Kolkata', price: 3999 },
    { from: 'MAA', to: 'BOM', fromCity: 'Chennai', toCity: 'Mumbai', price: 3299 },
    { from: 'BLR', to: 'DEL', fromCity: 'Bangalore', toCity: 'Delhi', price: 3899 },
    { from: 'HYD', to: 'BOM', fromCity: 'Hyderabad', toCity: 'Mumbai', price: 2799 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Fly Beyond Limits
            </h1>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
              Experience the joy of flying with India's most trusted airline. 
              Book your tickets now and embark on your next adventure.
            </p>
          </motion.div>

          {/* Search Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl z-10shadow-2xl p-6 md:p-8 max-w-4xl mx-auto"
          >
            <FlightSearchForm onSearch={handleSearch} loading={loading} />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { value: '50+', label: 'Destinations' },
              { value: '1000+', label: 'Daily Flights' },
              { value: '10M+', label: 'Happy Customers' },
              { value: '4.8', label: 'App Rating' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 -z-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 -z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SkyWings?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best flying experience with unmatched comfort and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Routes</h2>
            <p className="text-lg text-gray-600">Most booked flights by our customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 cursor-pointer transition-all border border-gray-100"
                onClick={() => handleSearch({
                  origin: route.from,
                  destination: route.to,
                  passengers: 1
                })}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{route.from}</div>
                      <div className="text-xs text-gray-500">{route.fromCity}</div>
                    </div>
                    <Plane className="h-5 w-5 text-indigo-600 transform rotate-90" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{route.to}</div>
                      <div className="text-xs text-gray-500">{route.toCity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Starting from</div>
                    <div className="text-2xl font-bold text-indigo-600">₹{route.price}</div>
                  </div>
                </div>
                <button className="w-full mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Book Now →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

