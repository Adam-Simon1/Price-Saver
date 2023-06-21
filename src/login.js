const mysql = require("mysql2");
const express = require("express");
const expressSession = require("express-session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config({
  path: `${__dirname}/envvars.env`,
});
const path = require("path");
const cookieParser = require("cookie-parser");
const authUser = require("./authUser.js");
const { table } = require("console");

const app = express();
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/csv"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/startpage", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup", { invalidText: null });
});

app.get("/signin", (req, res) => {
  res.render("login", { incorrectText: null });
});

app.get("/search", authUser.authenticateToken, (req, res) => {
  res.render("search");
});

app.get("/tables", authUser.authenticateToken, (req, res) => {
  res.render("tables", { Saved: null });
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((error) => {
  if (error) {
    console.log("Error:", error);
  }
  console.log("Connected");
});

app.post("/signup", (req, res) => {
  let hashedPassword;
  const username = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const queryInsert =
    "INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)";
  const queryEmail = "SELECT * FROM accounts WHERE email = ?";

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

    connection.query(queryEmail, [email], (err, results) => {
      if (err) {
        console.log("Error checking email:", err);
        return;
      }

      if (results.length > 0) {
        return res.render("signup", { invalidText: "Email already exists" });
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
          queryInsert,
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
    });
  }
});

app.post("/auth", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  query = "SELECT * FROM accounts WHERE email = ?";
  if (email && password) {
    connection.query(query, [email], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        const storedHashedPassword = results[0].password;

        bcrypt.compare(password, storedHashedPassword, (error, result) => {
          if (error) {
            console.log("Error comparing passwords:", error);
            return;
          }

          if (result) {
            const user = {
              id: results[0].id,
              email: email,
              username: results[0].username,
            };

            const token = jwt.sign(user, process.env.JWT_SECRET, {
              expiresIn: "24h",
            });

            res.cookie("token", token);

            res.redirect("/home");
          } else {
            res.render("login", {
              incorrectText: "Incorrect email and/or password",
            });
          }
        });
      } else {
        res.render("login", {
          incorrectText: "Incorrect email and/or password",
        });
      }
    });
  }
});

app.get("/home", authUser.authenticateToken, (req, res) => {
  res.render("home");
});

app.post("/table/data", authUser.authenticateToken, (req, res) => {
  const userID = req.user.id;
  const arrayDataTesco = req.body.arrayDataTesco;
  const arrayDataKaufland = req.body.arrayDataKaufland;
  const serializedTesco = JSON.stringify(arrayDataTesco);
  const serializedKaufland = JSON.stringify(arrayDataKaufland);
  const combinedArray = serializedTesco + ":" + serializedKaufland;

  const userIdExistQuery = "SELECT * FROM producttables WHERE id = ?";
  const insertUserIdQuery = "INSERT INTO producttables (id) VALUES (?)";
  const countEmptyColumnQuery = `SELECT COUNT(*) AS column_count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '***REMOVED***' AND TABLE_NAME = 'producttables';`;

  connection.query(userIdExistQuery, [userID], (err, results) => {
    if (err) {
      console.log("Error checking user id:", err);
    }

    console.log("Results length:", results.length);

    if (results.length == 0) {
      console.log("Inserting user id...");

      connection.query(insertUserIdQuery, [userID], (err, results) => {
        if (err) {
          console.log("Error inserting user id:", err);
        }
      });

      connection.query(
        "UPDATE producttables SET table1 = ? WHERE id = ?",
        [combinedArray, userID],
        (err, results) => {
          if (err) {
            console.log("Error inserting id and array:", err);
          }
        }
      );
    } else {
      console.log("User id exists, checking empty columns...");
      connection.query(countEmptyColumnQuery, (err, results) => {
        if (err) {
          console.log(err);
        }
        const columnCount = results[0].column_count - 1;
        let emptyColumn;
        let columnFound = false;
        for (let i = 1; i < columnCount; i++) {
          connection.query(
            `SELECT COUNT(*) AS empty_count FROM producttables WHERE table${i} IS NULL`,
            (err, results) => {
              if (err) {
                console.log("Empty error:", err);
              }
              emptyColumn = results[0].empty_count;

              if (emptyColumn > 0 && !columnFound) {
                columnFound = true;
                console.log("Empty column found:", i);

                connection.query(
                  `UPDATE producttables SET table${i} = ? WHERE id = ?`,
                  [combinedArray, userID],
                  (err, results) => {
                    if (err) {
                      console.log("Error inserting array:", err);
                    } else {
                      console.log("s");
                      return res.render("tables", {
                        Saved: "Saved successfully",
                      });
                    }
                  }
                );
              }
            }
          );
        }
      });
    }
  });
});

app.listen(3000);
