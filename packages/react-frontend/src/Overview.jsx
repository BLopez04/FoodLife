import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addAuthHeader } from "./Auth"
import "../scss/_overview.scss";

const API_PREFIX = "http://localhost:8000";


function Overview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Today");
  const [username, setUsername] = useState("");
  const [budget, setBudget] = useState({ personal: 0, grocery: 0, mealPlan: 0 });
  const [rows, setRows] = useState([]);

  function fetchUsername() {
    const promise = fetch(`${API_PREFIX}/users`, {
      headers: addAuthHeader()
    });
    return promise;
  }

  function fetchTableData() {
    const promise = fetch(`${API_PREFIX}/users/table/`, {
      headers: addAuthHeader()
    });
    return promise;
  }

  useEffect(() => {
    fetchUsername()
      .then((res) => res.json())
      .then((json) => {
	setUsername(json["username"])
      })
      .catch((error) => {
	console.log(error);
      });

    fetchTableData()
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
	setBudget({
	  personal: json.personalBudget, 
	  grocery: json.groceryBudget,
	  mealPlan: json.mealplanBudget
        })
          const formattedRows = json.tableDays.map((day) => ({
          date: new Date(day.date).toISOString().split("T")[0],
          p_total: day.personalTotal || 0,
          m_total: day.mealplanTotal || 0,
          g_total: day.groceryTotal || 0,
          p_items: day.personalItems || [],
          m_items: day.mealplanItems || [],
          g_items: day.groceryItems || [],
        }));
	  console.log(formattedRows);
	  setRows(formattedRows);
      })
      .catch((error) => {
	console.log(error);
      });
  }, []);

  const renderBudgetDetails = (type, budget) => {
    var spent = 0;
    const now = new Date();
    const monthDays = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    now.setTime(now.getTime() - (now.getTimezoneOffset() * 60000));
    
    const chooseTime = ((activeTab, rows) => {
      const todayObj = new Date();
      const todayDate = todayObj.getDate();
      const todayDay = todayObj.getDay();

      // get first date of week
      const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay - 1));

      // get last date of week
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 7);

      firstDayOfWeek.setHours(0, 0, 0, 0)
      lastDayOfWeek.setHours(0, 0, 0, 0)

      switch(activeTab) {
	case "Today": return rows.filter((row) => {return row.date === now.toISOString().split("T")[0]})
	case "Month": return rows.filter((row) => { 
	  return row.date.substring(6, 8) === now.toISOString().split("T")[0].substring(6, 8)})
	  case "Week": return rows.filter((row) => { const date = new Date(row.date);
	  return date > firstDayOfWeek && date < lastDayOfWeek 
	})
      }
    })

    const chooseTab = ((activeTab, budget) => {
      switch(activeTab) {
      	case "Today": return budget / monthDays
	case "Month": return budget
	case "Week": return budget / 7
      }})

    const chooseType = ((currRows, type) => {
      switch(type) {
	case "Personal": return currRows.reduce((acc, curr) => acc + curr.p_total, 0)
	case "Grocery": return currRows.reduce((acc, curr) => acc + curr.g_total, 0)
	case "Meal Plan": return currRows.reduce((acc, curr) => acc + curr.m_total, 0)
      }
    })
    
    const currRows = chooseTime(activeTab, rows)

    spent = chooseType(currRows, type)

    budget = chooseTab(activeTab, budget)
    
    return (
      <div className="budget-section">
	<h3>{type}</h3>
	<div className="values">
	  <div className="value-box">
	    <p>Budget</p>
	    <span>${(budget).toFixed(2)}</span>
	  </div>
	  <div className="value-box">
	    <p>Spent</p>
	    <span>${(spent).toFixed(2)}</span>
	  </div>
	  <div className="value-box">
	    <p>Remaining</p>
	    <span>${(budget - spent).toFixed(2)}</span>
	  </div>
	</div>
      </div>
    );
  }


  return (
    <div className="overview-container">
      
      <div className="greeting">
        Welcome back, <span className="user-name">{username}</span>
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
            {renderBudgetDetails("Grocery", budget.grocery)}
            {renderBudgetDetails("Personal", budget.personal)}
            {renderBudgetDetails("Meal Plan", budget.mealPlan)}
          </div>
        </div>
      </div>
      
      <button className="table-button" onClick={() => navigate("/table")}> View Table → </button>
      
    </div>
  );
}

export default Overview;

