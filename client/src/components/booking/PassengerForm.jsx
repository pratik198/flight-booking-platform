import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, AlertCircle, Plus, Trash2 } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validatePassengerForm } from '../../utils/validators';

const PassengerForm = ({ onSubmit, initialData, passengerCount = 1, onBack }) => {
  const [passengers, setPassengers] = useState(
    initialData || Array(passengerCount).fill({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: '',
      gender: 'male'
    })
  );
  const [errors, setErrors] = useState({});

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
    
    // Clear error for this field
    if (errors[`${index}_${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${index}_${field}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all passengers
    const newErrors = {};
    passengers.forEach((passenger, index) => {
      const passengerErrors = validatePassengerForm(passenger);
      Object.keys(passengerErrors).forEach(key => {
        newErrors[`${index}_${key}`] = passengerErrors[key];
      });
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(passengers);
    } else {
      setErrors(newErrors);
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const addPassenger = () => {
    if (passengers.length < 9) {
      setPassengers([...passengers, {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        gender: 'male'
      }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
      // Clear errors for removed passenger
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`${index}_`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {passengers.map((passenger, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 relative"
        >
          {/* Passenger Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Passenger {index + 1}
                </h3>
                <p className="text-sm text-gray-500">Enter passenger details</p>
              </div>
            </div>
            {passengers.length > 1 && (
              <button
                type="button"
                onClick={() => removePassenger(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={passenger.firstName}
                onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                error={errors[`${index}_firstName`]}
                icon={<User className="h-4 w-4" />}
                required
              />
              <Input
                label="Last Name"
                value={passenger.lastName}
                onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                error={errors[`${index}_lastName`]}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={passenger.email}
              onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
              error={errors[`${index}_email`]}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={passenger.phone}
                onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                error={errors[`${index}_phone`]}
                icon={<Phone className="h-4 w-4" />}
                placeholder="10-digit mobile number"
                required
              />
              <Input
                label="Age"
                type="number"
                value={passenger.age}
                onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                error={errors[`${index}_age`]}
                icon={<Calendar className="h-4 w-4" />}
                min="1"
                max="120"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="flex gap-4">
                {['male', 'female', 'other'].map((gender) => (
                  <label key={gender} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`gender_${index}`}
                      value={gender}
                      checked={passenger.gender === gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* GST Details (Optional) */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Add GST details (Optional)</span>
              </label>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Add Passenger Button */}
      {passengers.length < 9 && (
        <button
          type="button"
          onClick={addPassenger}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Another Passenger
        </button>
      )}

      {/* Form Actions */}
      <div className="flex gap-4">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
        >
          Continue to Payment
        </Button>
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Your personal information is secure with us. We use 256-bit encryption to protect your data.
        </p>
      </div>
    </form>
  );
};

export default PassengerForm;