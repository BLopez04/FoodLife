// src/About.jsx
import { useNavigate } from "react-router-dom";
import trackImg from "./images/Track.jpg"
import mealImg from "./images/MealKebab.jpg"

function About() {
  const navigate = useNavigate();

  return (
    <>
      <div className="about-container">
        <h2>About FoodLife</h2>
        <p>
          Foodlife is a fresh, easy-to-use app built to help adults and college students keep track 
          of their dining plans and stick to their food budgets without the stress. 
          Whether you&#39;re a college student juggling meal swipes or someone just trying 
          to save a little extra cash each month, Foodlife makes it simple to stay on 
          top of your food spending.
        </p>

        <button className="back-button" onClick={() => navigate("/")}> ← Back </button>
      </div>
      
      <div className="img-container">

        <div className="image-wrapper">
          <img src={mealImg} alt="Food" width="300" height="400"/>
          <div className="credit-container">
            Photo by <a href="/photographer/tellgraf-48994">tellgraf</a> on <a href="/">Freeimages.com</a>
          </div>
        </div>

        <div className="image-wrapper">
          <img src={trackImg} alt="Runner on a track" width="300" height="400"/>
          <div className="credit-container">
            Photo by <a href="/photographer/mzacha-39017">mzacha</a> on <a href="/">Freeimages.com</a>
          </div>
        </div>
      </div>
    </>
  );
}


export default About;
