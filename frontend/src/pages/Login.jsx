import React from 'react'

const Login = () => {
  return (
    <div className="flex h-screen ">
      {/* Left Section */}
      <div className="left w-1/2 flex flex-col justify-between items-center p-8 bg-gray-700 text-white">
        <div className="logo mb-6">
          {/* You can put a logo image or text here */}
         <div className="flex -mx-54">
            <img src='/linkedin.png'></img>
         <h1 className="text-3xl font-bold text-yellow-300">B Chat</h1>
         </div>
        </div>
        <p className="text-xl font-semibold mb-2">Welcome Back</p>
        
        <div className="w-full max-w-sm">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            placeholder="*******"
            className="w-full px-4 py-2 mb-4 border rounded"
          />

          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            placeholder="*******"
            className="w-full px-4 py-2 mb-4 border rounded"
          />

          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <p className="text-sm text-blue-500 cursor-pointer">Forgot Password?</p>
          </div>

          <button className="w-full  text-white py-2 rounded mb-2 bg-gray-800">
            Sign In
          </button>
          <button className="w-full border border-gray-400 py-2 rounded bg-black">
            Sign In with Google
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500">© 2024 Banish</p>
      </div>

      {/* Right Section */}
      <div className="right w-1/2 hidden md:block">
        <img
          src="/logo.png"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default Login
