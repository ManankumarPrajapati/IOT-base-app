import React, { useState } from 'react';
import "./Login.css";
import apiServices from '../services/apiServices';
import Logo from "../images/image (1).png";
import Image from "../images/Process.gif";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = ({ setIsAuthenticated }) => {
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isuserInvalid, setIsUserInvalid] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
  const notify = () => toast.error('Invalid Username or Password!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

  const success = () => toast.success('Login Successfully !', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username !== "" && password !== "") {
      const apiBody = { email: username, pass: password };
      let result = await apiServices.callLoginUsersData(apiBody);
      if (result?.message == "Login Successfully!") {
        setLoggedIn(true);
        success()
        sessionStorage.setItem('access_key', `${result?.result?.access_key}`);
        sessionStorage.setItem('user', `${JSON.stringify(result?.result)}`);
        setTimeout(() => {
          setIsAuthenticated(true);
          navigate('/dashboard')  
        }, 1000);
        

      } else if (result?.message == "Incrorrect Email or Password!") {
        setLoggedIn(true);
        setIsUserInvalid(true);
        notify();
      }
    }
    else {
      setIsUserInvalid(true);
    }
    setTimeout(() => {
      setLoggedIn(false);
    }, 1000);
  };

  const handleUsernameFocus = () => {
    setUsernameFocused(true);
  }

  const handleUsernameBlur = (event) => {
    if (event.target.value == "") {
      setUsernameFocused(false);
    }
  }

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  }

  const handlePasswordBlur = (event) => {
    if (event.target.value == "") {
      setPasswordFocused(false);
    }
  }


  return (
    <div className="login-container">
      <div className="Login-page">
        <img className="wave" src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/wave.png" alt="wave" />
        <img className="wavetop" src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/wave.png" alt="wave" />
        <div className="containers">
          <div className="img">
            <img src={Image} alt="background" className="images" />
          </div>
          <div className="login-content">
            <form onSubmit={handleLogin}>
              <img src={Logo} alt="LOGO" className="logo" style={{marginBottom:'4rem',height:'150px'}} />

              {/* <h2 className="title">Login</h2> */}
              <div className={`input-div one ${usernameFocused ? 'focus' : ''}`}>
                <div className="i">
                  <i className="fas fa-user"></i>
                </div>
                <div className="div">
                  <h5>Username</h5>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className="input"
                    onFocus={handleUsernameFocus}
                    onBlur={handleUsernameBlur}
                  />
                </div>
              </div>
              <div className={`input-div pass ${passwordFocused ? 'focus' : ''}`}>
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="div">
                  <h5>Password</h5>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="input"
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                  />
                </div>
              </div>
              {setIsUserInvalid &&
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              }
              <input disabled={loggedIn} type="submit" className="btn-1" value="Login" onClick={() => setForgotPasswordClicked(true)} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


