import mongoose, { Schema } from "mongoose";

const TableSchema = new mongoose.Schema(
  {
    personalBudget: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true
    },
    mealplanBudget: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true
    },
    groceryBudget: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true
    },
    tableDays: [
      {
        type: Schema.Types.ObjectId,
        ref: "Days"
      }
    ]
  },
  { collection: "tables_list" }
);

const Table = mongoose.model("Table", TableSchema);
export default Table;
