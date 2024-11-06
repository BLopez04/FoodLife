import mongoose, { Schema } from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { collection: "items_list" }
);

const Item = mongoose.model("Item", ItemSchema);
export default Item;