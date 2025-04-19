import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

import './App.css';

import Home from './pages/Home';
import Profile from './pages/Profile';
import TeamPage from './pages/TeamPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyTasks from './pages/MyTasks';
import Teams from './pages/Teams';
import ProjectPage from './pages/ProjectPage';
import ResetPasswordPage from './pages/ResetPassword';
import Sidebar from './layout/Sidebar';

axios.defaults.withCredentials = true;

function App(): JSX.Element {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 2 }}>
          <Sidebar />
        </Grid>
        <Grid size={{ xs: 12, md: 10 }}>
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
  );
}

export default App;