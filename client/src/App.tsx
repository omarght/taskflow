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
import Grid from '@mui/material/Grid2';

import Header from './layout/Header';
import MyTasks from './pages/MyTasks';
import Sidebar from './layout/Sidebar';

axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0)

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 2 }}>
        <Sidebar />
      </Grid>
      <Grid size={{ xs: 12, md: 10 }}>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-tasks" element={<MyTasks />} />
        </Routes>
      </Grid>
    </Grid>
  )
}

export default App
