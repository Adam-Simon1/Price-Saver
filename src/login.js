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
  const token = req.cookies.token;
  if (token) {
    res.redirect("/home");
  } else {
    res.render("index");
  }
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

app.get("/shopping-lists", (req, res) => {
  res.render("shopping-lists", { tableCountEjs: null });
});

app.get("/saved-tables", (req, res) => {
  res.render("saved-tables");
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
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

let insertColumn;
let columnArray = [];
app.post("/table/data", authUser.authenticateToken, (req, res) => {
  const userID = req.user.id;
  const arrayDataTesco = req.body.arrayDataTesco;
  const arrayDataKaufland = req.body.arrayDataKaufland;
  let serializedTesco;
  let serializedKaufland;
  let combinedArray;

  if (arrayDataTesco && arrayDataKaufland) {
    serializedTesco = JSON.stringify(arrayDataTesco);
    serializedKaufland = JSON.stringify(arrayDataKaufland);
    combinedArray = serializedTesco + ":" + serializedKaufland;
  } else if (arrayDataTesco) {
    serializedTesco = JSON.stringify(arrayDataTesco);
    combinedArray = serializedTesco + 't';
  } else if (arrayDataKaufland) {
    serializedKaufland = JSON.stringify(arrayDataKaufland);
    combinedArray = serializedKaufland + 'k';
  }

  const tableName = "Table1";

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
      columnArray.push(1);
      const expirationDate = new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000);
      res.cookie("idCookie", JSON.stringify(columnArray), {
        expires: expirationDate,
      });

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

      connection.query(
        "INSERT INTO tablenames (id) VALUES (?)",
        [userID],
        () => {
          if (err) {
            console.log("Error inserting user id:", err);
          }
        }
      );

      connection.query(
        "UPDATE tablenames SET name1 = ? WHERE id = ?",
        [tableName, userID],
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
            `SELECT COUNT(*) AS empty_count FROM producttables WHERE table${i} IS NULL AND id = ${userID}`,
            (err, results) => {
              if (err) {
                console.log("Empty error:", err);
              }
              emptyColumn = results[0].empty_count;

              if (emptyColumn > 0 && !columnFound) {
                columnFound = true;
                console.log("Empty column found:", i);
                insertColumn = i;
                columnArray.push(insertColumn);

                const expirationDate = new Date(
                  Date.now() + 3650 * 24 * 60 * 60 * 1000
                );
                res.cookie("idCookie", JSON.stringify(columnArray), {
                  expires: expirationDate,
                });

                connection.query(
                  `UPDATE producttables SET table${i} = ? WHERE id = ?`,
                  [combinedArray, userID],
                  (err, results) => {
                    if (err) {
                      console.log("Error inserting array:", err);
                    } else {
                      return res.render("tables", {
                        Saved: "Saved successfully",
                      });
                    }
                  }
                );

                connection.query(
                  `UPDATE tablenames SET name${i} = ? WHERE id = ?`,
                  [tableName, userID],
                  (err, results) => {
                    if (err) {
                      console.log("Error inserting name:", err);
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

app.post("/lists", authUser.authenticateToken, (req, res) => {
  const userID = req.user.id;
  const countEmptyColumnQuery = `SELECT COUNT(*) AS column_count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '***REMOVED***' AND TABLE_NAME = 'producttables';`;
  let tableCount = 0;

  connection.query(countEmptyColumnQuery, (err, results) => {
    if (err) {
      console.log(err);
    }
    const columnCount = results[0].column_count - 1;

    let emptyColumn;
    let completedQueries = 0;
    for (let i = 1; i < columnCount; i++) {
      connection.query(
        `SELECT COUNT(*) AS empty_count FROM producttables WHERE table${i} IS NOT NULL AND id = ?`,
        [userID],
        (err, results) => {
          if (err) {
            console.log("Empty error:", err);
          }
          emptyColumn = results[0].empty_count;
          if (emptyColumn > 0) {
            tableCount++;
          }

          completedQueries++;

          if (completedQueries === columnCount - 1) {
            res.json({ tableCount, insertColumn });
          }
        }
      );
    }
  });
});

app.post("/remove-table", authUser.authenticateToken, (req, res) => {
  const userID = req.user.id;
  const tableNumber = req.body.tableNumber;
  try {
    connection.query(
      `UPDATE producttables SET table${tableNumber} = NULL WHERE id = ?`,
      [userID],
      (err, results) => {
        if (err) {
          console.log("Error removing a column:", err);
        } else {
          console.log("Removed successfully");
        }
      }
    );
  } catch (error) {}
});

let array;
app.post("/open-table", authUser.authenticateToken, (req, res) => {
  const userID = req.user.id;
  const tableNumber = req.body.tableNumber;

  try {
    connection.query(
      `SELECT table${tableNumber} FROM producttables WHERE id = ?`,
      [userID],
      (err, results) => {
        if (err) {
          console.log("Error extracting a column:", err);
        } else {
          array = results[0]["table" + tableNumber.toString()];
        }
      }
    );
  } catch (error) {}
});

app.post("/send-array", authUser.authenticateToken, (req, res) => {
  res.json({ array });
});

app.listen(process.env.PORT || 3000);
