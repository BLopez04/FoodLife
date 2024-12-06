// src/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
// import "../scss/_navbar.scss";

import classes from './Navbar.module.css';

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className={classes.navbar}>
            <div className={classes.logo} onClick={() => navigate("/")}>FoodLife</div>
            <div className={classes.navLinks}>
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? classes.activeNavButton : classes.navButton}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/about"
                    className={({ isActive }) => isActive ? classes.activeNavButton : classes.navButton}
                >
                    About
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;
