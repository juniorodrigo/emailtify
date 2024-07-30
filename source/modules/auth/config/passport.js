const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../schemas/userSchema'); // Asegúrate de que la ruta sea correcta
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
},
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            const match = await bcrypt.compare(password, user.hash);
            if (!match) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            console.log(err);
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;