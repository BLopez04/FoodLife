import mongoose, { Schema } from "mongoose";

const DaySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    personalTotal: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true,
    },
    mealplanTotal: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true,
    },
    groceryTotal: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true,
    },
    personalItems: [{
      type: Schema.Types.ObjectId,
      ref: "Item",
    }],
    mealplanItems: [{
      type: Schema.Types.ObjectId,
      ref: "Item",
    }],
    groceryItems: [{
      type: Schema.Types.ObjectId,
      ref: "Item",
    }]
  },
  { collection: "days_list"}
);

const Day = mongoose.model("Day", DaySchema);
export default Day;