import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  padding = true,
  onClick,
  elevated = true
}) => {
  const baseClasses = 'bg-white rounded-xl overflow-hidden';
  const shadowClasses = elevated ? 'shadow-lg' : '';
  const hoverClasses = hoverable ? 'hover:shadow-xl transition-shadow duration-300 cursor-pointer' : '';
  const paddingClasses = padding ? 'p-6' : '';

  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${shadowClasses} ${hoverClasses} ${paddingClasses} ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card;