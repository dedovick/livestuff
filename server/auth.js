const bcrypt = require('bcryptjs')  
const LocalStrategy = require('passport-local').Strategy
 
module.exports = function(passport){
   //configuraremos o passport aqui
    function findUser(username, callback){
        global.db.collection("usuarios").findOne({"username": username}, function(err, doc){
            callback(err, doc);
        });
    }
    
    function findUserById(id, callback){
        const ObjectId = require("mongodb").ObjectId;
        global.db.collection("usuarios").findOne({_id: ObjectId(id) }, (err, doc) => {
            callback(err, doc);
        });
    }
	
	passport.serializeUser(function(user, done){
        done(null,user._id);
    });
 
    passport.deserializeUser(function(id, done){
        findUserById(id, function(err,user){
            done(err, user);
        });
    });
	
	passport.use(new LocalStrategy( {
            usernameField: 'username',
            passwordField: 'password'
        },
      (username, password, done) => {
        findUser(username, (err, user) => {
          if (err) { return done(err) }
		  
          // usu�rio inexistente
          if (!user) { return done(null, false) }
    
          // comparando as senhas
          bcrypt.compare(password, user.senha, (err, isValid) => {
            if (err) { return done(err) }
            if (!isValid) { return done(null, false) }
            return done(null, user)
          })
        })
      }
    ));
}