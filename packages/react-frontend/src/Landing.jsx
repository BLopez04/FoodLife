// src/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import classes from './Landing.module.css';


// Images TODO need some images
import food1 from './images/Foo.jpg';
import food2 from './images/FoodIconTwo.jpg';
import food3 from './images/FoodIconThree.jpg';
import food4 from './images/HealthyFoodIcon.png';


function Landing(){
    const navigate = useNavigate();
    return (
        <div className={classes.container}>
            <div className={classes.item1}>
                <div className={classes.module}>
                    <h1 className={classes.item1Title}> Foodlife </h1>
                    <p className={classes.item1Text}>
                        a fresh, easy-to-use app built to help adults and college students keep track 
                        of their dining plans and stick to their food budgets without the stress. 
                        Whether you're a college student juggling meal swipes or someone just trying 
                        to save a little extra cash each month, Foodlife makes it simple to stay on 
                        top of your food spending
                    </p> 

                    <div className={classes.buttonGroup}>  
                        <button className={classes.loginButton} onClick={() => navigate("/login")}> Login </button>
                        <button className={classes.signButton} onClick={() => navigate("/signup")}> Sign Up </button>  
                    </div>
                </div> 
            </div>

            <div className={classes.item2}>
                <div className={classes.circle}></div> 
            </div>

            <div className={classes.item3}>
                <div> 
                    <h3>Food1</h3>
                    <p>Food, Food, Food!!!</p>
                </div>

                <div>
                    <h3>Food2</h3>
                    <p>More Food</p>
                </div>v

                <div>
                    <h3>Food3</h3>
                    <p>Productivity down the drain</p>
                </div>
            </div>
        </div>
    );
}

export default Landing

