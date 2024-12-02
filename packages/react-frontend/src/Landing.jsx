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


function Landing(){
    const navigate = useNavigate();
    return (
        <div>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.item1}>
                    <div className={classes.module}>
                        <h1 className={classes.item1Title}> Foodlife </h1>

                        <div className={classes.buttonGroup}>  
                            <button className={classes.loginButton} onClick={() => navigate("/login")}> Login </button>
                            <button className={classes.signButton} onClick={() => navigate("/signup")}> Sign Up </button>
                            <button className={classes.aboutButton} onClick={() => navigate("/about")}> About </button>    
                        </div>
                    </div> 
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
        </div>
    );
}

export default Landing

