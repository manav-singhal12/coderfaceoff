import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, Navigate, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from './Layout.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/login.jsx';
import Home from './pages/Home.jsx';
import ChatUI from './pages/Chat.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="/chatui" element={<ChatUI/>}/>


    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode >
    {/* <Provider store={store}> */}
      <App/>
      <RouterProvider router={router}/>
    {/* </Provider> */}
  </StrictMode>,
)
