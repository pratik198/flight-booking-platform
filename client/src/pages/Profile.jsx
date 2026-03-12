import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  Camera,
  Award,
  Clock,
  CreditCard,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { getInitials } from '../utils/helpers';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { updateProfile } = useAuth();
  const { bookings } = useBooking();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    dob: user?.dob || ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'stats', label: 'Statistics', icon: <Award className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> }
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
      dob: user?.dob || ''
    });
    setIsEditing(false);
  };

  const totalSpent = bookings?.reduce((sum, booking) => {
    if (booking.status === 'confirmed') {
      return sum + (booking.flightId?.price || 0) + Math.round((booking.flightId?.price || 0) * 0.18);
    }
    return sum;
  }, 0);

  const completedTrips = bookings?.filter(b => b.status === 'completed').length || 0;
  const upcomingTrips = bookings?.filter(b => b.status === 'confirmed' && new Date(b.flightId?.departureTime) > new Date()).length || 0;
  const cancelledTrips = bookings?.filter(b => b.status === 'cancelled').length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Cover Photo */}
          <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-600 relative">
            <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
              <Camera className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-12 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-indigo-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-indigo-600">
                    {getInitials(profileData.name)}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full text-white hover:bg-indigo-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                    <p className="text-gray-600">{profileData.email}</p>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      icon={<Edit2 className="h-4 w-4" />}
                      className="mt-4 sm:mt-0"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <Button
                        onClick={handleSave}
                        variant="primary"
                        size="sm"
                        icon={<Save className="h-4 w-4" />}
                        loading={loading}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        icon={<X className="h-4 w-4" />}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-1 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="your@email.com"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="9876543210"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={profileData.dob}
                        onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {profileData.dob ? format(new Date(profileData.dob), 'dd MMM yyyy') : 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        placeholder="Street address"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.address || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      {isEditing ? (
                        <Input
                          value={profileData.city}
                          onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                          placeholder="City"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.city || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      {isEditing ? (
                        <Input
                          value={profileData.state}
                          onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                          placeholder="State"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.state || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.pincode}
                        onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                        placeholder="6-digit pincode"
                        maxLength="6"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.pincode || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-indigo-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-8 w-8 text-indigo-600" />
                      <span className="text-2xl font-bold text-indigo-600">{upcomingTrips}</span>
                    </div>
                    <p className="text-sm text-gray-600">Upcoming Trips</p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="h-8 w-8 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">{completedTrips}</span>
                    </div>
                    <p className="text-sm text-gray-600">Completed Trips</p>
                  </div>

                  <div className="bg-red-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <X className="h-8 w-8 text-red-600" />
                      <span className="text-2xl font-bold text-red-600">{cancelledTrips}</span>
                    </div>
                    <p className="text-sm text-gray-600">Cancelled Trips</p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="h-8 w-8 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-600">₹{totalSpent?.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {bookings?.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium">{booking.flightId?.origin} → {booking.flightId?.destination}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(booking.flightId?.departureTime), 'dd MMM yyyy')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md"
              >
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                  <h3 className="font-semibold mb-4">Security Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button variant="primary" className="w-full">
                    Update Password
                  </Button>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;