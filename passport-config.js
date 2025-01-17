const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName, getUserById) {
  const authenticateUser = async (username, password, done) => {
   
    const user = await getUserByName(username)
      
    if (user == null) {
      return done(null, false, { message: 'Incorrect or unregistered username' })
    }

    try {
      if (await bcrypt.compare(password, user.pass_word)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({usernameField:'username'}, authenticateUser))
  passport.serializeUser(( user, done) => done(null, user.id))
  passport.deserializeUser(async(id, done) => {return done(null, await getUserById(id))})
}

module.exports = initialize