/* Tanımlama */
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const cookieParser = require ('cookie-parser')
const app = express()
const port = 3000;
const server = http.createServer(app)
const User = require('./models/users.js')
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);
/* Socket.io */
const { Server } = require("socket.io");
const io = new Server(server);
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});
/* Mongoose Connections */
const dbURL = process.env.db;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    server.listen(port, () => {
      console.log("mongoDB Bağlantı kuruldu");
    });
  })
  .catch((err) => console.log(err));
/* Server Bağlantı */
app.get('/',(req,res)=>{
  let userID = req.cookies.id;
  if(userID != null){
    User.findById(userID).then((UserResult)=>{
     res.render(`${__dirname}/views/pages/chat.ejs`,{user:UserResult})
    })
  }else{
    res.render(`${__dirname}/views/pages/kayıt.ejs`)
  }
})

app.post('/kayit',(req,res)=>{
  User.findOne({username : req.body.username}, (user,err)=>{
    if(user){
      res.render(`${__dirname}/views/error/kayıtlı.ejs`)
    } else {
      var user = new User({
        username : req.body.username,
      })
      user.save().then((result)=>{
        res.cookie("id", result._id)
        res.redirect('/')
      })
    }
  })
})