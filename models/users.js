var mongoose                  = require('mongoose');
var Schema                    = mongoose.Schema;
var bcrypt                    = require('bcrypt-nodejs');

var UserSchema = new Schema({
    username:{type:String, lowercase:true, required:true, unique:true},
    password: {type: String, required:true},
    fName:{type: String},
    lName:{type: String},
    mobileNo:{type:Number},
    email: {type: String},
    adminRequest:{type:Boolean},
    isAdmin:{type: Boolean}
});

//Compares  the password the user provided at the login to the password of the user
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
};
module.exports = mongoose.model('User', UserSchema);
