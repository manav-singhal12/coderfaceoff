import { React, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/auth/authSlice'
import { useLogoutMutation } from '../redux/api/userApiSlice'
import { toast } from 'react-toastify'

const Navbar = () => {
    const navigate = useNavigate()

    const { userInfo } = useSelector((state) => (state.auth))

    //mobile navbar
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const dropdownRef = useRef(null)  // ref to dropdown menu element for outside clicks
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const mobileMenuRef = useRef(null) //ref to mobile menu element for outside clicks

    const dispatch = useDispatch() 
    const [logoutApiCall] = useLogoutMutation()

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev)
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownVisible(false)
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setIsMobileMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)  // mousedown for faster response
        return () => document.removeEventListener('mousedown', handleClickOutside) // cleanup for new event listeneer to work
    }, [])

    const LogoutHandler = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            toast.success("Logout success")
            navigate("/")
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='bg-[#2b2b2b] flex justify-between p-3 text-white relative'>
            <div className="left flex gap-4 items-center text-xl font-bold">
                <img className="h-8 w-8" src="/logo.png " alt="logo" />
                <NavLink to="/">SolBudget</NavLink>
            </div>
            
            {userInfo ? (
                <div className='flex flex-row items-center'>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex">
                        <ul className='flex gap-6 items-center'>
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-black bg-white p-4 text-lg font-bold transition duration-200"
                                            : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/mywallets"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-black bg-white p-4 text-lg font-bold transition duration-200"
                                            : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                                    }
                                >
                                    My Wallets
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/transaction"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-black bg-white p-4 text-lg font-bold transition duration-200"
                                            : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                                    }
                                >
                                    Transaction History
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/limits"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-black bg-white p-4 text-lg font-bold transition duration-200"
                                            : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                                    }
                                >
                                    Limits
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/transferfunds"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-black bg-white p-4 text-lg font-bold transition duration-200"
                                            : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                                    }
                                >
                                    Transfer Funds
                                </NavLink>
                            </li>
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-2 text-white focus:outline-none"
                                >
                                    {userInfo.data.user.avatar ? (
                                        <img
                                            src={userInfo.data.user.avatar}
                                            alt="Profile"
                                            className="w-7 h-7 rounded-full object-cover cursor-pointer"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-lg text-gray-800">
                                                {userInfo.data.user.userName[0]}
                                            </span>
                                        </div>
                                    )}
                                    <span className="hidden sm:block">
                                        {userInfo.data.user.userName}
                                    </span>
                                </button>

                                {dropdownVisible && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute right-0 mt-2 w-80 bg-[#2b2b2b] text-white border border-gray-200 rounded-lg shadow-xl z-20"
                                    >
                                        <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            {userInfo.data.user.avatar ? (
                                                <img
                                                    src={userInfo.data.user.avatar}
                                                    alt="Profile"
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-xl text-white">
                                                        {userInfo.data.user.username[0]}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-white text-lg">
                                                    Hi! {userInfo.data.user.fullname}
                                                </h3>
                                                <p className="text-sm text-white">
                                                    {userInfo.data.user.email}
                                                </p>
                                            </div>
                                        </div>



                                    </div>
                                    <div className="p-4 space-y-2">
                                        <button
                                            onClick={() => {
                                                setDropdownVisible(false);
                                                navigate('/update-profile');
                                            }}
                                            className="w-full text-left px-4 py-2 font-semibold text-white rounded transition duration-200 hover:bg-black hover:cursor-pointer"
                                        >
                                            Update Profile
                                        </button>
                                        <button
                                            onClick={LogoutHandler}
                                            className="w-full text-left px-4 py-2 font-semibold text-white rounded transition duration-200 hover:bg-black hover:cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    </div>
                               
                                    </div>
                                )}
                            </div>
                        </ul>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 ml-4"
                    >
                        <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div 
                            ref={mobileMenuRef}
                            className="absolute top-full left-0 right-0 bg-[#2b2b2b] z-50 md:hidden"
                        >
                            <ul className="flex flex-col p-4 gap-4">
                                <li>
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) => 
                                            isActive 
                                                ? "text-black bg-white p-2 block w-full text-left rounded" 
                                                : "text-white p-2 block w-full text-left hover:bg-gray-700 rounded"
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/mywallets"
                                        className={({ isActive }) => 
                                            isActive 
                                                ? "text-black bg-white p-2 block w-full text-left rounded" 
                                                : "text-white p-2 block w-full text-left hover:bg-gray-700 rounded"
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Wallets
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/transaction"
                                        className={({ isActive }) => 
                                            isActive 
                                                ? "text-black bg-white p-2 block w-full text-left rounded" 
                                                : "text-white p-2 block w-full text-left hover:bg-gray-700 rounded"
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Transaction History
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/limits"
                                        className={({ isActive }) => 
                                            isActive 
                                                ? "text-black bg-white p-2 block w-full text-left rounded" 
                                                : "text-white p-2 block w-full text-left hover:bg-gray-700 rounded"
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Limits
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/transferfunds"
                                        className={({ isActive }) => 
                                            isActive 
                                                ? "text-black bg-white p-2 block w-full text-left rounded" 
                                                : "text-white p-2 block w-full text-left hover:bg-gray-700 rounded"
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Transfer Funds
                                    </NavLink>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            navigate('/update-profile')
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="text-white p-2 block w-full text-left hover:bg-gray-700 rounded"
                                    >
                                        Update Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={LogoutHandler}
                                        className="text-white p-2 block w-full text-left hover:bg-gray-700 rounded"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <ul className='flex gap-8'>
                    <li>
                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-black bg-white p-4 text-lg font-bold transition duration-200"
                                    : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                            }
                        >
                            Register
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-black bg-white p-4 text-lg font-bold transition duration-200"
                                    : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                            }
                        >
                            Login
                        </NavLink>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default Navbar