const passport = require('passport');
const BearerStrategy = require('passport-http-bearer')
const jwt = require('jsonwebtoken');
const User = require("../models/user");
require('dotenv').config()

passport.use(new BearerStrategy(
    function(token,done){
        jwt.verify(token,process.env.JWT_SECRET, function(err, decoded){
            if(err){
                return done(err);
            }
            if(decoded){
                User.findOne({_id:decoded.data._id}, function(err,user){
                    if(err){return done(err);}
                    if(!user){return done(null, false);}
                    return done(null, true);
                })
            }
        })
    }
));