const mysql = require("mysql2");
const express = require("express");
const expressSession = require("express-session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config({
  path: `${__dirname}/envvars.env`
});
const path = require("path");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/csv"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/startpage', (req, res) => {
  res.render('index');
})

app.get("/signup", (req, res) => {
  res.render("signup", { invalidText: null });
});

app.get("/signin", (req, res) => {
  res.render("login", { incorrectText: null });
});

app.get("/search", (req, res) => {
  res.render('search');
})

app.get('/tables', (req, res) => {
  res.render('tables');
})

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(401); 
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); 
    }

    req.user = user; 
    next();
  });
}

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
              email: email,
              username: results[0].username
            };

            const token = jwt.sign(user, process.env.JWT_SECRET, {
              expiresIn: '1h'
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

app.get("/home", authenticateToken, (req, res) => {
  res.render('home');

  res.end();
});

app.listen(3000);
