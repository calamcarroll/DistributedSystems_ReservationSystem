angular.module('UpdateReservationController', ['authServices'])
.controller('UpdateReservationCtrl', function (Auth,$http,$scope) {
    var app = this;
    Auth.getUser().then(function(data) {
        $http.get('/Api/UserReservation/'+data.data._id).then(function(reservations){
            $scope.UserReservationtList = reservations.data;
        });
    app.getData = function(){
      };
    });
});