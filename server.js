'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');

const session= require('express-session');
const passport=require('passport');

const db=require('mongodb').MongoClient;
const objectId=require('mongodb').ObjectID;


const app = express();
app.set('view engine','pug')
fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/')
  .get((req, res) => {
    res.render(process.cwd() + '/views/pug/index.pug',{title:'Hello',message:'Please login'});
  });

app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:true,
  saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())

db.connect(process.env.MONGO,(err,data)=>{
  if (err){return err}
  else{
   passport.serializeUser((user,done)=>{  
     return  done(null,user._id)
   })

    passport.deserializeUser((id, done) => {
        db.collection('user').findOne(
            {_id: new objectId(id)},
            (err, doc) => {
               return  done(null, null);
            }
        );
    });
    }
})


app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});