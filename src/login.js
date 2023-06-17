const mysql = require("mysql2");
const express = require("express");
const expressSession = require("express-session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const path = require("path");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/signup", (req, res) => {
  res.render("signup", { invalidText: null });
});

app.get("/signin", (req, res) => {
  res.render("login");
});

const connection = mysql.createConnection({
  host: "***REMOVED***",
  user: "***REMOVED***",
  password: "***REMOVED***",
  database: "***REMOVED***",
});

connection.connect((error) => {
  if (error) {
    console.log("Error:", error);
  }
  console.log("Connected");
});

let name;
let loggedin;
app.post("/signup", (req, res) => {
  let hashedPassword;
  const username = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const query =
    "INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)";

  if (username && email && password) {
    if (username.length < 3) {
      return res.render("signup", { invalidText: "Username is too short" });
    }

    if (username.length > 15) {
      return res.render("signup", { invalidText: "Username is too long" });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.render("signup", { invalidText: "Invalid email address" });
    }

    if (password.length < 8) {
      return res.render("signup", {
        invalidText: "Password must be at least 8 characters long",
      });
    }

    if (!/\d/.test(password)) {
      return res.render("signup", {
        invalidText: "Password must contain a digit",
      });
    }

    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        console.log("Error generating salt:", error);
        return;
      }

      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          console.log("Error hashing password:", error);
          return;
        }

        hashedPassword = hash;
      });
    });

    setTimeout(() => {
      connection.query(
        query,
        [username, email, hashedPassword],
        (error, results) => {
          if (error) {
            console.log("Error:", error);
          }

          res.redirect("/signin");
          console.log("logged in succesfully");
        }
      );
    }, 100);
  }
});

app.get("/home", (req, res) => {
  if ((loggedin = true)) {
    res.send("Welcome back " + name);
  } else {
    res.send("Not logged in");
  }

  res.end();
});

app.listen(3000);
