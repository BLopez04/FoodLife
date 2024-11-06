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
export default User;


