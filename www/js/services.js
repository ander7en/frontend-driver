angular.module('app.services', ['app.env'])

.factory('PusherFactory', function ($window) {
    if (!$window.Pusher) {
        // some useful logic here if Pusher.js script isn't loaded from url
        console.log("couldn't load pusher.js library")
    } else {
        return $window.Pusher;
    }
})
.service('BackendService', function (ENV, PusherFactory) {
    var self = this;
    self.api_url = ENV.API_URL + '/driver';
    var pusherUsedId;
    var channel;

    init();

    this.uuid = uuid;

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
    };

    function init() {
        PusherFactory.logToConsole = ENV.debug;
        pusherUserId = uuid();
        var pusher = new PusherFactory('cad5312b266942c7cf7d', {
            cluster: 'eu',
            encrypted: true
        });
        channel = pusher.subscribe(pusherUserId + '_channel');
        channel.bind('update', function (data) {
            console.log("Receive update event with data:");
            console.log(data);
            $rootScope.$apply();
        });
    }
});