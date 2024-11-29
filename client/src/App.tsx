import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import './App.css'
import axios from 'axios';
import ProtectedRoute from './misc/ProtectedRoute';
import LoginPage from './pages/LoginPage';

import Header from './layout/Header';
import MyTasks from './pages/MyTasks';

axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-tasks" element={<MyTasks />} />
      </Routes>
    </>
  )
}

export default App
