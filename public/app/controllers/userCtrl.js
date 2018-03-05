angular.module('userControllers',['userServices'])
.controller('regCtrl', function($http,$location, $timeout,User){
    var app = this;// this allows for data variable to be accessed outside of this scope
  app.regUser = function(regData){
      app.error = false;
      User.create(this.regData).then(function (data) {
          if(data.data.success){
             app.Success = data.data.message;
             $timeout(function(){
                 $location.path('/login');
                 app.error = false;
                 app.Success = false
             }, 2000);
          }else{
             app.error = data.data.message;
          }
      })
  }
});