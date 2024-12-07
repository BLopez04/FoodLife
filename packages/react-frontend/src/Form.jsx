import react, { useState } from "react";

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

export default Form;
