// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Search,
//   ArrowRightLeft,
//   Users,
//   ChevronDown,
//   ChevronUp,
//   Plane,
//   Calendar,
//   Sparkles
// } from "lucide-react";

// import RouteAutocomplete from "./RouteAutocomplete";
// import DatePickerCustom from "./DatePickerCustom";
// import { TRIP_TYPES, CABIN_CLASSES } from "../../utils/constants";

// const FlightSearchForm = ({ onSearch, initialData = {}, loading = false }) => {
//   const [searchParams, setSearchParams] = useState({
//     origin: initialData.origin || "",
//     destination: initialData.destination || "",
//     departureDate: initialData.departureDate || new Date(),
//     returnDate: initialData.returnDate || null,
//     passengers: initialData.passengers || 1,
//     tripType: initialData.tripType || "oneway",
//     cabinClass: initialData.cabinClass || "economy",
//     directFlightsOnly: initialData.directFlightsOnly || false
//   });

//   const [showAdvanced, setShowAdvanced] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Handle external loading state
//   useEffect(() => {
//     if (!loading) {
//       setIsSubmitting(false);
//     }
//   }, [loading]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!searchParams.origin) newErrors.origin = "Select origin";
//     if (!searchParams.destination) newErrors.destination = "Select destination";

//     if (
//       searchParams.origin &&
//       searchParams.destination &&
//       searchParams.origin === searchParams.destination
//     ) {
//       newErrors.destination = "Origin and destination cannot be same";
//     }

//     if (!searchParams.departureDate) {
//       newErrors.departureDate = "Select departure date";
//     }

//     if (searchParams.tripType === "roundtrip" && !searchParams.returnDate) {
//       newErrors.returnDate = "Select return date";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Prevent double submission
//     if (isSubmitting || loading) return;
    
//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     try {
//       if (typeof onSearch === "function") {
//         await onSearch(searchParams);
//       } else {
//         console.log("Search params:", searchParams);
//         // Simulate API call for demo
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         setIsSubmitting(false);
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//       setIsSubmitting(false);
//     }
//   };

//   const handleSwap = () => {
//     setSearchParams((prev) => ({
//       ...prev,
//       origin: prev.destination,
//       destination: prev.origin
//     }));
//   };

//   const handlePassengerChange = (type) => {
//     setSearchParams((prev) => ({
//       ...prev,
//       passengers:
//         type === "increment"
//           ? Math.min(prev.passengers + 1, 9)
//           : Math.max(prev.passengers - 1, 1)
//     }));
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200"
//       >
//         {/* Hero Section */}
//         <div className="mb-10 text-center">
        
       
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Header */}
//           <div className="flex items-center gap-3 border-b pb-4">
//             <Plane className="text-indigo-600" size={28} />
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Search Flights
//               </h2>
//               <p className="text-sm text-gray-500">
//                 Find the best deals on flights worldwide
//               </p>
//             </div>
//           </div>

//           {/* Trip Type */}
//           <div className="flex flex-wrap gap-8">
//             {TRIP_TYPES.map((type) => (
//               <label
//                 key={type.value}
//                 className="flex items-center gap-2 cursor-pointer group"
//               >
//                 <input
//                   type="radio"
//                   name="tripType"
//                   value={type.value}
//                   checked={searchParams.tripType === type.value}
//                   onChange={(e) =>
//                     setSearchParams({
//                       ...searchParams,
//                       tripType: e.target.value,
//                       returnDate: e.target.value === "oneway" ? null : searchParams.returnDate
//                     })
//                   }
//                   className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <span className={`font-medium ${
//                   searchParams.tripType === type.value 
//                     ? "text-indigo-600" 
//                     : "text-gray-600 group-hover:text-gray-900"
//                 }`}>
//                   {type.label}
//                 </span>
//               </label>
//             ))}
//           </div>

