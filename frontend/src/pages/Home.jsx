import React from 'react';
import { FaHome, FaBell, FaCog, FaComment } from 'react-icons/fa';

const Home = () => {
  const communities = [
    { name: "UX Designers", friends: 32 },
    { name: "Frontend Devs", friends: 12 }
  ];
  
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
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
      {/* Left Sidebar */}
      <div className='flex'> 
      <aside className="w-1/4 p-6 hidden lg:block">
        <div className="bg-[#282828] p-4 rounded-lg text-center">
          <div className="w-24 h-24 mx-auto rounded-md bg-[#282828] "><img src='./logo.png'></img></div>
          <h2 className="mt-4 text-lg font-bold">Elviz Dizzouza</h2>
          <p className="text-gray-400">@elvizoodem</p>
          <p className="mt-2 text-yellow-400">⭐ UI/UX Designer ⭐</p>
          <button className="mt-3 w-full bg-[#282828] py-2 rounded-lg">My Profile</button>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold text-gray-400">Skills</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-[#282828] px-3 py-1 rounded">UX Designer</span>
            <span className="bg-[#282828] px-3 py-1 rounded">Front & Backend Dev</span>
            <span className="bg-[#282828] px-3 py-1 rounded">JS Coder</span>
          </div>
        </div>

        <div className="mt-6">
  <h3 className="font-semibold text-gray-400">Communities</h3>
  <ul className="mt-2 space-y-2">
    {communities.map((community, index) => (
      <li key={index} className="p-2 rounded flex justify-between">
        <span>{community.name}</span>
        <span className="text-yellow-400">{community.friends} Friends</span>
      </li>
    ))}
  </ul>
</div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Navbar */}
       

        {/* Stories Section */}
        <div className="flex space-x-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-16 h-16 border-2 border-yellow-400 rounded-md overflow-hidden">
              <img src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} alt="story" />
            </div>
          ))}
        </div>

        {/* Post Input */}
        <div className="bg-[#282828] p-4 rounded-lg mb-6">
          <input type="text" placeholder="Tell your friends about your thoughts..." className="w-full bg-gray-[#1A1A1A] px-4 py-2 rounded-lg" />
        </div>

        {/* Post Section */}
        <div className="bg-[#282828] p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="user" className="w-10 h-10 rounded-full" />
            <div>
              <h4 className="font-semibold">@george</h4>
              <span className="text-yellow-400">1 hour ago</span>
            </div>
          </div>
          <p className="mt-3 text-gray-400">Lorem ipsum dolor sit amet consectetur.</p>
          <img src="./logo.png" alt="post" className="w-full mt-3 rounded-lg" />
          
          <div className="flex justify-between mt-3">
            <button className="text-gray-400">❤️</button>
            <button className="text-gray-400">💬</button>
            <button className="bg-yellow-400 px-4 py-1 rounded">Save</button>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-1/4 p-6 hidden lg:block bg-[#282828]">
        <h3 className="text-gray-400 mb-4">Recent Activity</h3>
        <ul className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="bg-[#1A1A1A] p-3 rounded  justify-between">
              <div className="flex items-center space-x-3">
                <img src={`https://randomuser.me/api/portraits/men/${i + 15}.jpg`} alt="user" className="w-10 h-10 rounded-full" />
                <div>
                  <h4 className="font-semibold">User {i + 1}</h4>
                  <p className="text-yellow-400 text-sm">Followed you . 3 min ago</p>
                </div>
              </div>
              <br></br>
            <div className='flex justify-between'>
            <button className="text-white px-3 py-1 bg-black rounded">Remove</button>
            <button className="text-black px-3 py-1 bg-yellow-400 rounded">Follow Back</button>
            </div>
            </li>
          ))}
        </ul>
      </aside>
      </div>
    </div>
  );
}

export default Home;
