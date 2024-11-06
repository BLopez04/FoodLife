import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userService from "./services/user-service.js";
const { getUsers, addUser, findUserById, findUserByUsername, findTableByUserId, deleteUser } =
  userService;

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose.connect(MONGO_CONNECTION_STRING).catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FoodLife");
});

app.get("/users", (req, res) => {
  // Optional query search

  getUsers()
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd).then((result) => res.status(201).send(result));
});

app.get("/users/:id", (req, res) => {
  //Specific link
  const id = req.params["id"];
  findUserById(id)
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(404).send(`Not Found: ${id}`);
      }
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  deleteUser(id).then((result) => res.send());
});

app.get("/users/:id/table", (req, res) => {
  const id = req.params["id"];
  findTableByUserId(id)
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(404).send(`Not Found: ${id}`);
      }
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });
});

app.get("/users/:id/table/days", (req, res) => {
  const id = req.params["id"];

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
