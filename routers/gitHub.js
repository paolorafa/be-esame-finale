const express = require('express')
const gh = express.Router()
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const jwt = require('jsonwebtoken')
const session = require('express-session')
require('dotenv').config()

gh.use(
    session({
        secret: process.env.GIT_HUB_SECRET,
        resave: false,
        saveUninitialized: false
    })
)

gh.use(passport.initialize())

gh.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done(null, user);

});

passport.use(
    new GitHubStrategy({
        clientID: process.env.GIT_HUB_ID,
        clientSecret: process.env.GIT_HUB_SECRET,
        callbackURL: process.env.GIT_HUB_URL
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }

    )
)

gh.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }), (req,res) =>{

    const redirectUrl=`http://localhost:3000/success?user=${encodeURIComponent(JSON.stringify(req.user))}`
    res.redirect(redirectUrl)

  })

  gh.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const user=req.user

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY_CLIENT)
    const redirectUrl = `http://localhost:3000/success/${encodeURIComponent(token)}`
    res.redirect(redirectUrl)

  });


  gh.get('/success', (req, res) =>{
    res.redirect(`http://localhost:3000/home`)
  })
module.exports = gh