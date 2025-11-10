import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Context/auth";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../Utils/Constants";
import jwtDecode from "jwt-decode";
import { IAuth } from "../../Interfaces/IAuth";

export default function Header() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [toggle, setToggle] = useState("collapse show");
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const dropdownRef = useRef<HTMLLIElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  // Detect clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropDownOpen]);

  useEffect(() => {
    if (auth.token) {
      const decoded: IAuth = jwtDecode(auth.token);
      if (decoded.role === "admin") setIsAdmin(true);
    }
  }, [auth.token]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand mx-3" to="/">
        Majority Decision
      </Link>
      <button
        onClick={handleToggle}
        className="navbar-toggler"
        type="button"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className={
          isToggleOpen
            ? "navbar-collapse collapse show"
            : "collapse navbar-collapse"
        }
        id="navbarNav"
      >
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

              {isAdmin && (
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <a
                    onClick={() => setIsDropdownOpen(!isDropDownOpen)}
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    aria-expanded={isDropDownOpen}
                  >
                    Admin Menu
                  </a>
                  <ul
                    className={
                      isDropDownOpen ? "dropdown-menu show" : "dropdown-menu"
                    }
                  >
                    <li>
                      <Link onClick={() => setIsDropdownOpen(false)} className="dropdown-item" to={ROUTES.CREATE_MATCH}>
                        Create Match
                      </Link>
                    </li>
                    <li>
                      <Link onClick={() => setIsDropdownOpen(false)} className="dropdown-item" to={ROUTES.CREATE_FIGHTER}>
                        Create Fighter
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              <li className="nav-item mx-5 d-flex align-items-center">
                <button
                  onClick={handleLogout}
                  className="nav-link btn btn-link p-0"
                >
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


/*
🔍 What Changed

Added a useRef (dropdownRef) to point to the dropdown container.

Added a useEffect that:

Listens for clicks on the whole document.

Checks if the click target is outside the dropdown.

Closes the dropdown if so.

Cleans up the event listener to avoid leaks.

*/