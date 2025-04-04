import React, { useState } from "react";
import { FaUser, FaLock, FaKey, FaHistory, FaShieldAlt, FaWrench, FaSignOutAlt, FaHome, FaComment, FaSun } from "react-icons/fa";
import Navbar from "../components/Navbar";
const SidebarItem = ({ icon, label, active, onClick }) => (
  <div
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer ${
      active ? "bg-yellow-400 text-black" : "hover:bg-gray-800 text-gray-300"
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Privacy and Security");

  return (
   <div>
    <Navbar/>
     <div className="bg-black text-white min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-1/4 p-6 hidden lg:block bg-[#282828] rounded-3xl h-[60%]">
        <input
          type="text"
          placeholder="Search settings"
          className="w-full px-4 py-2 rounded bg-[#282828] text-gray-300 outline-none"
        />
        <div className="mt-6 space-y-2">
          <SidebarItem icon={<FaUser />} label="Account" />
          <SidebarItem icon={<FaLock />} label="Apps and website" />
          <SidebarItem icon={<FaKey />} label="Change Password" />
          <SidebarItem icon={<FaHistory />} label="Activity log" />
          <SidebarItem icon={<FaShieldAlt />} label="Privacy and Security" active />
          <SidebarItem icon={<FaWrench />} label="Others" />
          <SidebarItem icon={<FaSignOutAlt />} label="Log Out" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Navbar */}
        {/* <header className="flex justify-between items-center mb-6">
          <input type="text" placeholder="#Explore" className="px-4 py-2 rounded bg-gray-800 border-none outline-none" />
          <div className="flex space-x-4">
            <FaHome size={24} />
            <FaComment size={24} />
            <FaSun size={24} />
            <img src="https://randomuser.me/api/portraits/men/20.jpg" alt="profile" className="w-8 h-8 rounded-full" />
          </div>
        </header> */}

        {/* Privacy and Security Settings */}
        <div className="bg-gray-[#1A1A1A] p-6 rounded-lg">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FaShieldAlt /> <span>Privacy and Security</span>
          </h2>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Account Privacy</h3>
            <p className="text-gray-400 mt-2">Private account</p>
            <p className="text-gray-500 text-sm mt-1">
              Lorem ipsum dolor sit amet consectetur. Mauris scelerisque rhoncus pretium sagittis nisi neque.
            </p>
          </div>

          <hr className="my-4 border-gray-700" />

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Account Status</h3>
            <label className="flex items-center space-x-2 mt-2">
              <input type="checkbox" checked className="w-5 h-5 text-yellow-400" />
              <span>Show activity status</span>
            </label>
            <p className="text-gray-500 text-sm mt-1">
              Lorem ipsum dolor sit amet consectetur. Mauris scelerisque rhoncus pretium sagittis nisi neque.
            </p>
          </div>

          <hr className="my-4 border-gray-700" />

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
            <label className="flex items-center space-x-2 mt-2">
              <input type="checkbox" className="w-5 h-5 text-yellow-400" />
              <span>Use authentication app</span>
            </label>
            <p className="text-gray-500 text-sm mt-1">
              Lorem ipsum dolor sit amet consectetur. Mauris scelerisque rhoncus pretium sagittis nisi neque.
            </p>
            <label className="flex items-center space-x-2 mt-2">
              <input type="checkbox" checked className="w-5 h-5 text-yellow-400" />
              <span>Use authentication app</span>
            </label>
            <p className="text-gray-500 text-sm mt-1">
              Lorem ipsum dolor sit amet consectetur. Mauris scelerisque rhoncus pretium sagittis nisi neque.
            </p>
          </div>
        </div>
      </main>
    </div>
   </div>
  );
};

export default Settings;
