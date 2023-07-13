//const mysql = require("mysql2");
const { Client } = require("pg");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config({
  path: `${__dirname}/envvars.env`,
});
const path = require("path");
const cookieParser = require("cookie-parser");
const authUser = require("./authUser.js");
const validator = require("validator");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const session = require("cookie-session");
const { strict } = require("assert");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

const app = express();

app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/csv"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(
  session({
    name: "gh-session",
    keys: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "lax",
    httpOnly: true,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; media-src 'none'; frame-src 'none'; object-src 'self'; form-action 'self';"
  );
  next();
});

app.get("/", (req, res) => {
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

app.get("/shopping-lists", authUser.authenticateToken, (req, res) => {
  res.render("shopping-lists", { tableCountEjs: null });
});

app.get("/saved-tables", authUser.authenticateToken, (req, res) => {
  res.render("saved-tables");
});

const connection = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

connection.connect((error) => {
  if (error) {
    console.log("Error:", error);
  }
  console.log("Connected");
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        const githubId = profile.id;
        const githubName = profile.username;
        const githubEmail = profile.email;
        connection.query(
          "SELECT * FROM users WHERE github_id = $1",
          [githubId],
          (err, results) => {
            if (err) {
              console.log("Error selecting github id:", err);
            }

            console.log(results.rows.length);
            if (results.rows.length > 0) {
              return done(null, profile);
            } else {
              connection.query(
                "INSERT INTO users (github_id, name, email) VALUES ($1, $2, $3)",
                [githubId, githubName, githubEmail],
                (err, results) => {
                  if (err) {
                    console.log("Error inserting account data into db:", err);
                  }
                }
              );

              return done(null, profile);
            }
          }
        );
      });
    }
  )
);

app.post("/signup", (req, res) => {
  const username = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const queryInsert =
    "INSERT INTO accounts (username, email, password) VALUES ($1, $2, $3)";
  const queryEmail = "SELECT * FROM accounts WHERE email = $1";

  if (username && email && password) {
    const sanitizedUsername = validator.escape(validator.trim(username));
    const sanitizedEmail = validator.normalizeEmail(validator.trim(email));

    if (sanitizedUsername.length < 3) {
      return res.render("signup", { invalidText: "Username is too short" });
    }

    if (sanitizedUsername.length > 15) {
      return res.render("signup", { invalidText: "Username is too long" });
    }

    if (!validator.isEmail(sanitizedEmail)) {
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

    connection.query(queryEmail, [sanitizedEmail], (err, results) => {
      if (err) {
        console.log("Error checking email:", err);
        return;
      }

      if (results.length > 0) {
        return res.render("signup", { invalidText: "Email already exists" });
      } else {
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

            const hashedPassword = hash;

            connection.query(
              queryInsert,
              [sanitizedUsername, sanitizedEmail, hashedPassword],
              (error, results) => {
                if (error) {
                  console.log("Error:", error);
                }

                res.redirect("/signin");
                console.log("logged in succesfully");
              }
            );
          });
        });
      }
    });
  }
});

