angular.module('authServices',[])

    .factory('Auth', function($http, AuthToken) {
        var authFactory = {};
        var app = this;

        authFactory.login = function (loginData) {
            return $http.post('/api/authenticate', loginData).then(function(data){
                AuthToken.setToken(data.data.token);
                return data;
            })
        };
        //checks if the user is logged in
        authFactory.isLoggedIn = function(){
            if(AuthToken.getToken()){
                return true;
            }else{
                return false;
            }
        };
        authFactory.getUser = function () {///gets the user information from the token that has now been decrypted
            if(AuthToken.getToken()){
                return $http.post('api/currentUser')
            }else{
                $q.reject({message: 'No token for this user'})// angular method that rejects a response
            }
        };
        authFactory.logout = function(){
            AuthToken.setToken();
            //sets the token to nothing
        };
        authFactory.getAllUsers = function(){
          return $http.get('Api/getUsers').then(function(users){
              return users;

          })
        };
        authFactory.getUsersToBeAdmin = function () {
            return $http.get('Api/users/isAdmin').then(function (users) {
                return users;
            })
        };
        authFactory.makeAdmin = function (id) {
            return $http.put('Api/makeAdmin/' + id);
        };
        authFactory.delete = function(id){
            return $http.delete('Api/deleteUser/' + id)
        };
        return authFactory;
    })

.factory('AuthToken', function($window){
    var authTokenFactory = {};

    authTokenFactory.setToken = function (token) {
        if(token){
            //when envoken it will add the token to the browsers header or local storage
            $window.localStorage.setItem('token',token);

        }else{
            $window.localStorage.removeItem('token');
        }

    };
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    };
    return authTokenFactory;
})
.factory('authIntercept',function (AuthToken) {//attaches the token to every request
    var authInterceptFactory = {};

    authInterceptFactory.request = function (config) {
        var token = AuthToken.getToken();
        //assigns tokens to the headers so that it can be grabbed at the front end
        if(token) config.headers['x-access-token'] = token;
        return config;
    };
    return authInterceptFactory;
});
