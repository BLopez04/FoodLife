import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { terminal } from "virtual:terminal";
import { addAuthHeader } from "./Auth.js";
import "../scss/_table.scss";

function Form(props) {
  const [data, setData] = useState({
    date: "",
    price: "",
    item: "",
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
      item: data.item,
      type: data.type
    };
    props.handleSubmit(formattedData);
    setData({
      date: "",
      price: "",
      item: "",
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
      <label htmlFor="item">Item</label>
      <input
        type="text"
        name="item"
        id="item"
        value={data.item}
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
      .map((item) => `$${item.price.toFixed(2)} : ${item.item}`)
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
  }, []);

  useEffect(() => {
    getId()
      .then((res) => res.json())
      .then((json) => setId(json._id))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function removeOneRow(index) {
    const updated = rows.filter((row, i) => {
      return i !== index;
    });
    setRows(updated);
  }

  const updateList = (row) => {
    const index = rows.findIndex((v) => v.date === row.date);

    if (!row.date || !row.item || !row.price) {
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
              ? [{ item: row.item, price: row.price }]
              : [],
          m_items:
            row.type === "meal" ? [{ item: row.item, price: row.price }] : [],
          g_items:
            row.type === "grocery" ? [{ item: row.item, price: row.price }] : []
        }
      ]);

      // const postday = fetch("/users/:id/table/days")
    } else {
      if (row.type === "personal") {
        rows[index].p_total += parseFloat(row.price || 0);
        rows[index].p_items.push({ item: row.item, price: row.price });
      } else if (row.type === "meal") {
        rows[index].m_total += parseFloat(row.price || 0);
        rows[index].m_items.push({ item: row.item, price: row.price });
      } else if (row.type === "grocery") {
        rows[index].g_total += parseFloat(row.price || 0);
        rows[index].g_items.push({ item: row.item, price: row.price });
      }

      setRows([...rows]);
    }
  };


  function getName() {
    terminal.log("about to do the request")
    const promise = fetch("Http://localhost:8000/users", {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      })
    });
    terminal.log("did the request");
    return promise;

  }

  function getId() {
    terminal.log("about to do the request")
    const promise = fetch("Http://localhost:8000/users/id", {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      })
    });
    terminal.log("did the request");
    return promise;

  }

  return (
    <div className="page-container">
      <div className="header">
        <h1>Welcome, {username}, {_id}</h1>
      </div>
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
