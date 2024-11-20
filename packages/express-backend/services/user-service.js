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

function addDay(userId, day) {
  const dayToAdd = new dayModel(day); // Create a new Day instance with dayData

  return userModel.findById(userId)
    .then((user) => {
      user.table.tableDays.push(dayToAdd);
      return user.save();
    });
}

function addItemToDay(id, dayId, category, itemData) {
  const itemToAdd = new itemModel(itemData);

  return userModel.findById(id)
    .then(user => {
      const day = user.table.tableDays.id(dayId);
      day[category].push(itemToAdd);
      return user.save();
    });
}

function updateTotal(id, dayId, category, val) {
  return userModel.updateOne(
    { _id: id },
    { $set: { [`table.tableDays.$[day].${category}`]: val } },
    { arrayFilters: [ { "day._id": dayId } ] }
  );
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
  updateTotal,
  deleteUser,
  deleteItem
};
