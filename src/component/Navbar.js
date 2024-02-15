import React from 'react';
import { useNavigate,NavLink } from 'react-router-dom';
import "./Navbar.css"
import '../App.css';
import "../scada.css";
import Logo from "./../images/logoBackground.png";
import { useState, useEffect } from "react";
import Pdf from './Pdf';
import { getUser } from '../utils/constant';

const Navbar = ({setIsAuthenticated}) => {
    const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);
    const [isWebscadaDropdownOpen, setIsWebscadaDropdownOpen] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const [showNavbar, setShowNavbar] = useState(false);
    let navigate = useNavigate();

    const onReturn = () => {
        navigate("/dashboard")
    }

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar);
      };

    const [isClick, setIsClick] = useState(false);
    const url = window.location.href;

    const handleLogout = () => {
        setIsAuthenticated(false)
        sessionStorage.clear();
        navigate('/');
    }

    const handleMinimize = () => {
        if (isClick) {
            setIsClick(false);
        } else {
            setIsClick(true);
        }
    }


    const onLogout = () => {
        navigate('/login')
    }
    const toggleReportsDropdown = (e) => {
        e.preventDefault();
        setIsWebscadaDropdownOpen(false)
        setIsReportsDropdownOpen(!isReportsDropdownOpen);
    };

    const toggleWebscadaDropdown = (e) => {
        setIsReportsDropdownOpen(false)
        e.preventDefault();
        setIsWebscadaDropdownOpen(!isWebscadaDropdownOpen);
    };
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const toggleDropdown = (e) => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        } else {
            setIsDropdownOpen(true);
        }
    };

    const handleButton = () => {
        handleMinimize();
        toggleDropdown();
    }
    const handleToggleNavCollapse = () => {
        setIsNavCollapsed(!isNavCollapsed);
        setIsReportsDropdownOpen(false);
        setIsWebscadaDropdownOpen(false);
    };

    const navigateReports = (data) => {
        navigate(data);
        setIsReportsDropdownOpen(false);
        setIsWebscadaDropdownOpen(false);
        setIsClick(false)
    }

    const handleClickOutsideNavbar = (event) => {
        const navbar = document.getElementById('navbar');
        if (navbar && !navbar.contains(event.target)) {
          setIsReportsDropdownOpen(false);
          setIsWebscadaDropdownOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutsideNavbar);
        return () => {
          document.removeEventListener('click', handleClickOutsideNavbar);
        };
      }, []);


    return (
        <div data-v-35c5e06d className="header" style={{ padding: "0" }}>
            <nav id="navbar" data-v-35c5e06d className="navbar report-navbar navbar-dark bg-info navbar-expand-lg">
                <h4 data-v-35c5e06d text-truncate="" target="_self" className="nav-link nav-header router-link-exact-active router-link-active" style={{ color: "white" }} onClick={onReturn} >TATA STEEL WEST BOKARO WEB SCADA</h4>
                <button data-v-35c5e06d
                    type="button"
                    aria-label="Toggle navigation"
                    onClick={() => {
                        handleButton()
                    }}

                    className={isClick ? 'navbar-toggler not-collapsed' : 'navbar-toggler collapsed'}
                    style={{ border: "none" }}
                    aria-expanded={isClick ? 'true' : 'false'}
                    aria-controls="nav-collapse" >
                    <span className="navbar-toggler-icon toggler-icon">
                    </span>
                </button>
                <div data-v-35c5e06d id="nav-collapse"

                    className={isClick ? 'navbar-collapse collapse show' : 'navbar-collapse collapse'}
                    style={{ display: isClick ? 'block' : 'none', height: isClick && !isReportsDropdownOpen ? '11.5rem' : '0rem', background: isClick ? ' linear-gradient(to right, #278062, #278062, #278062) ' : '', textAlign: isClick ? '-webkit-center' : '' }}
                >
                    <ul data-v-35c5e06d className="navbar-nav ml-auto">
                        <a data-v-35c5e06d href="/dashboard" aria-current="page" className="nav-link router-link-exact-active router-link-active">Dashboard</a>
                        <ul data-v-35c5e06d className={isReportsDropdownOpen ? `nav-item b-nav-dropdown dropdown show` : `nav-item b-nav-dropdown dropdown`} id="__BVID__15">
                            <li
                                role="button"
                                aria-haspopup="true"
                                aria-expanded={isReportsDropdownOpen}
                                href="#"
                                target="_self"
                                className={`nav-link dropdown-toggle ${isReportsDropdownOpen ? 'open' : ''
                                    }`}
                                id="__BVID__15__BV_toggle_"
                                onClick={toggleReportsDropdown}
                            >
                                <a>Reports</a>
                            </li>
                            <ul
                                tabIndex="-1"
                                className={`dropdown-menu dropdown-menu-right ${isReportsDropdownOpen ? 'show' : ''}`}
                                aria-labelledby="__BVID__15__BV_toggle_"
                            >
                                
                                <li><a style={{cursor:'pointer'}} data-v-35c5e06d onClick={() => navigateReports('/reports/ui-reports')} className="dropdown-item">UI Report</a></li>
                                <li><a style={{cursor:'pointer'}} data-v-35c5e06d onClick={() => navigateReports('/reports/device-reports')} className="dropdown-item">Device Report</a></li>
                                <li><a style={{cursor:'pointer'}} data-v-35c5e06d onClick={() => navigateReports('/reports/daily-reports')} className="dropdown-item">Daily Report</a></li>
                                <li><a style={{cursor:'pointer'}} data-v-35c5e06d onClick={() => navigateReports('/reports/monthly-reports')} className="dropdown-item">Monthly Report</a></li>
                                <li><a style={{cursor:'pointer'}} data-v-35c5e06d onClick={() => navigateReports('/reports/trends-reports')} className="dropdown-item">Trends Report</a></li>
                            </ul>
                        </ul>
                        <ul data-v-35c5e06d className="nav-item b-nav-dropdown dropdown" id="__BVID__22">
                            <li
                                role="button"
                                aria-haspopup="true"
                                aria-expanded={isWebscadaDropdownOpen}
                                href="#"
                                target="_self"
                                className={`nav-link dropdown-toggle ${isWebscadaDropdownOpen ? 'open' : ''
                                    }`}
                                id="__BVID__22__BV_toggle_"
                                onClick={toggleWebscadaDropdown}
                            >
                                <a data-v-35c5e06d>{getUser()}</a>
                            </li>
                            <ul
                                tabIndex="-1"
                                className={`dropdown-menu dropdown-menu-right ${isWebscadaDropdownOpen ? 'show' : ''
                                    }`}
                                aria-labelledby="__BVID__22__BV_toggle_"
                            >
                                <li data-v-35c5e06d className="logOut" role="presentation">
                                    <a role="menuitem" href="/" target="_self" onClick={() => handleLogout()} className="dropdown-item">Logout</a>
                                </li>
                            </ul>
                        </ul>
                    </ul>
                </div>
            </nav>

        </div>


    )
}

export default Navbar
