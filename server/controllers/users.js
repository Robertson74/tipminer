
var User = require('mongoose').model('User');
var encrypt = require('../utilities/encryption');

exports.getUsers = function(req, res){

    User.find({company: req.user.company}).select('firstName lastName username company roles').exec(function(err, collection){
        res.send(collection);
    });

};

exports.createUser = function(req, res, next){

    var userData = req.body;
    
    userData.username = userData.username.toLowerCase();
    userData.salt = encrypt.createSalt();
    userData.hashed_pwd = encrypt.hashPwd(userData.salt, userData.password);
    User.create(userData, function(err, user){
        //console.log("I am here.")
        if(err){
            if(err.toString().indexOf('E11000')>-1){
                err = new Error('Duplicate Username');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }

        req.login(user, function (err) {
            if (err) { return next(err); }
            //console.log(user);
            res.send(user);
        });

    });

};

exports.updateUser = function(req, res){
    //console.log(req.user);
    var userUpdates = req.body;
    // this makes sure that the user making the request matches the user to update and that the user has the role of admin
    if(req.user._id != userUpdates._id && !req.user.hasRole('admin')){
        res.status(403);
        return res.end();
    }

    req.user.firstName = userUpdates.firstName;
    req.user.lastName = userUpdates.lastName;
    req.user.username = userUpdates.username;
    if(userUpdates.password && userUpdates.password.length > 0){

        req.user.salt = encrypt.createSalt();
        req.user.hashed_pwd = encrypt.hashPwd(req.user.salt, userUpdates.password);
    }

    req.user.save(function (err) {
        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        res.send(req.user);
    });



};