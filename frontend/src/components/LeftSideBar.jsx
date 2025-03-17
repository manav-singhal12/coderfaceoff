import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux';
const LeftSideBar = () => {
    const { userInfo } = useSelector(state => state.auth);
    if(userInfo){
    console.log(userInfo)
    const user = userInfo.data.user;
    console.log(user);
    
    return (
        
        <div className='bg-gray-500 w-[20%] h-screen' >
            <h1 className='text-cyan-800-900'>BlockBudget</h1>
            <ul>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-blue-50 underline text-lg font-bold transition duration-200"
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
                                ? "text-blue-50 underline text-lg font-bold transition duration-200"
                                : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                        }
                    >
                        My Wallets
                    </NavLink>
                </li>
                <li><NavLink
                    to="/transaction"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-50 underline text-lg font-bold transition duration-200"
                            : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                    }
                >
                    Transaction History
                </NavLink></li>
                <li><NavLink
                    to="/transferfunds"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-50 underline text-lg font-bold transition duration-200"
                            : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                    }
                >
                    Transfer Funds
                </NavLink></li>
                <li><NavLink
                    to="/connectwallet"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-50 underline text-lg font-bold transition duration-200"
                            : "text-white text-lg font-bold transition duration-200 hover:text-blue-50"
                    }
                >
                    Connect Wallet
                </NavLink></li>
            </ul>
        </div>
    )}
    return null;
}

export default LeftSideBar
