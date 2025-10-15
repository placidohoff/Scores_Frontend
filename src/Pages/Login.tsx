import React, { useEffect, useState } from 'react'
import { useAuth } from '../Context/auth'
import { useNavigate, useLocation, Link } from "react-router-dom";
import { API_ROOTS, ENVIRONMENTS } from '../Utils/Constants';
import axios from 'axios';
import { Console } from 'console';
import { LoginSimulation } from '../Utils/LoginSimulation';
import { LoginLogic } from '../Utils/LoginLogic';
import { ViewListUserScorecards } from '../Components';

export default function Login() {
  const { auth, setAuth } = useAuth();
  // const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false)


  const API_BASE_URL = process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.DEV
    ? API_ROOTS.DEV
    : process.env.REACT_APP_ENVIRONMENT === ENVIRONMENTS.PROD
      ? API_ROOTS.PROD
      : API_ROOTS.WORK

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    auth.user ? setIsLoggedIn(true) : setIsLoggedIn(false)
    // alert(process.env.REACT_APP_ENVIRONMENT)
    if (process.env.REACT_APP_ENVIRONMENT === "work_domain")
      setAuth({ ...auth, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6InBtaG9mZiIsImlkIjoiZGFkMDUxMDItYjFjOC00ODhlLWEyNmEtNGRiZTI1MzZlMTY3IiwiZW1haWwiOiJwbWhvZmZAdGVzdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3NTk5NzgxMjIsImV4cCI6MTc2MDU4MjkyMiwiaWF0IjoxNzU5OTc4MTIyfQ.eivh_tQ5KD5TgWS9sgjSiNmeCZl3Xs8UECJTbrk2YYA", user: "pmhoff", id: "dad05102-b1c8-488e-a26a-4dbe2536e167" })
  }, [])

  useEffect(() => {
    auth.user ? setIsLoggedIn(true) : setIsLoggedIn(false)
    setUserName('');
    setDisplayName('');
    setPassword('')
  }, [auth])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // const testGetFighters = await axios.get("../Data/Fighters.json");
  //     console.log(process.env.REACT_APP_ENVIRONMENT)
  //     console.log(API_BASE_URL);
  //     const testGetFighters = await axios.get(API_BASE_URL + "fighter");
  //     return testGetFighters;
  //   }

  //   console.log(API_BASE_URL);

  //   const test = fetchData().then((res) => console.log(res.data.result));

  //   console.log(test);



  // }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // const res = await LoginSimulation({ displayName, password })
      const res = await LoginLogic({ displayName, password })
      // setToken(res.token);
      // localStorage.setItem("token", res.token);
      localStorage.setItem("auth", JSON.stringify(res));
      setAuth({ ...auth, token: res.token, user: res.displayName, id: res.id });
      setIsLoggedIn(true)

      console.log(res, "RESPONSE");

      // navigate(
      //     location.state ||
      //       `/dashboard/${data?.user?.role === 1 ? "admin" : "user/profile"}`
      //   );

    } catch (err: any) {
      console.error(err)
    }
  }

  const Welcome = () => {
    console.log(auth.user)
    return (
      <>
        <h1>Welcome {auth.user}</h1>

        <ViewListUserScorecards />
      </>
    )
  }

  return (

    <div className="page-component">
      <div className="container">
        <div className="row">
          {
            !isLoggedIn &&
            <>
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

                  <label style={{ textAlign: 'left' }} className="form-label">
                    Username:
                    <input
                      type="text"
                      className="form-control mb-4 p-2"
                      // placeholder="Email"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </label>

                  <label style={{ textAlign: 'left' }} className="form-label">
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
            </>
          }
          {
            isLoggedIn && <Welcome />

          }

        </div>
      </div>
    </div>
  )
}
