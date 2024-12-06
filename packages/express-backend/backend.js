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
  getTableDayId,
  findTableByUserId,
  updateTotal,
  updateBudget,
  deleteUser,
  deleteDay,
  deleteItem
} = userService;

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;
const { ALLOWED_ORIGIN } = process.env;

mongoose.set("debug", true);
mongoose.connect(MONGO_CONNECTION_STRING).catch((error) => console.log(error));

const app = express();
const port = 8000;
/*
const corsOptions = {
  origin: ALLOWED_ORIGIN,
  methods: 'GET,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};
*/

console.log(ALLOWED_ORIGIN);
console.log(MONGO_CONNECTION_STRING);

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
  getId(req)
    .then((id) => {
      if (!id) {
        return res.status(404).send("User ID not found.");
      }

      return findTableByUserId(id).then((result) => {
        if (!result) {
          return res.status(404).send(`Table not found for user ID: ${id}`);
        }

        return res.send(result);
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error.name || "Internal Server Error");
    });
});

app.get("/users/table/days", authenticateUser, (req, res) => {
  getId(req)
    .then((id) => {
      if (!id) {
        return res.status(404).send("User ID not found.");
      }

      return getTableDays(id)
        .then((result) => {
          if (!result) {
            return res.status(404).send(`No days found for user ID: ${id}`);
          }

          return res.send(result);
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error.name || "Internal Server Error");
    });
});


app.get("/users/table/days/:dayName", authenticateUser, (req, res) => {
  /* For sure needs to get reformatted like the post
(so getId(...).then(...=> getTableDayId) to the rest of the work */
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

app.get("/users/table/days/:dayName/items", authenticateUser, (req, res) => {
  /* For sure needs to get reformatted like the post
  (so getId(...).then(...=> getTableDayId) to the rest of the work */

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

app.get("/users/table/days/:dayName/:category", authenticateUser, (req, res) => {
  /* For sure needs to get reformatted like the post */
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

app.delete("/users/table/days/:dayName", authenticateUser, (req, res) => {
  getId(req)
    .then((id) => {
      if (!id) {
        throw new Error("User not found");
      }

      const { dayName } = req.params;

      return deleteDay(id, dayName);
    })
    .then(() => res.status(204).send())
    .catch((error) => {
      console.error(error);
      res.status(500).send(error.message);
    });
});


app.post("/users/table/days/:dayName/:category", authenticateUser, (req, res) => {
  getId(req)
    .then((id) => {
      if (!id) {
        throw new Error("User Id Not Found");
      }

      const { dayName, category } = req.params;
      console.log("posting to day", dayName, "of id", id, "under category", category);

      return getTableDayId(id, dayName)
        .then((dayId) => {
            console.log("day id is ", dayId);
            console.log("item is", req.body);

            if (!["personal", "meal", "grocery"].includes(category)) {
              throw new Error(`Invalid category: ${category}`);
            }

            const catMap = {
              personal: "personalItems",
              meal: "mealplanItems",
              grocery: "groceryItems"
            }

            const totMap = {
              personal: "personalTotal",
              meal: "mealplanTotal",
              grocery: "groceryTotal"
            }

            const cat = catMap[category];
            const tot = totMap[category];
            const itemToAdd = req.body;

            return addItemToDay(id, dayId, cat, itemToAdd)
              .then(() =>
                updateTotal(id, dayId, tot, itemToAdd.price))
              .then((result) => {
                res.status(201).send(result)
              });
          })
        .catch((error) => {
          console.error("Error in category add block", error);
          res.status(500).send(error.message)
        });
    })
    .catch((error) => {
      console.error("Error in getId call", error);
      res.status(500).send(error.message);
    });
});

app.post("/users/budget", authenticateUser, (req, res) => {
  const { budgetType, budget } = req.body;
  getId(req).then((id) => {
    if(!id) {
      throw new Error("User Id Not Found")
    }
    updateBudget(id, budgetType, budget)
    .then((result) => {
      return res.status(200).send(result)
    })
  })
  .catch((error) => {
    console.log(error)
  })
});

app.delete("/users", authenticateUser, (req, res) => {
  getId(req)
    .then((id) => {
      if (!id) {
        throw new Error("User Id Not Found");
      }
      return deleteUser(id)
    })
    .then((result) => res.send(result));
});

app.delete("/users/table/days/:dayName/:category/:itemId", authenticateUser, (req, res) => {
  getId(req)
    .then((id) => {
      if (!id) {
        throw new Error("User Id Not Found");
      }
      const { dayId, category, itemId } = req.params;
      return deleteItem(id, dayId, category, itemId)
        .then(() => res.status(204).send())

    }).catch((error) => res.status(500).send(error.message));

});


app.post("/signup", registerUser);
app.post("/login", loginUser);

app.listen(process.env.PORT || port, () => {
  console.log(`REST API is listening.`);
});
