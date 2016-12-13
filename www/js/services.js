angular.module('app.services', ['app.env', 'ngCordova'])

.factory('PusherFactory', function ($window) {
    if (!$window.Pusher) {
        // some useful logic here if Pusher.js script isn't loaded from url
        console.log("couldn't load pusher.js library")
    } else {
        return $window.Pusher;
    }
})
.service('GeolocationService', function($cordovaGeolocation){
    var self = this;
    self.currentLocation = { lng: undefined, lat: undefined };
    var posOptions = {timeout: 10000, enableHighAccuracy: true};

    self.getCurrentLocation = getCurrentLocation;

    function getCurrentLocation() {
        return $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            self.currentLocation.lat = position.coords.latitude;
            self.currentLocation.lng = position.coords.longitude;
        }, function (err) {
            console.log(err);
        });
    }

})
.service('BackendService', function (ENV, $rootScope, PusherFactory, $http, $ionicLoading, $ionicHistory,
                                     $state, GeolocationService, $ionicPopup) {
    var self = this;
    self.api_url = ENV.API_URL + '/drivers';
    var pusherUserId;
    var channel;
    var driverId;
    var orderId;
    self.currentUser = {loggedIn: false, acceptingOrders: false, credentials: {email: undefined, password: undefined}};
    init();

    self.uuid = uuid;
    self.signup = register;
    self.login = login;
    self.changeStatus = changeStatus;
    self.logout = logout;
    self.finish = finish;


    function uuid() {
        var lut = [];

        for (var i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }

        var uuid = function () {
            var d0 = Math.random() * 0xffffffff | 0;
            var d1 = Math.random() * 0xffffffff | 0;
            var d2 = Math.random() * 0xffffffff | 0;
            var d3 = Math.random() * 0xffffffff | 0;
            return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
              lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
              lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
              lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
        };

        return uuid();
    }

    function init() {
        PusherFactory.logToConsole = ENV.debug;
        pusherUserId = uuid();
        var pusher = new PusherFactory('cad5312b266942c7cf7d', {
            cluster: 'eu',
            encrypted: true
        });
        channel = pusher.subscribe(pusherUserId + '_channel');
        channel.bind('notify', function (data) {
			console.log(data);
            $ionicPopup.confirm({
                title: 'Accept order',
                template: 'Source address: ' + data.OrderInfo.source_address
                + '<br>Destination address: ' + data.OrderInfo.destination_address,
                cancelText: 'Reject',
                cancelType: 'button-assertive',
                okText: 'Accept',
                okType: 'button-balanced'
            }).then(function (res) {
                var postData = {};
                if (res) {
                  $rootScope.ride.active = true;
                }
                orderId = data.OrderId;
                postData.driver_id = driverId;
                postData.response = res;
                postData.order_id = data.OrderId;
                $http.post(self.api_url + '/response', postData)
            })
        });
    }

    function finish(){
      $rootScope.ride.active = false;
      postData = {orderId: orderId};
      return $http.post(self.api_url + '/finish', postData)
    }

    function register(regData) {
        var postData = {};
        angular.copy(regData, postData);
        var fullName = regData.fullName.split(/\s+/g);
        postData.first_name = fullName[0];
        postData.last_name = fullName[1];
        delete postData.fullName;

        $http.post(self.api_url + '/register_driver', postData).then(function (response) {
          if (response.data.text == 'Success') {
            $ionicHistory.nextViewOptions({disableBack: true});
            $state.go('login');
          } else {
            $ionicPopup.alert({
              title: 'Error :(',
              template: response.data.text
            })
          }
        }, function (response) {
          $ionicPopup.alert({
            title: 'Error :(',
            template: 'Something went wrong :('
          })
        });
    }

    function login(loginData) {
        $ionicLoading.show({
            templateUrl: '/templates/logginIn.html'
        })
        var postData = {};
        angular.copy(loginData, postData);
        postData.channelId = pusherUserId;
        $http.post(self.api_url + '/login', postData).then(function (response) {
            $ionicLoading.hide();
            $state.go('waitingScreen');
            self.currentUser.loggedIn = true;
            self.currentUser.credentials = loginData;
            driverId = response.data.text;
        }, function (response) {
            $ionicLoading.show({
                template: 'Error. Something went wrong :(',
                duration: 2000
            });
            console.log(response);
        })
    }

    function changeStatus(status) {
        self.currentUser.acceptingOrders = status;
        var postData = {};
        postData.driverId = driverId;
        postData.status = self.currentUser.acceptingOrders;
        if (status) {
            postData.currentLocation = GeolocationService.currentLocation;
        }
        $http.post(self.api_url + '/change_status', postData)
    }

    function logout() {
        if (self.currentUser.loggedIn) {
            var postData = {driver_id: driverId};
            $http.post(self.api_url + '/logout', postData);
        }
    }
});
