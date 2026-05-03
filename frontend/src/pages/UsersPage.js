import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import UsersList from '../UsersList';

const UsersPage = () => {
  return (
    <DashboardLayout title="Manage Users">
      <div className="glass-card">
        <UsersList />
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
