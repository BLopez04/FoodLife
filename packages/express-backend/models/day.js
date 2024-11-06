import mongoose, { Schema } from "mongoose";
import { ItemSchema } from "./item.js";

const DaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    trim: true
  },
  personalTotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  mealplanTotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  groceryTotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  personalItems: {
    type: [ItemSchema],
    default: []
  },
  mealplanItems: {
    type: [ItemSchema],
    default: []
  },
  groceryItems: {
    type: [ItemSchema],
    default: []
  }
});

const Day = mongoose.model("Day", DaySchema);
export default Day;
export { DaySchema };
