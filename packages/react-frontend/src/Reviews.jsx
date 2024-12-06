// src/About.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Reviews() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="reviews-container">
        <h2>Reviews</h2>
        <div> 
          <h3>Food1</h3>
          <p>Food, Food, Food!!!</p>
        </div>

        <div>
            <h3>Food2</h3>
            <p>More Food</p>
        </div>

        <div>
            <h3>Food3</h3>
            <p>Productivity down the drain</p>
        </div>
      </div>
    </>
  );
}

export default Reviews;
