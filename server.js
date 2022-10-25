const express = require('express')
const app = express()
const port = 3003
const mongodb = require('mongodb').MongoClient
const mongoose = require('mongoose');
const Destination = require('./schemas/destination');
const jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
const User = require("./schemas/user");
const dotenv = require("dotenv");
dotenv.config();

// auto-refresh server on file changes: https://www.npmjs.com/package/@types/nodemon
app.use(express.json())


app.get('/destinations', (req, res) => {
    console.log("test");
    Destination.find({}, (err, destinations) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(destinations);
        }
    })
})
app.post("/destinations", function(req, res) {
    console.log(req.body); // to read the req.body, in postman fill out the body and select "raw"
    
    res.send("Post request")
})
app.put("/destinations/:id", (req, res) => {
    res.send("Put")
    console.log(req.params.id);
})
app.delete("/destinations/:id", (req, res) => {
    res.send("Delete")
    console.log(req.params.id);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})