import React from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

const Loader = ({ size = 'md', color = 'indigo', fullScreen = false, text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colors = {
    indigo: 'border-indigo-600',
    white: 'border-white',
    gray: 'border-gray-600',
    blue: 'border-blue-600'
  };

  const planeSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10'
  };

  const loader = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Spinner */}
        <div
          className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}
          role="status"
        >
          <span className="sr-only">{text}</span>
        </div>
        
        {/* Plane Icon */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity }
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Plane className={`${planeSizes[size]} text-indigo-600 transform -rotate-45`} />
        </motion.div>
      </div>
      
      {text && (
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-3 text-sm font-medium text-gray-600"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

// Skeleton Loader Components
export const SkeletonLoader = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
};

export const FlightCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <SkeletonLoader className="w-12 h-12 rounded-full" />
          <div>
            <SkeletonLoader className="h-5 w-32 mb-2" />
            <SkeletonLoader className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-8 mb-4 md:mb-0">
          <div className="text-center">
            <SkeletonLoader className="h-8 w-16 mb-2" />
            <SkeletonLoader className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-center">
            <SkeletonLoader className="h-4 w-16 mb-2" />
            <SkeletonLoader className="h-2 w-24" />
          </div>
          <div className="text-center">
            <SkeletonLoader className="h-8 w-16 mb-2" />
            <SkeletonLoader className="h-4 w-12" />
          </div>
        </div>
        <div className="text-right">
          <SkeletonLoader className="h-8 w-24 mb-2 ml-auto" />
          <SkeletonLoader className="h-10 w-28 rounded-lg ml-auto" />
        </div>
      </div>
    </div>
  );
};

export const SeatGridSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-center mb-8">
        <SkeletonLoader className="h-8 w-32" />
      </div>
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex justify-center gap-2">
            {[...Array(6)].map((_, j) => (
              <SkeletonLoader key={j} className="w-10 h-10 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;