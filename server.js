const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const { addNewUser, getCredentials, getCredentialsbyID } = require('./functions')

const initializePassport = require('./passport-config')

initializePassport(
  passport,
  username=>getCredentials(username),
  id=>getCredentialsbyID(id).then()
)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: 'restest',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.u_name })    
})

app.post('/',(req,res)=>{
  console.log(req.user.u_name+"\n"+req.body.message);
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs',{message: ''})
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    if(req.body.password!=req.body.re_password){
      
      res.render('register.ejs',{message: 'Passwords do not match'})
    }
    else if(req.body.password.length==0){
      res.render('register.ejs',{message: 'Password should be more than 0 characters long'})
    }
    else if(req.body.username.length==0){
      res.render('register.ejs',{message: 'Username should be more than 0 characters long'})
    }
    else{
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      addNewUser(req.body.username,hashedPassword)
      res.redirect('/login')
    }    
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)