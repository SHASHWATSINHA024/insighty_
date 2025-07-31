import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
        />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Insighty</h3>
        <p className="text-gray-600">Please wait while we prepare your dashboard...</p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 