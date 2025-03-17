import React from 'react';
import { useSelector } from 'react-redux';
import { FaGraduationCap, FaUserTie, FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Please log in to view your dashboard.
        </h2>
      </div>
    );
  }

  const user = userInfo.data.user;
  console.log(user)

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="bg-[#2b2b2b] bg-opacity-80 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
        {/* Top Section: Profile Picture, Name & Email */}
      <h2 className="text-4xl font-extrabold text-center text-white mb-10">My Dashboard</h2>

        <div className="flex flex-col items-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-32 h-32 rounded-full border-4 border-[#36a1b6] shadow-lg mb-6"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-500 text-white text-4xl font-bold mb-6">
              Hi 👋 {user.username}
            </div>
          )}
          <h3 className="text-3xl font-bold  mb-2">              Hi ! {user.username}  
          </h3>
         
        </div>
        {/* Details Section */}
       <p>Full Name</p>
       <p>{user.fullname}</p>
      </div>
    </div>
  );
};

export default Dashboard;
