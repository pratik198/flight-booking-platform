import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

const DatePickerCustom = ({ 
  label, 
  selected, 
  onChange, 
  minDate, 
  maxDate, 
  placeholder = "Select date",
  error 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
        <DatePicker
          selected={selected}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText={placeholder}
          dateFormat="dd MMM yyyy"
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          wrapperClassName="w-full"
          calendarClassName="shadow-xl border-0"
          dayClassName={date => 
            date.toDateString() === selected?.toDateString() 
              ? 'react-datepicker__day--selected' 
              : ''
          }
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DatePickerCustom;