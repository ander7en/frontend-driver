angular.module('app.controllers', [])
  
.controller('loginCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, localStorageService) {
    var self = this;
    $scope.credentials = { email: undefined, password: undefined };

    init();
    function init() {
        if (!localStorageService.isSupported) {
            $scope.login = "UNSUPPORTED";
        } else if (localStorageService.get('email') != undefined) {
            $scope.credentials.email = localStorageService.get('email');
        }
    }

    $scope.submit = function () {
        if (!localStorageService.isSupported) {
            $scope.login = "UNSUPPORTED";
        } else {
            localStorageService.set('email', $scope.credentials.email)
        }
    };
})
   
.controller('signupCtrl', ['$scope', '$stateParams', 'BackendService',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, localStorageService) {
    var self = this;
    $scope.fullName = undefined;
    $scope.carInfo = undefined;
    $scope.email = undefined;
    $scope.password = undefined;

    $scope.submit = function () {
        
    };

}])
   
.controller('waitingScreenCtrl', ['$scope', '$stateParams', 'BackendService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 