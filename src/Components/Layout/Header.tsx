import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/auth";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../Utils/Constants";
import jwtDecode from "jwt-decode";
import { IAuth } from "../../Interfaces/IAuth";

export default function Header() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [toggle, setToggle] = useState('collapse show')
  const [isToggleOpen, setIsToggleOpen] = useState(false)
  const [isDropDownOpen, setIsDropdownOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen)
  }

  useEffect(() => {
    if (auth.token) {
      const decoded: IAuth = jwtDecode(auth.token)
      console.log(decoded)
      if (decoded.role == "admin") setIsAdmin(true)
    }

  }, [])

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand mx-3" to="/">
        Majority Decision
      </Link>
      <button
        onClick={() => handleToggle()}
        className="navbar-toggler"
        type="button"
        // data-bs-toggle="collapse"
        // data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* <div className="collapse navbar-collapse" id="navbarNav"> */}
      <div className={isToggleOpen ? "navbar-collapse collapse show" : "collapse navbar-collapse"} id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>


          {!auth.user && (
            <li className="nav-item mx-5">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          )}



          {auth.user && (
            <>
              <li>
                <Link className="nav-link" to={ROUTES.VIEW_MY_SCORES}>
                  My Scorecards
                </Link>
              </li>
              {
                isAdmin && (
                  <li className="nav-item dropdown">
                    <a onClick={() => setIsDropdownOpen(!isDropDownOpen)} className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Admin Menu
                    </a>
                    <ul className={isDropDownOpen ? "dropdown-menu show" : "dropdown-menu"}>
                      <li><a className="dropdown-item" href="#">Create Match</a></li>
                      <li><a className="dropdown-item" href="#">Create Fighter</a></li>
                      {/* <li><hr className="dropdown-divider"></li> */}
                    </ul>
                  </li>
                )
              }
              <li className="nav-item mx-5 d-flex align-items-center">
                <button onClick={handleLogout} className="nav-link btn btn-link p-0">
                  Logout
                </button>
              </li>
            </>
          )}


        </ul>
      </div>
    </nav>
  );
}
