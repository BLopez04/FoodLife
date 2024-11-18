// src/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import classes from './Landing.module.css';


function Landing(){
    const navigate = useNavigate();
    return (
        <div className={classes.container}>
            <h1 className={classes.text}> Foodlife </h1>
            <p className={classes.text}>An innovative new app that tracks dining plans and monthly budgets for money-conscious adults and college students.</p>

            <div>
                <button className={classes.lbutton} onClick={() => navigate("/login")}>Login</button>
                <button className={classes.sbutton} onClick={() => navigate("/signup")}>Sign Up </button>
            </div>
        </div>

    );
}

export default Landing