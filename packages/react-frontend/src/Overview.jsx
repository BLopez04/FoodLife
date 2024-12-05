import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/_overview.scss";

function Overview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Today");

  const renderBudgetDetails = (type, budget, spent, total) => (
    <div className="budget-section">
      <h3>{type}</h3>
      <div className="values">
        <div className="value-box">
          <p>Budget</p>
          <span>${budget}</span>
        </div>
        <div className="value-box">
          <p>Spent</p>
          <span>${spent}</span>
        </div>
        <div className="value-box">
          <p>Total</p>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overview-container">
      
      <div className="greeting">
        Welcome back, <span className="user-name">Mr.Voo!</span>
      </div>

      {/* Budget Card with Tabs */}
      <div className="tabbed-budget-container">
        <div className="tabs">
          {["Today", "Week", "Month"].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="budget-card">
          <h2 className="card-title">Budget Overview</h2>
          <div className="budget-details">
            {renderBudgetDetails("Grocery", 600, 300, 300)}
            {renderBudgetDetails("Personal", 1000, 500, 500)}
            {renderBudgetDetails("Meal Plan", 400, 150, 250)}
          </div>
        </div>
      </div>
      
      <button className="table-button" onClick={() => navigate("/table")}> View Table → </button>
      
    </div>
  );
}

export default Overview;

