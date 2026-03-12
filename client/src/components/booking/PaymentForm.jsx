import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Calendar, 
  Lock, 
  Shield, 
  AlertCircle,
  Smartphone,
  Building,
  Wallet
} from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validatePaymentForm } from '../../utils/validators';

const PaymentForm = ({ onSubmit, onBack, totalAmount, loading }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [errors, setErrors] = useState({});
  const [saveCard, setSaveCard] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'upi', name: 'UPI', icon: <Smartphone className="h-5 w-5" /> },
    { id: 'netbanking', name: 'Net Banking', icon: <Building className="h-5 w-5" /> },
    { id: 'wallet', name: 'Wallet', icon: <Wallet className="h-5 w-5" /> },
  ];

  const handleInputChange = (field, value) => {
    setPaymentDetails({ ...paymentDetails, [field]: value });
    
    // Format card number
    if (field === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setPaymentDetails({ ...paymentDetails, cardNumber: formatted });
    }
    
    // Format expiry
    if (field === 'expiry') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
      setPaymentDetails({ ...paymentDetails, expiry: formatted });
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validatePaymentForm(paymentDetails, paymentMethod);
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(paymentDetails);
    } else {
      setErrors(validationErrors);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <Input
              label="Card Number"
              value={paymentDetails.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              error={errors.cardNumber}
              icon={<CreditCard className="h-4 w-4" />}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
            
            <Input
              label="Cardholder Name"
              value={paymentDetails.cardName}
              onChange={(e) => handleInputChange('cardName', e.target.value)}
              error={errors.cardName}
              placeholder="As shown on card"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                value={paymentDetails.expiry}
                onChange={(e) => handleInputChange('expiry', e.target.value)}
                error={errors.expiry}
                icon={<Calendar className="h-4 w-4" />}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
              <Input
                label="CVV"
                type="password"
                value={paymentDetails.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                error={errors.cvv}
                icon={<Lock className="h-4 w-4" />}
                placeholder="123"
                maxLength="3"
                required
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700">Save card for future payments</span>
            </label>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <Input
              label="UPI ID"
              value={paymentDetails.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              error={errors.upiId}
              placeholder="username@okhdfcbank"
              required
            />
            <p className="text-xs text-gray-500">
              You will receive a payment request on your UPI app
            </p>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <select
              value={paymentDetails.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
              <option value="yes">Yes Bank</option>
            </select>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-4">
            <select
              value={paymentDetails.walletType}
              onChange={(e) => handleInputChange('walletType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select wallet</option>
              <option value="paytm">Paytm</option>
              <option value="phonepe">PhonePe</option>
              <option value="googlepay">Google Pay</option>
              <option value="amazonpay">Amazon Pay</option>
              <option value="mobikwik">MobiKwik</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setPaymentMethod(method.id)}
            className={`
              p-4 border rounded-lg flex flex-col items-center gap-2 transition-all
              ${paymentMethod === method.id 
                ? 'border-indigo-600 bg-indigo-50' 
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }
            `}
          >
            <div className={paymentMethod === method.id ? 'text-indigo-600' : 'text-gray-600'}>
              {method.icon}
            </div>
            <span className={`text-xs font-medium ${
              paymentMethod === method.id ? 'text-indigo-600' : 'text-gray-600'
            }`}>
              {method.name}
            </span>
          </button>
        ))}
      </div>

      {/* Payment Form */}
      <motion.div
        key={paymentMethod}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 p-6 rounded-lg"
      >
        {renderPaymentForm()}
      </motion.div>

      {/* Security Badge */}
      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
        <Shield className="h-5 w-5 text-green-600" />
        <span className="text-sm text-green-700">
          Your payment information is secure with 256-bit SSL encryption
        </span>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Payment Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Fare</span>
            <span>₹{totalAmount - Math.round(totalAmount * 0.18)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Taxes & Fees</span>
            <span>₹{Math.round(totalAmount * 0.18)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total Amount</span>
              <span className="text-indigo-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

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
          loading={loading}
          disabled={loading}
        >
          Pay ₹{totalAmount}
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-center text-gray-500">
        By proceeding, you agree to our{' '}
        <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
      </p>
    </form>
  );
};

export default PaymentForm;