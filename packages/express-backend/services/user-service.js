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

function addDay(id, day) {
  let dayToAdd = new dayModel({
    date: day,
    personalTotal: 0.0,
    mealplanTotal: 0.0,
    groceryTotal: 0.0,
    personalItems: [],
    mealplanItems: [],
    groceryItems: []
  });
}

function getTableDays(id) {
  return userModel
    .findById(id)
    .then((user) => user.table)
    .then((table) => table.tableDays);
}

function deleteUser(id) {
  return userModel.findByIdAndDelete(id);
}

export default {
  getUsers,
  addUser,
  findUserById,
  findUserByUsername,
  findTableByUserId,
  getTableDays,
  deleteUser
};
