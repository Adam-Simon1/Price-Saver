const { Client } = require("pg");
const dotenv = require("dotenv").config({
  path: `${__dirname}/envvars.env`,
});
const path = require("path");
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

connection.connect((err) => {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Connected");
  }
});

app.listen(process.env.PORT || 3000);
