import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table"
    }
  },
  { collection: "users_list" }
);

const User = mongoose.model("User", UserSchema);

const TableSchema = new mongoose.Schema(
  {
    personalBudget: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true,
    },
    mealplanBudget: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true,
    },
    groceryBudget: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true,
    },
    tableDays: [{
      type: Schema.Types.ObjectId,
      ref: "Days",
    }],
  },
  { collection: "tables_list" }
);

const Table = mongoose.model("Table", TableSchema);

const DaySchema = new mongoose.Schema(
  {
    date: {
      type: String,
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
  { collection: "day_list" }
);

const Day = mongoose.model("Day", DaySchema);

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Schema.Types.Decimal128,
      required: true,
      trim: true,
    },
  },
  { collection: "day_list" }
);

const Item = mongoose.model("Item", ItemSchema);

export default {
  User,
  Table,
  Day,
  Item
}

