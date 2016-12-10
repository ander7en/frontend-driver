angular.module('app.controllers', ['app.services'])
  
.controller('loginCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, localStorageService, BackendService) {
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

    $scope.submit = function (form) {
        if (form.$valid) {
            if (!localStorageService.isSupported) {
                $scope.login = "UNSUPPORTED";
            } else {
                localStorageService.set('email', $scope.credentials.email)
            }
            BackendService.login($scope.credentials);
        } else {
            console.log("Form is not valid");
        }
    };
})
   
.controller('signupCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, localStorageService, BackendService) {
    var self = this;
    $scope.fullNamePattern = new RegExp('[A-Za-z\-]+\\s+[A-Za-z\-]+');
    $scope.pricePattern = new RegExp('\\d+\\.?\\d{0,2}');
    $scope.registrationInfo = {};
    $scope.registrationInfo.fullName = undefined;
    $scope.registrationInfo.carInfo = undefined;
    $scope.registrationInfo.pricePerKm = undefined;
    $scope.registrationInfo.email = undefined;
    $scope.registrationInfo.password = undefined;

    $scope.submit = function (regForm) {
        if (regForm.$valid) {
            BackendService.signup($scope.registrationInfo);
        }
    };

})
    
.controller('waitingScreenCtrl', ['$scope', '$stateParams', 'BackendService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 