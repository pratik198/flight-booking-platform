
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRightLeft,
  Users,
  ChevronDown,
  ChevronUp,
  Plane
} from "lucide-react";

import RouteAutocomplete from "./RouteAutocomplete";
import DatePickerCustom from "./DatePickerCustom";
import { TRIP_TYPES, CABIN_CLASSES } from "../../utils/constants";

const FlightSearchForm = ({ onSearch, initialData = {}, loading = false }) => {

  const [searchParams, setSearchParams] = useState({
    origin: initialData.origin || "",
    destination: initialData.destination || "",
    departureDate: initialData.departureDate || new Date(),
    returnDate: initialData.returnDate || null,
    passengers: initialData.passengers || 1,
    tripType: initialData.tripType || "oneway",
    cabinClass: initialData.cabinClass || "economy",
    directFlightsOnly: initialData.directFlightsOnly || false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!searchParams.origin) newErrors.origin = "Select origin";
    if (!searchParams.destination) newErrors.destination = "Select destination";

    if (
      searchParams.origin &&
      searchParams.destination &&
      searchParams.origin === searchParams.destination
    ) {
      newErrors.destination = "Origin and destination cannot be same";
    }

    if (!searchParams.departureDate) {
      newErrors.departureDate = "Select departure date";
    }

    if (searchParams.tripType === "roundtrip" && !searchParams.returnDate) {
      newErrors.returnDate = "Select return date";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch(searchParams);
    }
  };

  const handleSwap = () => {
    setSearchParams({
      ...searchParams,
      origin: searchParams.destination,
      destination: searchParams.origin
    });
  };

  const handlePassengerChange = (type) => {
    setSearchParams((prev) => ({
      ...prev,
      passengers:
        type === "increment"
          ? Math.min(prev.passengers + 1, 9)
          : Math.max(prev.passengers - 1, 1)
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200"
      >

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Header */}
          <div className="flex items-center gap-3">
            <Plane className="text-indigo-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">
              Search Flights
            </h2>
          </div>

          {/* Trip Type */}
          <div className="flex flex-wrap gap-6 border-b pb-4">

            {TRIP_TYPES.map((type) => (

              <label
                key={type.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="tripType"
                  value={type.value}
                  checked={searchParams.tripType === type.value}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      tripType: e.target.value
                    })
                  }
                  className="accent-indigo-600"
                />

                <span className="font-medium text-gray-700">
                  {type.label}
                </span>

              </label>

            ))}

          </div>

          {/* Routes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">

            <RouteAutocomplete
              label="From"
              value={searchParams.origin}
              onChange={(value) =>
                setSearchParams({ ...searchParams, origin: value })
              }
              placeholder="City or Airport"
              excludeCode={searchParams.destination}
              error={errors.origin}
            />

            <button
              type="button"
              onClick={handleSwap}
              className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition"
            >
              <ArrowRightLeft size={18} />
            </button>

            <RouteAutocomplete
              label="To"
              value={searchParams.destination}
              onChange={(value) =>
                setSearchParams({ ...searchParams, destination: value })
              }
              placeholder="City or Airport"
              excludeCode={searchParams.origin}
              error={errors.destination}
            />

          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <DatePickerCustom
              label="Departure"
              selected={searchParams.departureDate}
              onChange={(date) =>
                setSearchParams({
                  ...searchParams,
                  departureDate: date
                })
              }
              minDate={new Date()}
              error={errors.departureDate}
            />

            {searchParams.tripType === "roundtrip" && (
              <DatePickerCustom
                label="Return"
                selected={searchParams.returnDate}
                onChange={(date) =>
                  setSearchParams({
                    ...searchParams,
                    returnDate: date
                  })
                }
                minDate={searchParams.departureDate}
                error={errors.returnDate}
              />
            )}

          </div>

          {/* Passenger + Cabin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Passengers
              </label>

              <div className="flex items-center border rounded-xl overflow-hidden">

                <button
                  type="button"
                  onClick={() => handlePassengerChange("decrement")}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>

                <div className="flex-1 flex items-center justify-center gap-2">
                  <Users size={18} />
                  {searchParams.passengers}
                </div>

                <button
                  type="button"
                  onClick={() => handlePassengerChange("increment")}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>

              </div>

            </div>

            <div>

              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Cabin Class
              </label>

              <select
                value={searchParams.cabinClass}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    cabinClass: e.target.value
                  })
                }
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
              >

                {CABIN_CLASSES.map((cabin) => (

                  <option key={cabin.value} value={cabin.value}>
                    {cabin.label}
                  </option>

                ))}

              </select>

            </div>

          </div>

          {/* Advanced Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-indigo-600 font-medium"
          >

            {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}

            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}

          </button>

          {/* Advanced */}
          <AnimatePresence>

            {showAdvanced && (

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-xl p-4"
              >

                <label className="flex gap-2 items-center">

                  <input
                    type="checkbox"
                    checked={searchParams.directFlightsOnly}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        directFlightsOnly: e.target.checked
                      })
                    }
                  />

                  Direct flights only

                </label>

              </motion.div>

            )}

          </AnimatePresence>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] transition disabled:opacity-60"
          >

            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching flights...
              </>
            ) : (
              <>
                <Search size={20} />
                Search Flights
              </>
            )}

          </button>

        </form>

      </motion.div>

    </div>
  );
};

export default FlightSearchForm;