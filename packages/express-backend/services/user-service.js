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
    })
  })
}

function getId(req) {
  return getUsername(req)
    .then((username) => {
      console.log("ok the name is", username)
      return userModel.findOne({ username: username })
    })
    .then((user) => user._id)
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
  getUsername,
  getId,
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
