import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, style, className = "", noPadding = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card ${className}`}
      style={{
        padding: noPadding ? '0' : '2rem',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
};
