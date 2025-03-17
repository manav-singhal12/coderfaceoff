import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, Navigate, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store.js';
import Dashboard from './pages/Dashboard.jsx';
import Register from './pages/Register.jsx';
import Layout from './Layout.jsx';
import Login from './pages/Login.jsx';
import UpdateProfile from './pages/UpdateProfile.jsx';
import Home from './pages/Home.jsx';
import MyWallets from './pages/MyWallets.jsx';
import WalletTransactions from './pages/WalletTransaction.jsx';
import TransferFunds from './pages/TransferFunds.jsx';
import CategorizedTransaction from './pages/CategorizedTransaction.jsx';
import GetTransaction from './pages/GetTransactions.jsx';
import Limits from './pages/Limits.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route index element={<Home/>}/>
      <Route path="mywallets" element={<MyWallets/>}/>
      <Route path='register' element={<Register />}/>
      <Route path='login' element={<Login />}/>
      {/* <Route path="dashboard" element={<Dashboard />}/> */}
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/transaction" element={<GetTransaction/>} />
      <Route path="/transferfunds" element={<TransferFunds />} />
      <Route path="/mywallets/transactions/:walletkey" element={<CategorizedTransaction />} />
      <Route path="/mywallets/updatetransactions/:walletkey" element={<WalletTransactions />} />
      <Route path="/limits" element={<Limits/>}/>
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode >
    <Provider store={store}>
      <App/>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
