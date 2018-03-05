var app = angular.module('appRoutes', ['ngRoute']);
app.service('myService', function(){
      var myService = {
          date:0,
          duration:0,
          notes:'',
          identity0:''
      };
      return myService;
});

    app.config(function ($routeProvider,$locationProvider) {
    $routeProvider

        .when('/loadUserReservations',{
            templateUrl:'public/app/views/pages/reservations/loadUserReservations.html'
        })
        .when('/updateReservation',{
            templateUrl:'public/app/views/pages/reservations/updateReservation.html',
            controller: 'reservationCtrl'
        })
        .when('/deleteUser',{
            templateUrl:'public/app/views/pages/users/deleteUser.html'
        })
        .when('/becomeAdmin',{
            templateUrl:'public/app/views/pages/users/becomeAdmin.html'
        })

        .when('/deleteFindReservation',{
            templateUrl:'public/app/views/pages/reservations/deleteFindReservation.html',
            controller: 'reservationCtrl'
        })
        .when('/AdminHome',{
            templateUrl:'public/app/views/pages/users/adminHome.html'
        })
        .when('/makeReservation',{
            templateUrl:'public/app/views/pages/reservations/makeReservation.html',
            controller: 'reservationCtrl'
        })
        .when('/login',{
            templateUrl:'public/app/views/pages/users/login.html'
        })
        .when('/',{
            templateUrl:'public/app/views/pages/home.html'
        })
        .when('/ReservationManager',{
        templateUrl:'public/app/views/pages/reservations/ReservationManager.html',
            controller: 'reservationCtrl'

        })
        .when('/updateReservationInputPage',{
            templateUrl:'public/app/views/pages/reservations/updateReservationInputPage.html',
            controller: 'reservationCtrl'
        })
        .when('/register',{
            templateUrl:'public/app/views/pages/users/register.html',
            controller: 'regCtrl',
            controllerAs: 'register'
        })
        .otherwise({redirectTo:'/'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
});
