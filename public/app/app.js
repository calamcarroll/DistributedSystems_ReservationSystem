angular.module('ReservationApp', ['appRoutes', 'userControllers', 'userServices','loginController','authServices', 'reservationController', 'UpdateReservationController'])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authIntercept');// configuring the application to intercept all http requests with the authInterceptors function
});