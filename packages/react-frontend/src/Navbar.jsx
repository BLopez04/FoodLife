// src/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import classes from './Navbar.module.css';

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className={classes.navbar}>
            <div className={classes.logo} onClick={() => navigate("/")}>FoodLife</div>
            <div className={classes.navLinks}>
                <button className={classes.navButton} onClick={() => navigate("/")}>Home</button>
                <button className={classes.navButton} onClick={() => navigate("/about")}>About</button>
                <button className={classes.navButton} onClick={() => navigate("/reviews")}>Reviews</button>
            </div>
        </nav>
    );
}

export default Navbar;
