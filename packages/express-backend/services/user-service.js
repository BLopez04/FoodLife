import mongoose from "mongoose";
import userModel from "../models/user.js";
import tableModel from "../models/table.js";
import dayModel from "../models/day.js";
import itemModel from "../models/item.js";
import jwt from "jsonwebtoken";

function getUsername(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  return new Promise((res, err) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return err("JWT error:", error);
      } else {
        console.log("in auth, username is", decoded.username);
        res(decoded.username);
      }
    });
  });
}

function getId(req) {
  return getUsername(req)
    .then((username) => {
      console.log("ok the name is", username);
      return userModel.findOne({ username: username });
    })
    .then((user) => user._id)
    .catch((error) => {
      console.log("Error in getId");
      throw error;
    });
}

function getUsers() {
  return userModel.find();
}

function addUser(user) {
  let userToAdd = new userModel(user);
  return userToAdd.save();
}

function findUserById(id) {
  return userModel.findById(id);
}
function findUserByUsername(username) {
  return userModel.find({ username: username });
}

function findTableByUserId(id) {
  return userModel.findById(id).then((user) => user.table);
}

function getTableDays(id) {
  return userModel
    .findById(id)
    .then((user) => user.table)
    .then((table) => table.tableDays);
}
function addDay(userId, day) {
  const dayToAdd = new dayModel(day); // Create a new Day instance with dayData
  /* Gets the user by their userId, and adds a day based off the name to table*/

  return userModel.findById(userId).then((user) => {
    user.table.tableDays.push(dayToAdd);
    return user.save();
  });
}

function getTableDayId(id, dayName) {
  /* With user's id and the name of the day to add, finds the user table, finds the day
  that matches the dayName provided (with a bit of reformatting to compare), and then
  returns the Id of the day that already exists in the table */
  return userModel
    .findById(id)
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      const table = user.table;
      const theDay = table.tableDays.find((day) => {
        const reformatDate = new Date(day.date).toISOString().split("T")[0];
        console.log(
          "reformatDate is",
          reformatDate,
          "checking against",
          dayName
        );
        return reformatDate === dayName;
      });
      return theDay ? theDay._id : null;
    })
    .catch((error) => {
      console.log("Error in getTableDayId");
      throw error;
    });
}

function addItemToDay(id, dayId, category, itemData) {
  const itemToAdd = new itemModel(itemData);
  /* With a userId and their tableId, as well as the category (personalItem, etc), adds
the itemData as an itemModel to the right day in the table, and the right category. */
  return userModel
    .findById(id)
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      const day = user.table.tableDays.id(dayId);
      if (!day) {
        throw new Error("Day not found");
      }
      day[category].push(itemToAdd);
      return user.save();
    })
    .catch((error) => {
      console.log("Error in addItemToDay");
      throw error;
    });
}

function updateTotal(id, dayId, totalCategory, val) {
  /* Increments the total price with the userId, dayId, and category,
  use negative val to decrement */
  return userModel
    .updateOne(
      { _id: id, "table.tableDays._id": dayId },
      { $inc: { [`table.tableDays.$.${totalCategory}`]: val } }
    )
    .catch((error) => {
      console.log("Error in getId");
      throw error;
    });
}

function updateBudget(id, budgetType, budget) {
  return userModel.updateOne(
  { _id: id }, {[`table.${budgetType}`]: budget })
  .catch((error) => {
    console.log(error)
    throw error;
  })
}


function deleteUser(id) {
  return userModel.findByIdAndDelete(id);
}

// function deleteItem(userId, dayId, category, itemId) {
//   return userModel.findById(id).then((user) => {
//     const day = user.table.tableDays.id(dayId);
//     const idx = day[category].findIndex(
//       (item) => itemId === item._id.toString()
//     );
//     if (idx === -1) {
//       throw new Error("Resource not found");
//     }

//     day[category].splice(idx, 1);
//     return user.save();
//   });
// }

function deleteItem(userId, dayName, category, itemId) {
  return getTableDayId(userId, dayName).then((dayId) => {
    if (!dayId) {
      throw new Error("Day not found");
    }

    return findUserById(userId).then((user) => {
      const idx = user.table.tableDays.findIndex((day) => {
        const formattedDate = new Date(day.date).toISOString().split("T")[0];
        return formattedDate === dayName;
      });

      if (idx === -1) {
        throw new Error("Day not found");
      }

      const items = user.table.tableDays[idx][`${category}Items`];
      const item = user.table.tableDays[idx][`${category}Items`][itemId];
      const price = item.price;

      user.table.tableDays[idx][`${category}Total`] -= price;
      items.splice(itemId, 1);

      return user.save();
    });
  });
}

function deleteDay(userId, dayName) {
  return getTableDayId(userId, dayName).then((dayId) => {
    if (!dayId) {
      throw new Error("Day not found");
    }

    return findUserById(userId).then((user) => {
      const idx = user.table.tableDays.findIndex((day) => {
        const formattedDate = new Date(day.date).toISOString().split("T")[0];
        return formattedDate === dayName;
      });

      if (idx === -1) {
        throw new Error("Day not found");
      }

      user.table.tableDays.splice(idx, 1);
      return user.save();
    });
  });
}

export default {
  getUsername,
  getId,
  getUsers,
  addUser,
  addDay,
  findUserById,
  findUserByUsername,
  findTableByUserId,
  getTableDays,
  getTableDayId,
  addItemToDay,
  updateTotal,
  updateBudget,
  deleteUser,
  deleteDay,
  deleteItem
};
