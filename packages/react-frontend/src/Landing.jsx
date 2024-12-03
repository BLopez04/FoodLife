// src/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import classes from './Landing.module.css';


// Images TODO need some images
import food1 from './images/Foo.jpg';
import food2 from './images/FoodIconTwo.jpg';
import food3 from './images/FoodIconThree.jpg';
import food4 from './images/HealthyFoodIcon.png';
import Navbar from "./Navbar";


function Landing() {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.landingContent}>
                    <h1 className={classes.bigText}>Welcome to the start of your new <span className={classes.bigFoodLife}>FoodLife</span>.</h1>
                    <p className={classes.descriptionText}>Stay within your personalized limits. Keep track of your personal, EBT, and/or meal plan budgets with the help of FoodLife.</p>
                    <div className={classes.buttonSignLog}>
                        <button className={classes.loginButton} onClick={() => navigate("/login")}>Login</button>
                        <button className={classes.signButton} onClick={() => navigate("/signup")}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing

