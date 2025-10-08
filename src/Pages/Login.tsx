import React, { useEffect, useState } from 'react'
import { useAuth } from '../Context/auth'
import { useNavigate, useLocation, Link } from "react-router-dom";
import { API_ROOTS, ENVIRONMENTS } from '../Utils/Constants';
import axios from 'axios';
import { Console } from 'console';
import { LoginSimulation } from '../Utils/LoginSimulation';

export default function Login() {
  const [auth, setAuth] = useAuth();
  // const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');


  const API_BASE_URL = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ROOTS.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
      ? API_ROOTS.PROD
      : API_ROOTS.WORK

  useEffect(() => {
    const fetchData = async () => {
      const testGetFighters = await axios.get("../Data/Fighters.json");
      console.log(process.env.REACT_APP_ENVIRONMENT)
      console.log(API_BASE_URL);
      // const testGetFighters = await axios.get(API_BASE_URL+"fighters");
      return testGetFighters;
    }

    const test = fetchData().then((res) => console.log(res.data));

    // console.log(test);



  }, [])

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try{
      const res = await LoginSimulation({userName, password})
      // setToken(res.token);
      // localStorage.setItem("token", res.token);
      alert("Login successful!");
    }catch(err: any){
      console.error(err)
    }
  }

  return (

    <div className="page-component">
      <div className="container">
        <div className="row">
          <h2 className="my-5 mx-auto justify-content-center">
            Login to your account
          </h2>
          <div className="col-md-6 offset-md-3">
            <form className='d-flex flex-column' onSubmit={handleSubmit} style={{ marginBottom: "100px" }}>
              {/* <label className="form-label">
                Email:
                <input
                  type="email"
                  className="form-control mb-4 p-2"
                  // placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label> */}

              <label style={{textAlign: 'left'}} className="form-label">
                Username:
                <input
                  type="text"
                  className="form-control mb-4 p-2"
                  // placeholder="Email"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </label>

              <label style={{textAlign: 'left'}} className="form-label">
                Password:
                <input
                  type="password"
                  className="form-control mb-4 p-2"
                  // placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <button
                className="btn btn-alpha d-flex justify-content-center mx-auto"
                type="submit"
              >
                Login
              </button>

              <Link
                className="btn btn-bravo d-flex justify-content-center mx-auto mt-3"
                to={"/register"}
              >
                Become a member
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
