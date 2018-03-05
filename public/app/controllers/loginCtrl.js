angular.module('loginController',['authServices'])
.controller('loginCtrl',function(Auth,$timeout,$location,$rootScope,$scope,$window){
    var app = this;

    $rootScope.$on('$routeChangeStart', function(){// any time a route changes or a new view is made it does whats inside the brackets
        if(Auth.isLoggedIn()){
            Auth.getUser().then(function(data){
                app.username = data.data.username;
                app.userId = data.data._id;
                app.isAdmin = data.data.isAdmin;
                app.isLoggedIn = true;

            })
        }else{
            app.isLoggedIn = false;
            app.username = '';
        }
    });

    this.getAllUsers = function(){
        Auth.getAllUsers().then(function(data){
            $scope.userList = data.data;
        })
    };
    this.usersToBeAdmin = function(){
       Auth.getUsersToBeAdmin().then(function (data) {
           console.log(data.data);
           $scope.userAdminList = data.data;
       })

    };
    this.deleteUser = function(id){
        Auth.delete(id).then(function(){
            $timeout(function () {
                $location.path('/AdminHome');
            },2000)
        })
    };
    this.makeAdmin = function(id){
        Auth.makeAdmin(id).then(function(){
            $timeout(function () {
                $location.path('/AdminHome');
            },2000)
        })
    };

    this.doLogin = function(loginData) {
        app.errorMsg = false;
        Auth.login(app.loginData).then(function(data) {
            if (data.data.success){
                // Create Success Msg
                app.successMsg = data.data.message + ' Redirecting.';
                // Redirect to Home Page
                $timeout(function() {
                    $location.path('/loadUserReservations');
                    // Removing the login data and the success message from the login page when someone logs in.
                    app.loginData = '';
                    app.successMsg = false;
                }, 2000);
            } else {
                // Creating Error Msg
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };
    // User presses log out and uses Auth.logout to remove the token.
    this.logout = function () {
        Auth.logout();
        // Redirecting the user back to the home page.
        $timeout(function() {
            $location.path('/');
            app.isAdmin=false;
        }, 2000);
    };
});