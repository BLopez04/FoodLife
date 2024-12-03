import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAuthHeader, setToken } from "./Auth.js";
import { terminal } from 'virtual:terminal'
import "../scss/_table.scss";

const API_PREFIX = import.meta.env.VITE_API_PREFIX;

function Form(props) {
  const [data, setData] = useState({
    date: "",
    price: "",
    name: "",
    type: "personal"
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function submitForm() {
    const formattedData = {
      date: data.date,
      price: parseFloat(data.price || 0),
      name: data.name,
      type: data.type
    };
    props.handleSubmit(formattedData);
    setData({
      date: "",
      price: "",
      name: "",
      type: "personal"
    });
  }

  return (
    <form>
      <label htmlFor="date">Date</label>
      <input
        type="date"
        name="date"
        id="date"
        value={data.date}
        onChange={handleChange}
      />
      <label htmlFor="name">Item</label>
      <input
        type="text"
        name="name"
        id="name"
        value={data.name}
        onChange={handleChange}
      />
      <div className="form-row">
        <div className="price-column">
          <label htmlFor="price">Price</label>
          <div className="dollar-input">
            <span className="dollar-sign">$</span>
            <input
              type="number"
              name="price"
              id="price"
              value={data.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="type-column">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={data.type}
            onChange={handleChange}>
            <option value="personal">Personal</option>
            <option value="meal">Meal Plan</option>
            <option value="grocery">Grocery</option>
          </select>
        </div>
      </div>
      <input type="button" value="Submit" onClick={submitForm} />
    </form>
  );
}

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Date</th>
        <th>Personal Total</th>
        <th>Meal Plan Total</th>
        <th>Grocery Total</th>
        <th>Personal Items</th>
        <th>Meal Plan Items</th>
        <th>Grocery Items</th>
        {/* empty header to fill border bottom */}
        <th></th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const formatItems = (items) => {
    return items
      .map((item) => `$${item.price.toFixed(2)} : ${item.name}`)
      .join("\n");
  };

  const rows = props.rowData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.date}</td>
        <td>${row.p_total.toFixed(2)}</td>
        <td>${row.m_total.toFixed(2)}</td>
        <td>${row.g_total.toFixed(2)}</td>
        <td>{formatItems(row.p_items)}</td>
        <td>{formatItems(row.m_items)}</td>
        <td>{formatItems(row.g_items)}</td>
        <td>
          <button onClick={() => props.removeRow(index)}>Delete</button>
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function Table() {
  const [rows, setRows] = useState([]);
  const [username, setUsername] = useState("");
  const [_id, setId] = useState("");

  useEffect(() => {
    getName()
      .then((res) => res.json())
      .then((json) => setUsername(json.username))
      .catch((error) => {
        console.log(error);
      });

    getId()
      .then((res) => res.json())
      .then((json) => setId(json._id))
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
      .then((table_data) => {
        const formattedRows = table_data.tableDays.map((day) => ({
          date: new Date(day.date).toISOString().split("T")[0],
          p_total: day.personalTotal || 0,
          m_total: day.mealplanTotal || 0,
          g_total: day.groceryTotal || 0,
          p_items: day.personalItems || [],
          m_items: day.mealplanItems || [],
          g_items: day.groceryItems || [],
        }));
        setRows(formattedRows);
      })
      .catch((error) => console.log(error));

  }, []);
  

  function removeOneRow(index) {
    const updated = rows.filter((row, i) => {
      return i !== index;
    });
    setRows(updated);
  }

  const navigate = useNavigate();

  function logOut() {
      setToken("INVALID_TOKEN");
      setUsername("");
      setId("");
      navigate("/login");
  }

  const updateList = (row) => {
    const index = rows.findIndex((v) => v.date === row.date);

    if (!row.date || !row.name || !row.price) {
      alert("Please enter a valid Date, Item and Price.");
      return;
    }

    if (index === -1) {
      setRows([
        ...rows,
        {
          date: row.date,
          p_total: row.type === "personal" ? parseFloat(row.price || 0) : 0,
          m_total: row.type === "meal" ? parseFloat(row.price || 0) : 0,
          g_total: row.type === "grocery" ? parseFloat(row.price || 0) : 0,
          p_items:
            row.type === "personal"
              ? [{ name: row.name, price: row.price }]
              : [],
          m_items:
            row.type === "meal" ? [{ name: row.name, price: row.price }] : [],
          g_items:
            row.type === "grocery" ? [{ name: row.name, price: row.price }] : []
        }
      ]);

      terminal.log(row.date);

      addDay({ date: row.date }).then((res) => res.json())
        .then(() =>
          addItem(row.date, row.type,{ name: row.name, price: row.price }))
        .then((res) => res.json())
        .catch((error) => {
          console.log(error);
        });

      terminal.log("Added a day")
      terminal.log("Added an item")

    } else {
      if (row.type === "personal") {
        rows[index].p_total += parseFloat(row.price || 0);
        rows[index].p_items.push({ name: row.name, price: row.price });
      } else if (row.type === "meal") {
        rows[index].m_total += parseFloat(row.price || 0);
        rows[index].m_items.push({ name: row.name, price: row.price });
      } else if (row.type === "grocery") {
        rows[index].g_total += parseFloat(row.price || 0);
        rows[index].g_items.push({ name: row.name, price: row.price });
      }

      setRows([...rows]);
      terminal.log(row.date, row.type, row.name, row.price);

      addItem(row.date, row.type,{ name: row.name, price: row.price }).then((res) => res.json())
        .catch((error) => {
          console.log(error);
        });
      terminal.log("Added an item")

    }



  };


  function getName() {
    const promise = fetch(`${API_PREFIX}/users/`, {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      })
    });

    return promise;
  }

  function getId() {
    const promise = fetch(`${API_PREFIX}/users/id/`, {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      })
    });

    return promise;
  }

  function addDay(body) {
    const promise = fetch(`${API_PREFIX}/users/table/days/`, {
      method: "POST",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    return promise
  }

  function addItem(dayName, category, body) {
    const promise = fetch(`${API_PREFIX}/users/table/days/${dayName}/${category}/`, {
      method: "POST",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    return promise
  }

  function fetchTableData() {
    const promise = fetch(`${API_PREFIX}/users/table/`, {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
    });
      
    return promise;
  }

  return (
    <div className="page-container">
      <div className="header">
        <h1>Welcome, {username}, {_id}</h1>
      </div>
      <input type="button" value="LogOut" onClick={logOut} />
      <div className="form">
        <h2>Add Item</h2>
        <Form handleSubmit={updateList} />
      </div>
      <div className="table">
        <table>
          <TableHeader />
          <TableBody rowData={rows} removeRow={removeOneRow} />
        </table>
      </div>
    </div>
  );
}

export default Table;
