import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ApplicationModal from '../applications/ApplicationModal';
import ToastContainer from '../common/ToastContainer';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleApplicationAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="main-wrapper">
        <Navbar
          onOpenMobile={() => setMobileOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <main className="main-content">
          <Outlet context={{ refreshTrigger, triggerRefresh: handleApplicationAdded, openAddModal: () => setIsAddModalOpen(true) }} />
        </main>
      </div>

      {isAddModalOpen && (
        <ApplicationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleApplicationAdded}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default AppLayout;
