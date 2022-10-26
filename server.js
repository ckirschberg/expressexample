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

var cors = require('cors');
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/destinations")
  .catch(error => console.log(error)); // connect to database

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.jwt_secret
};
const strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
    const user = await User.findOne({ _id: jwt_payload._id});
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
passport.use(strategy);
app.use(passport.initialize());


app.post("/signup", function(req, res) {
    try {
        const user = new User({ email: req.body.email, password: req.body.password });
        
        user.save((error) => {
            res.status(201).json({
                message: 'Signup successful'
            });
        })
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", function(req, res) {
    User.findOne({ email: req.body.email }, async function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).json({success: false, message: 'Login failed.'});
        } else if (user) {
            
            if (!await user.isValidPassword(req.body.password)) { // check if password matches
                res.status(401).json({success: false, message: 'Login failed.'});
            } else {
                const payload = {_id: user._id};
                // Here we are encoding the _id of the user into the token, 
                // so we can find the user object in subsequent requests.
                const token = jwt.sign({_id: user._id}, process.env.jwt_secret);
                res.status(200).json({message: "ok", token: token});
            }
        }});
    });

// A test route, checking that you only get access with correct token
app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){ 
    res.json({message: "Success!"});
  });
  



app.get('/destinations', (req, res) => {
    Destination.find({}, (err, destinations) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(destinations);
        }
    })
})
app.post("/destinations", function(req, res) {
    const destination = createDestinationFromBody(req.body);

    destination.save((err) => {
        if(err) {
            res.status(422).json(err);
        } else {
            res.status(201).json(destination);
        }
    })
})
app.put("/destinations/:id", (req, res) => {
    let destination = createDestinationFromBody(req.body);
    destination._id = req.params.id;

    try {
        destination.validate();
        Destination.updateOne({_id: req.params.id}, destination, (err, result) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(result);
            }
        })
    } catch(err) {
        res.status(422).json(err);
    }

})
app.delete("/destinations/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Destination.deleteOne({_id: req.params.id}, (err) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json("Deleted")
        }
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


function createDestinationFromBody(body) {
    return new Destination({
        title: body.title,
        fromDate: body.fromDate,
        toDate: body.toDate,
        description: body.description,
        location: body.location,
        country: body.country,
        picture: body.picture
    });
}