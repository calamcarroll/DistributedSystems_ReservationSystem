var User                   = require('../models/users');
var Reservation            = require('../models/reservations');
var jwt                    = require('jsonwebtoken');
var secret                 = 'mySecret';
var bcrypt                 = require('bcrypt-nodejs');

module.exports = function(router) {
//Route for returning all reservations
    router.get('/getReservation', function(req,res){
        Reservation.find(function(err,reservations){
            if(err){
                res.json('there has been an error')
            }else{

                res.json(reservations)

            }
        });
    });
    //Route for adding a reservation
    router.post('/Reservation', function(req, res){
        var reservation = new Reservation();

        reservation.date = req.body.date;
        reservation.duration = req.body.duration;
        reservation.notes = req.body.notes;
        reservation.userId =req.body.userId;

         reservation.save(function (err){
             if(err){
                 res.json({success:false, message: 'Reservation not added! '});
             }else{
                 res.json({success:true, message: 'Reservation has been created'});
             }
         });
    });
    //Route for deleting a reservation
    router.delete('/Reservation/:id', function(req,res){
        Reservation.findByIdAndRemove(req.params.id, function(err) {
            if (err)
                res.send(err);
            else
                res.json({ message: 'Reservation Deleted!'});
        });
    });
    //Route for returning all the reservations a certain user has made
    router.get('/UserReservation/:userId', function(req,res){
        Reservation.find({ 'userId' : req.params.userId },function(err,reservations){
           if(err){
             res.send({message:'There has been an error on UserReservation find'});
          }else{
           res.json(reservations)
        }
    })
 });
    //Route for updating a reservations by Id
    router.put('/reservation/:id', function(req, res){
        Reservation.findById(req.params.id,function (err,reservation) {
            if(err){
                res.send(err);
            }else{
                reservation.date = req.body.date;
                reservation.duration = req.body.duration;
                reservation.notes = req.body.notes;
                reservation.save(function (err) {
                    if(err){
                        res.send(err)
                    }else{
                        res.json({message:'Reservation updated', data:reservation});
                    }
                })
            }
        })
    });
    ///All user and authentication routes
    //Route for returning all users registered
    router.get('/getUsers', function(req,res){
        User.find(function(err,user){
            if(err){
                res.send('There has been an error'+ err);
            }else{
                res.json(user)
            }
        });
    });
    //Route for getting only users that want to be admins
    router.get('/users/isAdmin', function(req,res){
        User.find({"adminRequest": true},function(err,user){
            if(err){
                res.send('There has been an error'+ err);
            }else{
                res.json(user)
            }
        });
    });
    //Route for making a user an admin
    router.put('/makeAdmin/:id',function (req,res) {
        User.findById(req.params.id,function (err,user) {
            if(err){
                res.send(err);
            }else{
                user.adminRequest = false;
                user.isAdmin = true;
                user.save(function (err) {
                    if(err){
                        res.send(err)
                    }else{
                        res.json({message:'User privileges updated', data:user});
                    }
                })
            }
        })
    });
    //Route for deleting a user by there Id
    router.delete('/deleteUser/:id', function(req,res){
        User.findByIdAndRemove(req.params.id,function(err){
           if(err){
               res.json(err)
           } else{
               res.json('User has been deleted');
           }
        });
    });
    //Route for adding a new user or registering
    router.post('/users', function(req,res,next){
    var user = new User();
    user.username     = req.body.username;
    user.password     = req.body.password;
    user.fName        = req.body.fName;
    user.lName        = req.body.lName;
    user.mobileNo     = req.body.mobileNo;
    user.email        = req.body.email;
    user.adminRequest = req.body.isAdmin;
    if(req.body.username == null||req.body.username === ''||req.body.password ==null||req.body.password ===''||req.body.fName==null||req.body.fName===''||req.body.lName==null||req.body.lName==''||req.body.mobileNo==null||req.body.mobileNo==''||req.body.email==null||req.body.email==''){
        res.json({success:false, message: 'Please provide a username, email and password'});
    }else{
        bcrypt.hash(user.password, null, null, function(err, hash){//hashes the password before it gets saved to the database
            if(err) return next(err);
            user.password= hash;
            user.save(function (err){
                if(err){
                    res.json({success:false, message: 'Duplicate entry found'});
                }else{
                    res.json({success:true, message: 'User has been created'});
                }
            });
        });
    }
});
//user login routes
    router.post('/authenticate', function(req,res){
        User.findOne({username:req.body.username}).select('email username password isAdmin _id').exec(function(err,user){
            if(err) throw err;
            if(!user){
                res.json({success:false, message:'No such user found!'});
            }else if (user){
                if (req.body.password) {
                    var validatePassword = user.comparePassword(req.body.password);
                    if (!validatePassword) {
                        res.json({success : false, message : 'Password incorrect'});
                    }
                    else{
                        //assigning values to the token if the user is authenticated
                        var token = jwt.sign({username: user.username, email: user.email, isAdmin: user.isAdmin, _id:user._id}, secret, {expiresIn: '24h'});
                        res.json({success : true, message : 'User logged in', token: token});
                    }
                }
                else{
                    res.json({success : false, message : 'No password provided!'});
                }﻿
            }

        });
    });
    //middleware to grab the users information
    router.use(function(req,res,next){
        var token = req.body.token||req.body.query||req.headers['x-access-token'];
        if(token){
            //verify the token
            jwt.verify(token,'mySecret',function(err,decoded){
                if(err){
                    res.json({success:false, message: 'Token was not verified'})
                }else{
                    req.decoded = decoded;//allows decoded to be accessable further down in post request
                    next();// allows the application to move onto the next route
                }
            })
        }else{
            res.send({ message:'token not found'});
        }
    });
    router.post('/currentUser', function(req, res){
        //uses secret to decode the information in the token. Giving you back all fields that were given to the token
        res.send(req.decoded);
    });
return router;
};