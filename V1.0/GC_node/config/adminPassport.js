const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Admin = mongoose.model('admins');
const keys = require('./keys');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrket;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Admin.findById(jwt_payload.id)
            .then(admin => {
                if (admin) {
                    return done(null, admin);
                }

                return done(null, false);
            })
            .catch(err => {
                console.log(err);
            })
    }));
}