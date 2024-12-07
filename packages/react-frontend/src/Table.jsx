import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAuthHeader, setToken } from "./Auth.js";
import Form from "./Form";

import "../scss/_table.scss";

// https://foodlife.azurewebsites.net
const API_PREFIX = "https://foodlife.azurewebsites.net";

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
  const rows = props.rowData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.date}</td>
        <td>${row.p_total.toFixed(2)}</td>
        <td>${row.m_total.toFixed(2)}</td>
        <td>${row.g_total.toFixed(2)}</td>
        <td>
          <button
            onClick={() =>
              props.openModal({
                day: row.date,
                category: "personal",
                items: row.p_items
              })
            }
            className="open-modal">
            Items
          </button>
        </td>
        <td>
          <button
            onClick={() =>
              props.openModal({
                day: row.date,
                category: "mealplan",
                items: row.m_items
              })
            }
            className="open-modal">
            Items
          </button>
        </td>
        <td>
          <button
            onClick={() =>
              props.openModal({
                day: row.date,
                category: "grocery",
                items: row.g_items
              })
            }
            className="open-modal">
            Items
          </button>
        </td>
        <td>
          <button onClick={() => props.removeRow(index)} className="delete">
            Delete
          </button>
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function Modal({ isOpen, onClose, data, onItemDelete }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data.items) {
      setRows(data.items);
    }
  }, [data.items]);

  if (!isOpen) return null;

  const deleteItem = (day, category, id) =>
    fetch(`${API_PREFIX}/users/table/days/${day}/${category}/${id}`, {
      method: "DELETE",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      })
    });

  const removeOneItem = (index) => {
    deleteItem(data.day, data.category, index)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status}`);
        }
        const item = rows[index];
        const updated = rows.filter((row, i) => {
          return i !== index;
        });
        setRows(updated);
        onItemDelete(data.day, data.category, item.price);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">
          ✕
        </button>
        <div className="modal-inner">
          <h2 className="modal-title">Items</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <button
                      // onClick={() =>
                      //   console.log(index, data.day, data.category)
                      // }
                      onClick={() => removeOneItem(index)}
                      className="delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Table() {
  const [rows, setRows] = useState([]);
  const [username, setUsername] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setmodalData] = useState([]);

  const openModal = (items) => {
    setmodalData(items);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setmodalData([]);
  };

  useEffect(() => {
    getName()
      .then((res) => res.json())
      .then((json) => setUsername(json.username))
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
          g_items: day.groceryItems || []
        }));
        setRows(formattedRows);
      })
      .catch((error) => console.log(error));
  }, []);

  function removeOneRow(index) {
    const dayToDelete = rows[index].date;

    deleteDay(dayToDelete)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status}`);
        }

        const updated = rows.filter((row, i) => {
          return i !== index;
        });
        setRows(updated);
      })
      .catch((error) => console.log(error));
  }

  const navigate = useNavigate();

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

      addDay({ date: row.date })
        .then((res) => res.json())
        .then(() =>
          addItem(row.date, row.type, { name: row.name, price: row.price })
        )
        .then((res) => res.json())
        .catch((error) => {
          console.log(error);
        });
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

      addItem(row.date, row.type, { name: row.name, price: row.price })
        .then((res) => res.json())
        .catch((error) => {
          console.log(error);
        });
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

    return promise;
  }

  function deleteDay(dayName) {
    return fetch(`${API_PREFIX}/users/table/days/${dayName}`, {
      method: "DELETE",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      })
    });
  }

  function addItem(dayName, category, body) {
    console.log(`${API_PREFIX}/users/table/days/${dayName}/${category}/`);
    const promise = fetch(
      `${API_PREFIX}/users/table/days/${dayName}/${category}/`,
      {
        method: "POST",
        headers: addAuthHeader({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(body)
      }
    );

    return promise;
  }

  function fetchTableData() {
    const promise = fetch(`${API_PREFIX}/users/table/`, {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      })
    });

    return promise;
  }

  const handleItemDelete = (day, category, price) => {
    setRows((prevRows) => {
      return prevRows.map((row) => {
        if (row.date === day) {
          const updatedRow = { ...row };
          if (category === "personal") {
            updatedRow.p_total = parseFloat(
              (updatedRow.p_total - price).toFixed(2)
            );
            updatedRow.p_items = updatedRow.p_items.filter(
              (item) => item._id !== rows.index
            );
          } else if (category === "mealplan") {
            updatedRow.m_total = parseFloat(
              (updatedRow.m_total - price).toFixed(2)
            );
            updatedRow.m_items = updatedRow.m_items.filter(
              (item) => item._id !== rows.index
            );
          } else if (category === "grocery") {
            updatedRow.g_total = parseFloat(
              (updatedRow.g_total - price).toFixed(2)
            );
            updatedRow.g_items = updatedRow.g_items.filter(
              (item) => item._id !== rows.index
            );
          }
          return updatedRow;
        }
        return row;
      });
    });
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1>{username}&#39;s Table</h1>
      </div>

      <div className="form">
        <h2>Add Item</h2>
        <Form handleSubmit={updateList} />
      </div>

      <div className="table">
        <table>
          <TableHeader />
          <TableBody
            rowData={rows}
            removeRow={removeOneRow}
            openModal={openModal}
          />
        </table>
      </div>

      <button className="overview-button" onClick={() => navigate("/overview")}>
        {" "}
        ← Back To Overview{" "}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={modalData}
        onItemDelete={handleItemDelete}
      />
    </div>
  );
}

export default Table;
