import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userService from "./services/user-service.js";
import { registerUser, authenticateUser, loginUser } from "./auth.js";

const {
  getUsers,
  addUser,
  addDay,
  addItemToDay,
  findUserById,
  getTableDays,
  findTableByUserId,
  updateTotal,
  deleteUser,
  deleteItem
} = userService;

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
  getTableDays(id)
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

app.get("/users/:id/table/days/:dayId/items", (req, res) => {
  const { id, dayId } = req.params;
  findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send(`Not Found: ${id}`);
      }

      const day = user.table.tableDays.id(dayId);
      if (!day) {
        res.status(404).send(`Not Found: ${dayId}`);
      }

      const items = {
        personalItems: day.personalItems,
        mealplanItems: day.mealplanItems,
        groceryItems: day.groceryItems
      };

      res.send(items);
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });
});

app.get("/users/:id/table/days/:dayId", (req, res) => {
  const { id, dayId } = req.params;
  findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send(`Not Found: ${id}`);
      }

      const day = user.table.tableDays.id(dayId);
      if (!day) {
        res.status(404).send(`Not Found: ${dayId}`);
      }

      res.send(day);
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });
});

app.get("/users/:id/table/days/:dayId/:category", (req, res) => {
  const { id, dayId, category } = req.params;
  findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send(`Not Found: ${id}`);
      }

      const day = user.table.tableDays.id(dayId);
      if (!day) {
        res.status(404).send(`Not Found: ${dayId}`);
      }

      res.send(day[category]);
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });
});

app.post(
  "/users",
  /* authenticateUser, */
  (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd)
      .then((result) => res.status(201).send(result))
      .catch((error) => res.status(500).send(error.message));
  }
);

app.post("/users/:id/table/days", (req, res) => {
  const id = req.params["id"];
  const day = req.body;

  addDay(id, day)
    .then((result) => res.status(201).send(result))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/users/:id/table/days/:dayId/:category", (req, res) => {
  const { id, dayId, category } = req.params;
  if (["personalItems", "mealplanItems", "groceryItems"].includes(category)) {
    const itemToAdd = req.body;
    addItemToDay(id, dayId, category, itemToAdd)
      .then((result) => res.status(201).send(result))
      .catch((error) => res.status(500).send(error.message));
  } else if (
    ["personalTotal", "mealplanTotal", "groceryTotal"].includes(category)
  ) {
    const val = req.body[category];
    updateTotal(id, dayId, category, val)
      .then(() => res.status(201).send())
      .catch((error) => res.status(500).send(error.message));
  } else {
    throw new Error(`Invalid category: ${category}`);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  deleteUser(id).then((result) => res.send());
});

app.delete("/users/:id/table/days/:dayId/:category/:itemId", (req, res) => {
  const { id, dayId, category, itemId } = req.params;
  deleteItem(id, dayId, category, itemId)
    .then(() => res.status(204).send())
    .catch((error) => res.status(500).send(error.message));
});


app.post("/signup", registerUser);
app.post("/login", loginUser);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
