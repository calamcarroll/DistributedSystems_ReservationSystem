angular.module('reservationController', ['authServices'])
.controller('reservationCtrl', function (Auth,$http,$scope,$location,$timeout, myService,$filter) {
    var app = this;
    $scope.formData = {};
    $scope.formData.date = myService.date;
    $scope.formData.duration = myService.duration;
    $scope.formData.notes = myService.notes;
    $scope.formData._id = myService.identity0;

    Auth.getUser().then(function(data) {
        $scope.formData.userId = data.data._id;
    });

    $http.get('Api/getReservation').then(function(reservations){

            $scope.reservationtList = reservations.data;

    });

    this.makeReservation = function (formData) {

        $http.post('/Api/Reservation', $scope.formData).then(function(data){
            if(data.data.success){
                console.log('Record has been added');
                $timeout(function () {
                    $location.path('/ReservationManager');
                },2000);
            }else{
                console.log('There has been an error with your request')
             }
        })
    };
    this.getUpdateDetails = function(reservations_info){

      myService.date = reservations_info.date;
      myService.duration = reservations_info.duration;
      myService.notes = reservations_info.notes;
      myService.identifier = reservations_info._id;

      $location.path('/updateReservationInputPage');
      var myDate = myService.date;
      var string = (myDate);
        console.log(string);
    };
    this.update = function(){

      $http.put('/Api/reservation/'+ myService.identifier,$scope.formData).then(function(){
              $location.path('/ReservationManager');
      });
    };
    this.delete = function(id) {
        if (confirm("Are you sure you want to delete this reservation?")) {
            $http.delete('/Api/Reservation/' + id)
                .then(function() {
                    $timeout(function(){
                        $location.path('/ReservationManager');
                    },2000);
                    console.log('Reservation has been deleted');
                })
           }
       };
});

