import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userService from "./services/user-service.js";

function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}


export function registerUser(req, res) {
   const { username, pwd } = req.body; // from form
   userService.findUserByUsername(username).then((user) => {
     const taken = user.length !== 0; 
     if (!username || !pwd) {
       res.status(400).send("Bad request: Invalid input data.");
     } else if (taken) {
       res.status(409).send("Username already taken");
     } else {
       bcrypt
	 .genSalt(10)
	 .then((salt) => bcrypt.hash(pwd, salt))
	 .then((hashedPassword) => {
	   generateAccessToken(username).then((token) => {
	     res.status(201).send({ token: token });
	     userService.addUser({ username: username, password: hashedPassword });
	   });
	 });
   }}).catch(() => {
     res.status(400).send("Unauthorized");
   });
 }

 export function authenticateUser(req, res, next) {
   const authHeader = req.headers["authorization"];
   //Getting the 2nd part of the auth header (the token)
   const token = authHeader && authHeader.split(" ")[1];

   if (!token) {
     console.log("No token received");
     res.status(401).end();
   } else {
     jwt.verify(
       token,
       process.env.TOKEN_SECRET,
       (error, decoded) => {
         if (decoded) {
           next();
         } else {
           console.log("JWT error:", error);
           res.status(401).end();
         }
       }
     );
   }
 }


export function loginUser(req, res) {
  const { username, pwd } = req.body; // from form

  const retrievedUser = userService.findUserByUsername(username);
  retrievedUser.then((user) => {
    bcrypt
      .compare(pwd, user[0].password)
      .then((matched) => {
        if (matched) {
          generateAccessToken(username).then((token) => {
            res.status(200).send({ token: token });
          });
        } else {
          // invalid password
          res.status(401).send("Unauthorized");
        }
      })})
    .catch(() => {
      res.status(401).send("Unauthorized");
    });
  console.log(username);
 }

