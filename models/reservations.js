var mongoose                  = require('mongoose');
var Schema                    = mongoose.Schema;
var moment                    = require('moment');


var ReservationSchema = new Schema({
    date:{type:Date,required:true},
    duration:{type:Number},
    notes:{type:String},
    userId:{type:String}
});
ReservationSchema.pre('save', function(next) {
     var reservation = this;
     reservation.date = moment(reservation.date).format('YYYY-DD-MM');
     next();
});
module.exports = mongoose.model('Reservation', ReservationSchema);