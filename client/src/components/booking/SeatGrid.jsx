import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Wifi, Coffee, Tv, Battery, Info } from 'lucide-react';
import { getSeatColor } from '../../utils/helpers';

const SeatGrid = ({ seats, onSeatSelect, selectedSeat, heldSeat, flight }) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [seatMap, setSeatMap] = useState({});
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    // Organize seats by row
    const map = {};
    seats.forEach(seat => {
      const row = seat.seatNumber.match(/\d+/)[0];
      if (!map[row]) map[row] = [];
      map[row].push(seat);
    });
    setSeatMap(map);
  }, [seats]);

  const rows = Object.keys(seatMap).sort((a, b) => parseInt(a) - parseInt(b));
  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatFeatures = (seatNumber) => {
    const features = [];
    const row = parseInt(seatNumber.match(/\d+/)[0]);
    const col = seatNumber.match(/[A-F]/)[0];

    // Emergency exit rows (usually rows 12 and 13)
    if (row === 12 || row === 13) {
      features.push({ icon: <Info className="h-3 w-3" />, text: 'Exit row', color: 'yellow' });
    }

    // Extra legroom (rows 1, 12, 13)
    if (row === 1 || row === 12 || row === 13) {
      features.push({ icon: <Battery className="h-3 w-3" />, text: 'Extra legroom', color: 'green' });
    }

    // Window seats
    if (col === 'A' || col === 'F') {
      features.push({ icon: <Tv className="h-3 w-3" />, text: 'Window view', color: 'blue' });
    }

    return features;
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'available' || (heldSeat && heldSeat.seatId === seat._id)) {
      onSeatSelect(seat);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Aircraft Header */}
      <div className="relative mb-8">
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <div className="bg-indigo-600 text-white px-6 py-2 rounded-b-lg text-sm font-medium flex items-center gap-2">
            <Plane className="h-4 w-4" />
            <span>{flight?.aircraft || 'Airbus A320'} • {flight?.totalSeats || 180} seats</span>
          </div>
        </div>
      </div>

      {/* Seat Legend Toggle for Mobile */}
      <button
        onClick={() => setShowLegend(!showLegend)}
        className="md:hidden w-full mb-4 p-2 bg-gray-100 rounded-lg flex items-center justify-center gap-2 text-sm"
      >
        <Info className="h-4 w-4" />
        {showLegend ? 'Hide' : 'Show'} Seat Legend
      </button>

      {/* Seat Legend */}
      <div className={`mb-6 transition-all ${showLegend ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-400 rounded"></div>
            <span className="text-sm">Held (10 min)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-400 rounded"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Wifi className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">WiFi</span>
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Meal</span>
          </div>
        </div>
      </div>

      {/* Aircraft Cockpit */}
      <div className="mb-8 text-center">
        <div className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium">
          ✈️ COCKPIT
        </div>
      </div>

      {/* Seat Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-screen">
          {/* Column Headers */}
          <div className="flex justify-center mb-4">
            <div className="w-10"></div>
            {seatLetters.map(letter => (
              <div key={letter} className="w-10 text-center font-medium text-gray-500">
                {letter}
              </div>
            ))}
            <div className="w-10"></div>
            <div className="w-10"></div>
            {seatLetters.map(letter => (
              <div key={letter} className="w-10 text-center font-medium text-gray-500">
                {letter}
              </div>
            ))}
            <div className="w-10"></div>
          </div>

          {/* Seats by Row */}
          {rows.map((rowNum) => (
            <motion.div
              key={rowNum}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: parseInt(rowNum) * 0.02 }}
              className="flex items-center justify-center mb-2"
            >
              <span className="w-10 text-center font-medium text-gray-500">{rowNum}</span>
              
              {/* Left side seats (A, B, C) */}
              {seatLetters.slice(0, 3).map(letter => {
                const seat = seats.find(s => s.seatNumber === `${rowNum}${letter}`);
                if (!seat) return <div key={letter} className="w-10"></div>;
                
                const isSelected = selectedSeat === seat.seatNumber;
                const isHeld = seat.status === 'held' && heldSeat?.seatId === seat._id;
                const features = getSeatFeatures(seat.seatNumber);
                
                return (
                  <div
                    key={letter}
                    className="relative group"
                    onMouseEnter={() => setHoveredSeat(seat.seatNumber)}
                    onMouseLeave={() => setHoveredSeat(null)}
                  >
                    <button
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === 'booked' || (seat.status === 'held' && !isHeld)}
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium
                        transition-all duration-200 relative
                        ${getSeatColor(seat.status, isSelected)}
                      `}
                    >
                      {letter}
                    </button>

                    {/* Tooltip on Hover */}
                    {hoveredSeat === seat.seatNumber && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                        <p className="font-medium">Seat {seat.seatNumber}</p>
                        {features.map((f, i) => (
                          <p key={i} className="flex items-center gap-1 mt-1">
                            {f.icon} {f.text}
                          </p>
                        ))}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Aisle Space */}
              <div className="w-10"></div>
              
              {/* Exit Row Marker */}
              {(rowNum === '12' || rowNum === '13') && (
                <div className="w-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
              )}

              {/* Right side seats (D, E, F) */}
              {seatLetters.slice(3, 6).map(letter => {
                const seat = seats.find(s => s.seatNumber === `${rowNum}${letter}`);
                if (!seat) return <div key={letter} className="w-10"></div>;
                
                const isSelected = selectedSeat === seat.seatNumber;
                const isHeld = seat.status === 'held' && heldSeat?.seatId === seat._id;
                
                return (
                  <div
                    key={letter}
                    className="relative group"
                    onMouseEnter={() => setHoveredSeat(seat.seatNumber)}
                    onMouseLeave={() => setHoveredSeat(null)}
                  >
                    <button
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === 'booked' || (seat.status === 'held' && !isHeld)}
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium
                        transition-all duration-200
                        ${getSeatColor(seat.status, isSelected)}
                      `}
                    >
                      {letter}
                    </button>
                  </div>
                );
              })}

              <span className="w-10 text-center font-medium text-gray-500">{rowNum}</span>
            </motion.div>
          ))}

          {/* Aircraft Tail */}
          <div className="mt-8 text-center">
            <div className="inline-block px-6 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium">
              ✈️ TAIL
            </div>
          </div>
        </div>
      </div>

      {/* Aircraft Features */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Wifi className="h-5 w-5 mx-auto mb-1 text-indigo-600" />
          <span className="text-xs text-gray-600">WiFi Available</span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Coffee className="h-5 w-5 mx-auto mb-1 text-indigo-600" />
          <span className="text-xs text-gray-600">Complimentary Meals</span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Tv className="h-5 w-5 mx-auto mb-1 text-indigo-600" />
          <span className="text-xs text-gray-600">In-flight Entertainment</span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Battery className="h-5 w-5 mx-auto mb-1 text-indigo-600" />
          <span className="text-xs text-gray-600">Power Outlets</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;