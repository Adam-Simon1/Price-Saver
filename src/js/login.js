const mysql = require('mysql2');
//const express = require('express');
//const expressSession = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();

const connection = mysql.createConnection({
    host: '***REMOVED***',
    user: '***REMOVED***',
    password: '***REMOVED***',
    database: '***REMOVED***',
});

connection.connect((error) => {
    if (error){
        console.log('Error:', error);
    } 
    console.log('Connected');
});

const data = {
    username: 'Adam',
    password: '123',
    email: 'adam@gmail.com'
}

const query = 'INSERT INTO accounts SET ?'

connection.query(query, data, (error, results) => {
    if(error){
        console.log('Error:', error);
    }
    console.log('Inserted succesfully');
})
