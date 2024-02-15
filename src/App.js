import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './component/Dashboard';
import Devices from './component/Devices';
import './App.css';
import "./scada.css";
import "./component/Navbar.css";
import "./component/Reports.css";
import "./component/Devices.css";
import Login from './component/Login';
import Navbar from './component/Navbar';
import UiReports from './component/UiReports';
import MonthlyReports from './component/MonthlyReports';
import DailyReports from './component/DailyReports';
import DeviceReports from './component/DeviceReports';
import TrendsReports from './component/TrendsReports';
import { getToken } from './utils/constant';
import Footer from './component/Footer';

const  App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuthStatus = sessionStorage.getItem('isAuthenticated');
    return storedAuthStatus ? JSON.parse(storedAuthStatus) : false;
  });

  useEffect(() => {
    // navbar
    if(window.location.pathname == '/' && isAuthenticated){
        window.location.replace('/dashboard')
    }else{
      if(window.location.pathname == '/'){
        setIsAuthenticated(false)
      }
    }
    sessionStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <>
      <BrowserRouter>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated}/>}
        <Routes>
          <Route exact path="/" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
          <Route path="/" element={getToken() !== null ? <Navigate to="/dashboard" replace/> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
          <Route path="/dashboard/*" element={<Dashboard />}/>
          <Route path="/devices/:id" element={<Devices />} />
          <Route path="/reports/ui-reports" element={<UiReports />} />
          <Route path="/reports/device-reports" element={<DeviceReports />} />
          <Route path="/reports/daily-reports" element={<DailyReports />} />
          <Route path="/reports/monthly-reports" element={<MonthlyReports />} />
          <Route path="/reports/trends-reports" element={<TrendsReports/>} />
          <Route path="*" element={<Navigate to={{ pathname: "/dashboard" }} />} />
        </Routes>
        {isAuthenticated && <Footer/>}
      </BrowserRouter>
    </>
  );
}

export default App;


