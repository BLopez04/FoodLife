import mongoose, { Schema } from "mongoose";
import { DaySchema } from "./day.js";

const TableSchema = new mongoose.Schema({
  personalBudget: {
    type: Number,
    required: true,
    trim: true
  },
  mealplanBudget: {
    type: Number,
    required: true,
    trim: true
  },
  groceryBudget: {
    type: Number,
    required: true,
    trim: true
  },
  tableDays: {
    type: [DaySchema],
    default: []
  }
});

const Table = mongoose.model("Table", TableSchema);
export default Table;
export { TableSchema };
