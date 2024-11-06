import mongoose, { Schema } from "mongoose";
import { TableSchema } from "./table.js";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    table: {
      type: TableSchema,
      default: {
        personalBudget: 0.0,
        mealplanBudget: 0.0,
        groceryBudget: 0.0,
        tableDays: []
      }
    }
  },
  { collection: "users_list" }
);

const User = mongoose.model("User", UserSchema);
export default User;
export { UserSchema };
