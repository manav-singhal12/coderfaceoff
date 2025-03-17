import React from 'react'

const Footer = () => {
  return (
    <div className="bg-[#2b2b2b] text-white flex flex-col md:flex-row justify-between items-center p-6 md:p-4">
      {/* Left Section */}
      <div className="one w-full md:w-[30%] text-center md:text-left mb-4 md:mb-0">
        <h1 className="text-xl font-bold">Contact Us</h1>
        <p>Email: manavsinghal165@gmail.com</p>
        <p>Phone: +91 9871610915</p>
      </div>
  
      {/* Middle Section */}
      <div className="two w-full md:w-[40%] text-center py-4">
        <p>Made with ❤️ by Manav Singhal</p>
      </div>
  
      {/* Right Section */}
      <div className="three w-full md:w-[30%] flex flex-col items-center md:items-end">
        <h1 className="text-xl font-bold mb-2">Follow Us</h1>
        <div className="flex gap-4">
          <a href="https://github.com/manav-singhal12" target="_blank" rel="noopener noreferrer">
            <img src="/githubb.png" alt="GitHub" className="h-8 w-8" />
          </a>
          <a href="https://www.linkedin.com/in/manav-singhal-9a737727a/" target="_blank" rel="noopener noreferrer">
            <img src="/linkedinn.png" alt="LinkedIn" className="h-8 w-8" />
          </a>
          
        </div>
      </div>
    </div>
  );
  
}

export default Footer
