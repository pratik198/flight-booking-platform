import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Seat Icon Component
const SeatIcon = ({ status, isSelected }) => {
  let fillColor = '#ffffff';
  let strokeColor = '#d1d5db';
  
  if (isSelected) {
    fillColor = '#0033A0';
    strokeColor = '#0033A0';
  } else if (status === 'booked') {
    fillColor = '#d1d5db';
    strokeColor = '#9ca3af';
  } else if (status === 'held') {
    fillColor = '#fb923c';
    strokeColor = '#f97316';
  }

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Seat back */}
      <rect x="6" y="4" width="20" height="16" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1.5"/>
      {/* Seat bottom */}
      <rect x="6" y="18" width="20" height="10" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth="1.5"/>
      {/* Left armrest */}
      <rect x="4" y="18" width="3" height="8" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1"/>
      {/* Right armrest */}
      <rect x="25" y="18" width="3" height="8" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1"/>
    </svg>
  );
};

const SeatGrid = ({ seats, onSeatSelect, selectedSeat, heldSeat, flight }) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [seatRows, setSeatRows] = useState([]);

  useEffect(() => {
    // Sort seats by seat number (S1, S2, S3, etc.)
    const sortedSeats = [...seats].sort((a, b) => {
      const numA = parseInt(a.seatNumber.substring(1));
      const numB = parseInt(b.seatNumber.substring(1));
      return numA - numB;
    });

    // Group seats into rows of 6 (A, B, C - aisle - D, E, F)
    const rows = [];
    for (let i = 0; i < sortedSeats.length; i += 6) {
      const row = sortedSeats.slice(i, i + 6);
      // Pad the row if it has less than 6 seats
      while (row.length < 6) {
        row.push(null);
      }
      rows.push(row);
    }
    
    setSeatRows(rows);
  }, [seats]);

  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleSeatClick = (seat) => {
    const isClickable = seat.status === 'available' || (heldSeat && heldSeat.seatId === seat._id);
    if (isClickable) {
      onSeatSelect(seat);
    }
  };

  if (seats.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0033A0] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading seats...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="bg-[#0033A0] text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">Select Your Seat</h3>
        <p className="text-sm text-blue-100 mt-1">
          {flight?.aircraft || 'Emirates'} • {seats.length} seats
        </p>
      </div>

      <div className="p-6">
        {/* Legend */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 border-2 border-gray-300 bg-white rounded"></div>
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#0033A0] rounded"></div>
              <span className="text-sm text-gray-700">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-700">Temporarily Held</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-300 rounded"></div>
              <span className="text-sm text-gray-700">Occupied</span>
            </div>
          </div>
        </div>

        {/* Aircraft Shape Container */}
        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full">
            {/* Aircraft Nose */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-16 bg-gradient-to-b from-gray-100 to-white border-2 border-gray-300 rounded-t-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">✈️ FRONT</span>
                </div>
              </div>
            </div>

            {/* Column Headers */}
            <div className="flex justify-center mb-3">
              <div className="w-10"></div>
              {seatLetters.slice(0, 3).map(letter => (
                <div key={letter} className="w-11 text-center text-xs font-semibold text-gray-600">
                  {letter}
                </div>
              ))}
              <div className="w-12 flex items-center justify-center">
                <div className="h-px w-8 bg-gray-300"></div>
              </div>
              {seatLetters.slice(3, 6).map(letter => (
                <div key={letter} className="w-11 text-center text-xs font-semibold text-gray-600">
                  {letter}
                </div>
              ))}
              <div className="w-10"></div>
            </div>

            {/* Seat Rows */}
            <div className="relative">
              {/* Aircraft body background */}
              <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg -mx-2"></div>
              
              {seatRows.map((row, rowIndex) => (
                <motion.div
                  key={rowIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  className="flex items-center justify-center mb-3 relative"
                >
                  {/* Row number - left */}
                  <div className="w-10 text-center text-xs font-medium text-gray-400">
                    {rowIndex + 1}
                  </div>
                  
                  {/* Left side seats (A, B, C) */}
                  {row.slice(0, 3).map((seat, seatIndex) => {
                    if (!seat) return <div key={seatIndex} className="w-12"></div>;
                    
                    const isSelected = selectedSeat === seat.seatNumber;
                    const isClickable = seat.status === 'available' || (heldSeat?.seatId === seat._id);
                    
                    return (
                      <div key={seat._id} className="relative px-1">
                        <button
                          onClick={() => handleSeatClick(seat)}
                          disabled={!isClickable}
                          onMouseEnter={() => setHoveredSeat(seat.seatNumber)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`
                            relative flex flex-col items-center justify-center
                            transition-all duration-200
                            ${isClickable ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-not-allowed opacity-75'}
                            ${isSelected ? 'scale-110' : ''}
                          `}
                        >
                          <SeatIcon status={seat.status} isSelected={isSelected} />
                          <span className={`
                            text-[10px] font-semibold mt-0.5
                            ${isSelected ? 'text-[#0033A0]' : 
                              seat.status === 'booked' ? 'text-gray-400' : 
                              seat.status === 'held' ? 'text-orange-600' : 'text-gray-600'}
                          `}>
                            {seatLetters[seatIndex]}
                          </span>
                        </button>

                        {/* Tooltip */}
                        {hoveredSeat === seat.seatNumber && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-20">
                            <p className="font-semibold">{seat.seatNumber}</p>
                            <p className="text-gray-300 mt-0.5">
                              {seat.status === 'available' ? 'Available' : 
                               seat.status === 'held' ? 'Held' : 'Occupied'}
                            </p>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                              <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Aisle */}
                  <div className="w-16 flex items-center justify-center">
                    <div className="text-gray-300 text-xs font-medium">AISLE</div>
                  </div>
                  
                  {/* Right side seats (D, E, F) */}
                  {row.slice(3, 6).map((seat, seatIndex) => {
                    if (!seat) return <div key={seatIndex} className="w-12"></div>;
                    
                    const isSelected = selectedSeat === seat.seatNumber;
                    const isClickable = seat.status === 'available' || (heldSeat?.seatId === seat._id);
                    
                    return (
                      <div key={seat._id} className="relative px-1">
                        <button
                          onClick={() => handleSeatClick(seat)}
                          disabled={!isClickable}
                          onMouseEnter={() => setHoveredSeat(seat.seatNumber)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`
                            relative flex flex-col items-center justify-center
                            transition-all duration-200
                            ${isClickable ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-not-allowed opacity-75'}
                            ${isSelected ? 'scale-110' : ''}
                          `}
                        >
                          <SeatIcon status={seat.status} isSelected={isSelected} />
                          <span className={`
                            text-[10px] font-semibold mt-0.5
                            ${isSelected ? 'text-[#0033A0]' : 
                              seat.status === 'booked' ? 'text-gray-400' : 
                              seat.status === 'held' ? 'text-orange-600' : 'text-gray-600'}
                          `}>
                            {seatLetters[seatIndex + 3]}
                          </span>
                        </button>

                        {/* Tooltip */}
                        {hoveredSeat === seat.seatNumber && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-20">
                            <p className="font-semibold">{seat.seatNumber}</p>
                            <p className="text-gray-300 mt-0.5">
                              {seat.status === 'available' ? 'Available' : 
                               seat.status === 'held' ? 'Held' : 'Occupied'}
                            </p>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                              <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Row number - right */}
                  <div className="w-10 text-center text-xs font-medium text-gray-400">
                    {rowIndex + 1}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Aircraft Tail */}
            <div className="flex justify-center mt-6">
              <div className="relative">
                <div className="w-32 h-12 bg-gradient-to-t from-gray-100 to-white border-2 border-gray-300 rounded-b-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">REAR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-[#0033A0] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Seat Selection Tips</p>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li>• Window seats: A & F</li>
                <li>• Aisle seats: C & D</li>
                <li>• Your selection will be held for 10 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;