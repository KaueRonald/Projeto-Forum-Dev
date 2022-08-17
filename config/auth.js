const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { deleteOne } = require("../models/User")

//Model User
require("../models/User")
const User = mongoose.model("User")


module.exports = function (passport) {

    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {

        User.findOne({ email: email }).then((User) => {
            if (!User) {
                return done(null, false, { message: "Essa conta não existe!" })
            }

            bcrypt.compare(password, User.password, (erro, batem) => {

                if (batem) {
                    return done(null, User)
                } else {
                    return done(null, false, { message: "Essa senha está incorreta!" })
                }
            })
        })
    }))

    passport.serializeUser((User, done) => {

        done(null, User.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}