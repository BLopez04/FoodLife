import mongoose from "mongoose";
import userModel from "../models/user.js";
import tableModel from "../models/table.js";

function getTables() {
  let promise = tableModel.find();

  return promise;
}

function findTableById(id) {
  return tableModel.findById(id);
}

function deleteTable(id) {
  return tableModel.findByIdAndDelete(id);
}

export default {
  getTables,
  findTableById,
  deleteTable
};