app.post("/auth", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const query = "SELECT * FROM accounts WHERE email = $1";
  if (email && password) {
    const sanitizedEmail = validator.normalizeEmail(validator.trim(email));

    connection.query(query, [sanitizedEmail], (err, results) => {
      if (err) {
        console.log(err);
      }

      //console.log(results.rows[0].username);
      if (results.rows.length > 0) {
        const storedHashedPassword = results.rows[0].password;

        bcrypt.compare(password, storedHashedPassword, (error, result) => {
          if (error) {
            console.log("Error comparing passwords:", error);
            return;
          }

          if (result) {
            const user = {
              id: results.rows[0].id,
              email: sanitizedEmail,
              username: results.rows[0].username,
            };

            const token = jwt.sign(user, process.env.JWT_SECRET, {
              expiresIn: "24h",
            });

            const oneDay = 24 * 60 * 60 * 1000;

            const expirationDate = new Date(Date.now() + oneDay);

            res.cookie("token", token, {
              sameSite: "lax",
              httpOnly: true,
              secure: true,
              expires: expirationDate,
            });

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

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  function (req, res) {}
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/signin" }),
  (req, res) => {
    const userId = req.user.id;
    connection.query(
      "SELECT * FROM users WHERE github_id = $1",
      [userId],
      (err, results) => {
        const user = {
          id: results.rows[0].id,
          username: results.rows[0].name,
        };

        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        const oneDay = 24 * 60 * 60 * 1000;
        const expirationDate = new Date(Date.now() + oneDay);
        res.cookie("token", token, {
          sameSite: "lax",
          httpOnly: true,
          secure: true,
          expires: expirationDate,
        });

        res.redirect("/home");
      }
    );
  }
);

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
    combinedArray = [serializedTesco + ":" + serializedKaufland];
  } else if (arrayDataTesco) {
    serializedTesco = JSON.stringify(arrayDataTesco);
    combinedArray = serializedTesco + "t";
  } else if (arrayDataKaufland) {
    serializedKaufland = JSON.stringify(arrayDataKaufland);
    combinedArray = serializedKaufland + "k";
  }

  const tableName = "Table1";

  const userIdExistQuery = "SELECT * FROM producttables WHERE id = $1";
  const insertUserIdQuery = "INSERT INTO producttables (id) VALUES ($1)";
  const countEmptyColumnQuery = `SELECT count(*) FROM information_schema.columns WHERE table_name = 'producttables' AND table_schema = 'public';`;
  const elementIdQuery = "UPDATE elementid SET idarray = $1 WHERE id = $2";
  const userIdQuery = "INSERT INTO elementid (id, idarray) VALUES ($1, $2)";

  connection.query(userIdExistQuery, [userID], (err, results) => {
    if (err) {
      console.log("Error checking user id:", err);
    }

    console.log("Results length:", results.rows.length);

    if (results.rows.length == 0) {
      console.log("Inserting user id...");
      columnArray.push(1);
      columnArrayString = JSON.stringify(columnArray);

      connection.query(
        userIdQuery,
        [userID, columnArrayString],
        (err, results) => {
          if (err) {
            console.log("Error inserting element id:", err);
          }
        }
      );

      connection.query(insertUserIdQuery, [userID], (err, results) => {
        if (err) {
          console.log("Error inserting user id:", err);
        }
      });

      console.log(combinedArray);
      console.log(userID);

      connection.query(
        "UPDATE producttables SET table1 = $1 WHERE id = $2",
        [combinedArray, userID],
        (err, results) => {
          if (err) {
            console.log("Error inserting id and array:", err);
          }
        }
      );

      connection.query(
        "INSERT INTO tablenames (id) VALUES ($1)",
        [userID],
        () => {
          if (err) {
            console.log("Error inserting user id:", err);
          }
        }
      );

      connection.query(
        "UPDATE tablenames SET name1 = $1 WHERE id = $2",
        [tableName, userID],
        (err, results) => {
          if (err) {
            console.log("Error inserting id and array:", err);
          }
        }
      );
    } else {
      console.log("User id exists, checking empty columns...");

      if (columnArray.length == 0) {
        connection.query(
          "SELECT idarray FROM elementid WHERE id = $1",
          [userID],
          (err, results) => {
            if (err) {
              console.log("Error selecting id array:", err);
            } else {
              if (results.rows.length > 0) {
                const idArray = JSON.parse(results.rows[0].idarray);
                console.log(idArray);
                columnArray = idArray;
              }
            }
          }
        );
      }

      connection.query(countEmptyColumnQuery, (err, results) => {
        if (err) {
          console.log(err);
        }
        const columnCount = parseInt(results.rows[0].count, 10) - 1;
        console.log("columnCount:", columnCount);

        let emptyColumn;
        let columnFound = false;
        for (let i = 1; i <= columnCount; i++) {
          connection.query(
            `SELECT COUNT(*) AS empty_count FROM producttables WHERE table${i} IS NULL AND id = $1`,
            [userID],
            (err, results) => {
              if (err) {
                console.log("Empty error:", err);
              }

              emptyColumn = results.rows[0].empty_count;

              if (emptyColumn > 0 && !columnFound) {
                columnFound = true;
                console.log("Empty column found:", i);
                insertColumn = i;
                columnArray.push(insertColumn);
                columnArrayString = JSON.stringify(columnArray);

                connection.query(
                  elementIdQuery,
                  [columnArrayString, userID],
                  (err, results) => {
                    if (err) {
                      console.log("Error inserting element id:", err);
                    }
                  }
                );

                console.log("Column array:", columnArray);

                connection.query(
                  `UPDATE producttables SET table${i} = $1 WHERE id = $2`,
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
                  `UPDATE tablenames SET name${i} = $1 WHERE id = $2`,
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
  const countEmptyColumnQuery = `SELECT count(*) FROM information_schema.columns WHERE table_name = 'producttables' AND table_schema = 'public';`;
  const elementIdExtractQuery = "SELECT idarray FROM elementid WHERE id = $1";
  let tableCount = 0;

  connection.query(elementIdExtractQuery, [userID], (err, results) => {
    if (err) {
      console.log("Error extracting id array:", err);
    } else {
      if (results.rows.length > 0) {
        const idArray = results.rows[0].idarray;
        const currentDate = new Date();
        const futureDate = new Date(
          currentDate.getTime() + 3650 * 24 * 60 * 60 * 1000
        );

        res.cookie("idCookie", idArray, { expires: futureDate });
      }
    }
  });

  connection.query(countEmptyColumnQuery, (err, results) => {
    if (err) {
      console.log(err);
    }
    const columnCount = parseInt(results.rows[0].count, 10) - 1;

    let emptyColumn;
    let completedQueries = 0;
    console.log(columnCount);
    for (let i = 1; i <= columnCount; i++) {
      connection.query(
        `SELECT COUNT(*) AS empty_count FROM producttables WHERE table${i} IS NOT NULL AND id = $1`,
        [userID],
        (err, results) => {
          if (err) {
            console.log("Empty error:", err);
          }
          emptyColumn = results.rows[0].empty_count;

          if (emptyColumn > 0) {
            tableCount++;
          }

          completedQueries++;

          if (completedQueries === columnCount) {
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
      `UPDATE producttables SET table${tableNumber} = NULL WHERE id = $1`,
      [userID],
      (err, results) => {
        if (err) {
          console.log("Error removing a column:", err);
        } else {
          console.log("Removed successfully");
        }
      }
    );

    connection.query(
      "SELECT idarray FROM elementid WHERE id = $1",
      [userID],
      (err, results) => {
        const idJson = results.rows[0].idarray;
        let idArray = JSON.parse(idJson);
        idArray = idArray.filter(
          (element) => element !== JSON.parse(tableNumber)
        );
        console.log(idArray);
        const idArrayStringified = JSON.stringify(idArray);

        connection.query(
          "UPDATE elementid SET idarray = $1 WHERE id = $2",
          [idArrayStringified, userID],
          (err, results) => {
            if (err) {
              console.log("Error inserting modified array:", err);
            }
          }
        );
      }
    );
  } catch (error) {}
});

app.post("/open-table", authUser.authenticateToken, (req, res) => {
  const userID = req.user.id;
  const tableNumber = req.body.tableNumber;
  console.log(tableNumber);

  connection.query(
    `SELECT table${tableNumber} FROM producttables WHERE id = $1`,
    [userID],
    (err, results) => {
      if (err) {
        console.log("Error extracting a column:", err);
      } else {
        const array = JSON.stringify(
          results.rows[0]["table" + tableNumber.toString()]
        );
        res.json({ array: array });
      }
    }
  );
});

app.post("/table-count", authUser.authenticateToken, (req, res) => {
  const userID = req.user.id;
  const elementIdExtractQuery = "SELECT idarray FROM elementid WHERE id = $1";

  connection.query(elementIdExtractQuery, [userID], (err, results) => {
    if (err) {
      console.log("Error extracting id array:", err);
    } else {
      if (results.rows.lenght > 0) {
        const tableCount = results.rows[0].idarray;
        res.json({ tableCount: tableCount });
      } else {
        res.json({ tableCount: [] });
      }
    }
  });
});

app.post("/autocomplete-data", (req, res) => {
  let kauflandArray;
  connection.query(
    "SELECT kaufland FROM autocomplete WHERE id = 1",
    (err, results) => {
      if (err) {
        console.log("Error getting kaufland data:", err);
      } else {
        kauflandArray = results.rows[0].kaufland;
      }
    }
  );

  connection.query(
    "SELECT tesco FROM autocomplete WHERE id = 1",
    (err, results) => {
      if (err) {
        console.log("Error getting tesco data:", err);
      } else {
        const tescoArray = results.rows[0].tesco;
        res.json({ tescoArray: tescoArray, kauflandArray: kauflandArray });
      }
    }
  );
});

app.post("/remove-cookie", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
    }
    req.session.destroy();
  });
  console.log("Remove");
  res.clearCookie("token");
  res.send();
});

app.post("/account-name", authUser.authenticateToken, (req, res) => {
  const username = req.user.username;
  res.json({ username: username });
});

app.listen(process.env.PORT || 3000);

module.exports = app;
