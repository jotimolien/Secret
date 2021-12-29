//V2ENV requiring dotenv to add an environment variable to hide secrets, API keys and passwords.
require('dotenv').config(); //Must be a the top. We don't need to add a constant here.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption"); // V2 inatalles mongoose-encrytion

const app = express();

//2ENV process.env.NAME_OF_YOUR_VARIABLE_FROM_.ENV_FILE is how to call your item from the ENV file.
console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email:String,
  password: String
});

//V2ENV Removed secret and adding to the .env file and removed cont, quotations and whitespaces.

//2ENV telling encrypt plugin to use the ENV variable as he secret.
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']}); //This encrytion plugin can encrypt entire DB by default so you need to specifiy which field/row to encrypt.

const User = new mongoose.model("User", userSchema);

//////////////////////////////////////////////////////////////////////

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  res.render("secrets");
});

app.get("/submit", function(req, res){
  res.render("submit");
});

//////////////////////////////////////////////////////////////////////

//Register
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.regUsername,
    password: req.body.regPassword
  });

  newUser.save(function(err){ //V2 since we added mongoose-encrypt now every time we hit save it will encrypt the password.
    if (err) {
      console.log("There was an error registering a new user: " + err);
    } else {
      console.log("successfully registered new user!");
      res.render("secrets");
    }
  });
});

//Login
app.post("/login", function(req, res){
  const username = req.body.logUsername;
  const password = req.body.logPassword;

  User.findOne({email: username}, function(err, foundUser){ //V2 since we added mongoose-encrypt now every time we hit find it will decrypt the password.
    if (err) {
      console.log("There was an error trying to find a matching user to login: " + err);
    } else {
      if(foundUser.password === password){
        res.render("secrets");
      }
    }
  });


});

//////////////////////////////////////////////////////////////////////

app.listen(3009,function(){
  console.log("SecretsV1 server is up and running on port 3009");
});
