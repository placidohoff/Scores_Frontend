import React from "react";
import { useAuth } from "../../Context/auth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Utils/Constants";

export default function Header() {
  const { auth, logout } = useAuth(); // get logout from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();             // this clears auth + localStorage
    navigate("/login");   // redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand mx-3" href="/">
        Majority Decision
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          {
            !auth.user && <li className="nav-item mx-5">
              <a className="nav-link" href="/login">
                Login
              </a>
            </li>
          }
          {

            auth.user && (
              <>
                <li>
                  <a className="nav-link" href={ROUTES.VIEW_MY_SCORES}>
                    My Scorecards
                  </a>
                </li>
                <li className="nav-item mx-5">
                  <button onClick={handleLogout} className="nav-link">
                    Logout
                  </button>
                </li>
              </>)
          }


        </ul>
      </div>
    </nav>
  );
}
