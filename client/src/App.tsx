import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TeamPage from './pages/TeamPage';
import './App.css'
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Grid from '@mui/material/Grid2';

import Header from './layout/Header';
import MyTasks from './pages/MyTasks';
import Sidebar from './layout/Sidebar';
import Teams from './pages/Teams';
import ProjectPage from './pages/ProjectPage';
import ResetPasswordPage from './pages/ResetPassword';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 2 }}>
          <Sidebar />
        </Grid>
        <Grid size={{ xs: 12, md: 10 }}>
          {/* <Header /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamPage />} />
            <Route path="/teams/:id/projects" element={<TeamPage />} />
            <Route path="/teams/:team_id/projects/:id" element={<ProjectPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </Grid>
      </Grid>
      </LocalizationProvider>
  )
}

export default App
