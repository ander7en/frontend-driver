angular.module('app.controllers', [])
  
.controller('loginCtrl', ['$scope', '$stateParams', 'BackendService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    var self = this;
    $scope.login = undefined;
    $scope.password = undefined;

    $scope.submit = function () {
        
    };
}])
   
.controller('signupCtrl', ['$scope', '$stateParams', 'BackendService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('waitingScreenCtrl', ['$scope', '$stateParams', 'BackendService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 