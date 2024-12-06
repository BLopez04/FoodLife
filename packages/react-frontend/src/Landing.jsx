// src/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import classes from './Landing.module.css';

import graphic from './images/Landing-Graphic.png';
import Navbar from "./Navbar";


function Landing() {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.landingContent}>
                    <h1 className={classes.bigText}>Welcome to the start of your new <span className={classes.bigFoodLife}>FoodLife</span></h1>
                    <p className={classes.descriptionText}>Stay within your personalized limits. Keep track of your personal, EBT, and/or meal plan budgets with the help of FoodLife.</p>
                    
                    <div className={classes.buttonSignLog}>
                        <button className={classes.loginButton} onClick={() => navigate("/login")}>Login</button>
                        <button className={classes.signButton} onClick={() => navigate("/signup")}>Sign Up</button>
                    </div>
                </div>

                <img src={graphic} className={classes.foodImage}></img>
                <hr />
            </div>

            <div id="features" className={classes.featuresSection}>
                <h2 className={classes.featuresTitle}>Features</h2>
                <div className={classes.featuresContainer}>
                    <div className={classes.featureItem}>
                        <h3>Budgeting</h3>
                        <p>Set and keep track of budgets in personal, meal plan, and grocery budgets.</p>
                    </div>
                    <div className={classes.featureItem}>
                        <h3>Meal Logging</h3>
                        <p>Easy-to-use table to log meals and their costs.</p>
                    </div>
                    <div className={classes.featureItem}>
                        <h3>Group Expenses</h3>
                        <p>Personal, EBT, and Grocery categories allow for clear grouping and division of budgeting and meal tracking.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing

