// src/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";


function Landing(){
    const navigate = useNavigate();
    return (
        <div className="landing-container">
            <h1 className="landing-title"> FoodLife</h1>
            <p className="landing-description">An innovative new app that tracks dining plans and monthly budgets for money-conscious adults and college students.</p>

            <div className="button-container">
                <button className="button login-button" onClick={() => navigate("/login")}>Login</button>
                <button className="button signup-button" onClick={() => navigate("/signup")}>Sign Up </button>
            </div>
        </div>

    );
}

export default Landing