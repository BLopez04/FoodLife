import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userService from "./services/user-service.js";
import { registerUser, authenticateUser, loginUser } from "./auth.js";

const {
  getUsername,
  getId,
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

app.get("/users", authenticateUser, (req, res) => {
  getUsername(req)
    .then((username) => {
      if (username) {
        res.send({ username: username })
      }
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });
});

app.get("/users/id", authenticateUser, (req, res) => {
  getId(req)
    .then((id) => {
      if (id) {
        res.send({ _id: id })
      }
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });
});

app.get("/users/table", authenticateUser, (req, res) => {
  const id = getId(req)
    .then((id) => {
      if (id) {
        return ({ _id: id })
      }
    })
  console.log(id);

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

app.get("/users/table/days", authenticateUser, (req, res) => {
  const id = getId(req)
    .then((id) => {
      if (id) {
        return ({ _id: id })
      }
    })
  console.log(id);

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

app.get("/users/table/days/:dayId/items", authenticateUser, (req, res) => {
  const id = getId(req)
    .then((id) => {
      if (id) {
        return ({ _id: id })
      }
    })
  console.log(id);

  const dayId = req.params;
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

app.get("/users/table/days/:dayId", authenticateUser, (req, res) => {
  const id = getId(req)
    .then((id) => {
      if (id) {
        return ({ _id: id })
      }
    })
  console.log(id);

  const dayId = req.params;

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

app.get("/users/table/days/:dayId/:category", authenticateUser, (req, res) => {
  const id = getId(req)
    .then((id) => {
      if (id) {
        return ({ _id: id })
      }
    })
  console.log(id);

  const { dayId, category} = req.params;

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

app.post("/users", authenticateUser, (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd)
      .then((result) => res.status(201).send(result))
      .catch((error) => res.status(500).send(error.message));
  }
);

app.post("/users/table/days", authenticateUser, (req, res) => {
  getId(req)
    .then((id) => {
      if (id) {
        console.log("posting to day of id", id);

        const day = req.body
        return addDay(id, day)
          .then((result) => res.status(201).send(result))

      }
    })
    .catch((error) => res.status(500).send(error.message));
})

app.post("/users/table/days/:dayId/:category", authenticateUser, (req, res) => {
  const id = getId(req)
    .then((id) => {
      if (id) {
        return ({ _id: id })
      }
    })
  console.log(id);

  const { dayId, category } = req.params;

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

app.delete("/users", authenticateUser, (req, res) => {
  const id = getId(req)
    .then((id) => {
      if (id) {
        return ({ _id: id })
      }
    })
  console.log(id);

  deleteUser(id).then((result) => res.send());
});

app.delete("/users/table/days/:dayId/:category/:itemId", authenticateUser, (req, res) => {
  const id = getId(req)
    .then((id) => {
      if (id) {
        return ({ _id: id })
      }
    })
  console.log(id);

  const { dayId, category, itemId } = req.params;
  deleteItem(id, dayId, category, itemId)
    .then(() => res.status(204).send())
    .catch((error) => res.status(500).send(error.message));
});


app.post("/signup", registerUser);
app.post("/login", loginUser);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
