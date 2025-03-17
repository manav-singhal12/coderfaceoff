import React from 'react'
import { Outlet } from 'react-router'
import {ToastContainer} from 'react-toastify'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 w-full h-full">
        <ToastContainer />
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default Layout