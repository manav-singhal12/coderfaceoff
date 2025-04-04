import React from 'react'
import { FaHome, FaBell, FaCog, FaComment } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div>
       <div  className='m-4'>
             <header className="flex justify-between items-center mb-6">
              <div className='flex'>
              <img src="./logo.png" alt="Logo" className="w-10 h-10" />
              <input type="text" placeholder="Explore" className="px-4 py-2 rounded bg-[#282828] border-none outline-none" />
              </div>
                <div className="flex space-x-4">
                  <FaHome size={24} />
                  <FaComment size={24} />
                  <FaBell size={24} />
                  <FaCog size={24} />
                </div>
                <img  className='h-8 w-8' src='./logo.png'></img>
              </header>
             </div>
    </div>
  )
}

export default Navbar
