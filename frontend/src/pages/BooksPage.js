import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import BooksList from '../BooksList';
import { GlassCard } from '../components/Cards'; // Assuming I'll create this

const BooksPage = () => {
  return (
    <DashboardLayout title="Manage Inventory">
      <div className="glass-card">
        <BooksList />
      </div>
    </DashboardLayout>
  );
};

export default BooksPage;
