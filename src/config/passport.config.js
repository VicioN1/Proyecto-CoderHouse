const passport = require("passport")
const GitHubStrategy = require("passport-github2")
const User = require('../models/user.model');
const dotenv = require("dotenv");
dotenv.config();

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: (process.env.clientID),
        clientSecret: (process.env.clientSecret),
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await User.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: " ",
                    email: profile._json.email,
                    age: 20,
                    password: " ",
                    role: "user"
                }
                let result = await User.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))



    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await User.findById(id)
        done(null, user)
    })





}
module.exports = initializePassport;

