import mongoose from "mongoose";
import userModel from "../models/user.js";
import tableModel from "../models/table.js";
import dayModel from "../models/day.js";
import itemModel from "../models/item.js";

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

/* function addDay(id, day) {
  let dayToAdd = new dayModel({
    date: day,
    personalTotal: 0.0,
    mealplanTotal: 0.0,
    groceryTotal: 0.0,
    personalItems: [],
    mealplanItems: [],
    groceryItems: []
  });
} */

function addDay(userId, day) {
  const dayToAdd = new dayModel(day); // Create a new Day instance with dayData

  return userModel.findById(userId)
    .then((user) => {
      user.table.tableDays.push(dayToAdd);
      return user.save();
    });
}

function addItemToDay(id, dayId, category, itemData) {
  const categories = ["personalItems", "mealplanItems", "groceryItems"];
  if (!categories.includes(category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  const itemToAdd = new itemModel(itemData);

  return userModel.findById(id)
    .then(user => {
      const day = user.table.tableDays.id(dayId);
      day[category].push(itemToAdd);
      return user.save();
    });
}

function deleteUser(id) {
  return userModel.findByIdAndDelete(id);
}

function deleteItem(id, dayId, category, itemId) {
  return userModel.findById(id)
    .then((user) => {
      const day = user.table.tableDays.id(dayId);
      const idx = day[category].findIndex((item) => itemId === item._id.toString());
      if (idx === -1) {
        throw new Error("Resource not found")
      }

      day[category].splice(idx, 1);
      return user.save();
    })
}

export default {
  getUsers,
  addUser,
  addDay,
  findUserById,
  findUserByUsername,
  findTableByUserId,
  getTableDays,
  addItemToDay,
  deleteUser,
  deleteItem
};