//           {/* Routes */}
//           <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
//             <RouteAutocomplete
//               label="From"
//               value={searchParams.origin}
//               onChange={(value) =>
//                 setSearchParams({ ...searchParams, origin: value })
//               }
//               placeholder="Select departure city"
//               excludeCode={searchParams.destination}
//               error={errors.origin}
//             />

//             <RouteAutocomplete
//               label="To"
//               value={searchParams.destination}
//               onChange={(value) =>
//                 setSearchParams({ ...searchParams, destination: value })
//               }
//               placeholder="Select arrival city"
//               excludeCode={searchParams.origin}
//               error={errors.destination}
//             />

//             {/* Swap Button */}
//             <button
//               type="button"
//               onClick={handleSwap}
//               className="hidden md:flex absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 
//               bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition z-10"
//               aria-label="Swap destinations"
//             >
//               <ArrowRightLeft size={18} />
//             </button>
//           </div>

//           {/* Dates */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                 Departure
//               </label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <DatePickerCustom
//                   selected={searchParams.departureDate}
//                   onChange={(date) =>
//                     setSearchParams({
//                       ...searchParams,
//                       departureDate: date
//                     })
//                   }
//                   minDate={new Date()}
//                   error={errors.departureDate}
//                   placeholderText="Fri, Mar 13"
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             {searchParams.tripType === "roundtrip" && (
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Return
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <DatePickerCustom
//                     selected={searchParams.returnDate}
//                     onChange={(date) =>
//                       setSearchParams({
//                         ...searchParams,
//                         returnDate: date
//                       })
//                     }
//                     minDate={searchParams.departureDate}
//                     error={errors.returnDate}
//                     placeholderText="Select return date"
//                     className="pl-10"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Passenger + Cabin */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                 Passengers
//               </label>
//               <div className="flex items-center border rounded-xl overflow-hidden shadow-sm bg-white">
//                 <button
//                   type="button"
//                   onClick={() => handlePassengerChange("decrement")}
//                   className="px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition disabled:opacity-50"
//                   disabled={searchParams.passengers <= 1 || isSubmitting}
//                 >
//                   −
//                 </button>
//                 <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-white">
//                   <Users size={18} className="text-gray-500" />
//                   <span className="font-semibold">{searchParams.passengers}</span>
//                   <span className="text-gray-500 text-sm">
//                     {searchParams.passengers === 1 ? "Passenger" : "Passengers"}
//                   </span>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => handlePassengerChange("increment")}
//                   className="px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition disabled:opacity-50"
//                   disabled={searchParams.passengers >= 9 || isSubmitting}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                 Cabin Class
//               </label>
//               <select
//                 value={searchParams.cabinClass}
//                 onChange={(e) =>
//                   setSearchParams({
//                     ...searchParams,
//                     cabinClass: e.target.value
//                   })
//                 }
//                 disabled={isSubmitting}
//                 className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
//               >
//                 {CABIN_CLASSES.map((cabin) => (
//                   <option key={cabin.value} value={cabin.value}>
//                     {cabin.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Advanced Toggle */}
//           <button
//             type="button"
//             onClick={() => setShowAdvanced(!showAdvanced)}
//             disabled={isSubmitting}
//             className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition disabled:opacity-50"
//           >
//             {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//             {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
//           </button>

//           {/* Advanced Options */}
//           <AnimatePresence>
//             {showAdvanced && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="bg-gray-50 rounded-xl p-4 overflow-hidden"
//               >
//                 <label className="flex gap-3 items-center cursor-pointer group">
//                   <input
//                     type="checkbox"
//                     checked={searchParams.directFlightsOnly}
//                     onChange={(e) =>
//                       setSearchParams({
//                         ...searchParams,
//                         directFlightsOnly: e.target.checked
//                       })
//                     }
//                     disabled={isSubmitting}
//                     className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded disabled:opacity-50"
//                   />
//                   <span className="text-gray-700 group-hover:text-gray-900 disabled:opacity-50">
//                     Direct flights only
//                   </span>
//                 </label>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Search Button - Beautiful loading states */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`relative w-full z-10 flex items-center justify-center gap-3
//               bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl 
//               font-bold text-lg shadow-lg transition-all duration-300 overflow-hidden
//               ${isSubmitting 
//                 ? "cursor-wait opacity-90" 
//                 : "cursor-pointer hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
//               }
//             `}
//           >
//             {/* Animated background effect when loading */}
//             {isSubmitting && (
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400"
//                 initial={{ x: "-100%" }}
//                 animate={{ x: "100%" }}
//                 transition={{
//                   repeat: Infinity,
//                   duration: 1.5,
//                   ease: "linear"
//                 }}
//               />
//             )}

//             {/* Button content */}
//             <span className="relative z-10 flex items-center justify-center gap-3">
//               {isSubmitting ? (
//                 <>
//                   {/* Beautiful spinner with animation */}
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//                     className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
//                   />
//                   <motion.span
//                     initial={{ opacity: 0.7 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
//                   >
//                     Searching flights...
//                   </motion.span>
//                 </>
//               ) : (
//                 <>
//                   <Search size={20} />
//                   <span>Search Flights</span>
//                   {/* Sparkle effect on hover */}
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     whileHover={{ scale: 1 }}
//                     className="absolute -top-1 -right-1"
//                   >
//                     <Sparkles size={16} className="text-yellow-300" />
//                   </motion.div>
//                 </>
//               )}
//             </span>
//           </button>

//           {/* Error summary - if any */}
//           {Object.keys(errors).length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm"
//             >
//               Please fix the errors above before searching.
//             </motion.div>
//           )}
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default FlightSearchForm;


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRightLeft,
  Users,
  ChevronDown,
  ChevronUp,
  Plane,
  Calendar,
  Sparkles
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading) setIsSubmitting(false);
  }, [loading]);

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

    if (!searchParams.departureDate)
      newErrors.departureDate = "Select departure date";

    if (searchParams.tripType === "roundtrip" && !searchParams.returnDate)
      newErrors.returnDate = "Select return date";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (isSubmitting || loading) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (typeof onSearch === "function") {
        await onSearch(searchParams);
      } else {
        console.log(searchParams);
        await new Promise(r => setTimeout(r,2000));
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }

  };

  const handleSwap = () => {

    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));

  };

  const handlePassengerChange = (type) => {

    setSearchParams(prev => ({
      ...prev,
      passengers:
        type === "increment"
          ? Math.min(prev.passengers + 1, 9)
          : Math.max(prev.passengers - 1, 1)
    }));

  };

  return (

    <div className="w-full max-w-6xl mx-auto px-4">

      <motion.div
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200"
      >

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* HEADER */}
          <div className="flex items-center gap-3 border-b pb-4">
            <Plane className="text-indigo-600" size={28}/>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Search Flights
              </h2>
              <p className="text-sm text-gray-500">
                Find the best deals on flights worldwide
              </p>
            </div>
          </div>

          {/* TRIP TYPE */}
          <div className="flex flex-wrap gap-8">

            {TRIP_TYPES.map(type => (

              <label key={type.value} className="flex items-center gap-2 cursor-pointer">

                <input
                  type="radio"
                  name="tripType"
                  value={type.value}
                  checked={searchParams.tripType === type.value}
                  onChange={(e)=>setSearchParams({
                    ...searchParams,
                    tripType:e.target.value,
                    returnDate:e.target.value==="oneway"?null:searchParams.returnDate
                  })}
                />

                <span className={`font-medium ${
                  searchParams.tripType===type.value
                  ? "text-indigo-600"
                  : "text-gray-600"
                }`}>
                  {type.label}
                </span>

              </label>

            ))}

          </div>

          {/* ROUTES */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-end">

            <RouteAutocomplete
              label="From"
              value={searchParams.origin}
              onChange={(v)=>setSearchParams({...searchParams,origin:v})}
              placeholder="Departure city"
              excludeCode={searchParams.destination}
              error={errors.origin}
            />

            <RouteAutocomplete
              label="To"
              value={searchParams.destination}
              onChange={(v)=>setSearchParams({...searchParams,destination:v})}
              placeholder="Arrival city"
              excludeCode={searchParams.origin}
              error={errors.destination}
            />

            <button
              type="button"
              onClick={handleSwap}
              className="hidden md:flex absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition z-20"
            >
              <ArrowRightLeft size={18}/>
            </button>

          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm font-semibold mb-2 block">Departure</label>

              <div className="relative">

                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>

                <DatePickerCustom
                  selected={searchParams.departureDate}
                  onChange={(date)=>setSearchParams({...searchParams,departureDate:date})}
                  minDate={new Date()}
                  error={errors.departureDate}
                  className="pl-10"
                />

              </div>

            </div>

            {searchParams.tripType==="roundtrip" && (

              <div>

                <label className="text-sm font-semibold mb-2 block">Return</label>

                <div className="relative">

                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>

                  <DatePickerCustom
                    selected={searchParams.returnDate}
                    onChange={(date)=>setSearchParams({...searchParams,returnDate:date})}
                    minDate={searchParams.departureDate}
                    error={errors.returnDate}
                    className="pl-10"
                  />

                </div>

              </div>

            )}

          </div>

          {/* PASSENGERS + CABIN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="text-sm font-semibold mb-2 block">Passengers</label>

              <div className="flex items-center border rounded-xl overflow-hidden">

                <button
                  type="button"
                  onClick={()=>handlePassengerChange("decrement")}
                  disabled={searchParams.passengers<=1}
                  className="px-5 py-3 bg-gray-100"
                >
                  −
                </button>

                <div className="flex-1 flex items-center justify-center gap-2">

                  <Users size={18}/>
                  {searchParams.passengers}

                </div>

                <button
                  type="button"
                  onClick={()=>handlePassengerChange("increment")}
                  disabled={searchParams.passengers>=9}
                  className="px-5 py-3 bg-gray-100"
                >
                  +
                </button>

              </div>

            </div>

            <div>

              <label className="text-sm font-semibold mb-2 block">Cabin Class</label>

              <select
                value={searchParams.cabinClass}
                onChange={(e)=>setSearchParams({...searchParams,cabinClass:e.target.value})}
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
              >

                {CABIN_CLASSES.map(cabin=>(
                  <option key={cabin.value} value={cabin.value}>
                    {cabin.label}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* ADVANCED */}
          <button
            type="button"
            onClick={()=>setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-indigo-600 font-medium"
          >
            {showAdvanced?<ChevronUp size={18}/>:<ChevronDown size={18}/>}
            Advanced Options
          </button>

          <AnimatePresence>

            {showAdvanced && (

              <motion.div
                initial={{opacity:0,height:0}}
                animate={{opacity:1,height:"auto"}}
                exit={{opacity:0,height:0}}
                className="bg-gray-50 rounded-xl p-4"
              >

                <label className="flex gap-2 items-center">

                  <input
                    type="checkbox"
                    checked={searchParams.directFlightsOnly}
                    onChange={(e)=>setSearchParams({...searchParams,directFlightsOnly:e.target.checked})}
                  />

                  Direct flights only

                </label>

              </motion.div>

            )}

          </AnimatePresence>

          {/* SEARCH BUTTON */}
          <div className="relative z-[9999] isolate">

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-3
              bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl
              font-bold text-lg shadow-lg transition-all duration-300
              ${isSubmitting
                ? "cursor-wait opacity-80"
                : "hover:scale-[1.02] hover:shadow-2xl"
              }`}
            >

              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{rotate:360}}
                    transition={{repeat:Infinity,duration:1,ease:"linear"}}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Searching flights...
                </>
              ) : (
                <>
                  <Search size={20}/>
                  Search Flights
                </>
              )}

            </button>

          </div>

        </form>

      </motion.div>

    </div>
  );
};

export default FlightSearchForm;
