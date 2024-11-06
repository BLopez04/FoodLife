import mongoose from "mongoose";
import userModel from "../models/user.js";
import tableModel from "../models/table.js";
import tableService from "./table-service.js";
const { getTables, findTableById, deleteTable } = tableService

function getUsers() {
  let promise = userModel.find();

  return promise;
}

function addUser(user) {
  let userToAdd = new userModel(user);
  const tableForUser = new tableModel({
    personalBudget: 0.00,
    mealplanBudget: 0.00,
    groceryBudget: 0.00
  });

  return tableForUser.save()
    .then(newTable => {
      userToAdd.table = newTable._id;
      return userToAdd.save();
    });
}

function findUserById(id) {
  return userModel.findById(id);
}
function findUserByUsername(username) {
  return userModel.find({ username: username });
}

function deleteUser(id) {
  return findUserById(id).then(result => {
    const tableId = result.table;
    return deleteTable(tableId).then(() =>
      userModel.findByIdAndDelete(id));
  });
}

export default {
  getUsers,
  addUser,
  findUserById,
  findUserByUsername,
  deleteUser,
};
