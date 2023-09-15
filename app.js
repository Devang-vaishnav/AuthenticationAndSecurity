//jshint esversion:6
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');

  
  const userSchema = new mongoose.Schema({
    email:String,
    password:String
  });

//Below code is to implement level2 authentication & security.
  var secret = process.env.SECRET;
  userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["password"]});

  const User = mongoose.model('user', userSchema);


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", (req,res) => {
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save()
    .then((user) => {
        // If everything goes as planed
        //use the retured user document for something
         res.render("secrets");
    })
    .catch((error) => {
        //When there are errors We handle them here
        console.log(err);
        res.send(400, "Bad Request");
    });
});


app.post("/login", (req,res) => {
    // try {
    //     const verification = await User.findOne({email:req.body.username,password:req.body.password});
    //     res.render("secrets");
    // } catch (error) {
    //     console.log(err);
    //     res.status(400);
    // }

    User.findOne({email:req.body.username})
    .then(function (user) {
        if(user){
            if(user.password === req.body.password){
                res.render("secrets");
            }
        }
    })
    .catch(function (err) {
    console.log(err);
    });
});

app.listen(3000, (req,res) => {
    console.log(`Your Server is now running on port 3000....`);
});

}