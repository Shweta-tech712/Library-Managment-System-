import React from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header style={{ 
          marginBottom: '2.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{title}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>LibNova Enterprise v2.0</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
             {/* Profile/Add quick actions could go here */}
          </div>
        </header>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
