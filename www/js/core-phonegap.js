/*global $, Camera, Connection*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.pg = oApp.pg || {
        camera: {},
        connection: {},
        geolocation: {}
    };

    oApp.pg.geolocation.getCurrentPosition = function (allData, decimalPlaces) {

        var obj = oApp.getDefaultTestObject();

        obj.allData = allData !== false;
        obj.decimalPlaces = decimalPlaces || 4;

        obj.success = function (position) {
            if (obj.allData === false) {
                obj.dfd.resolve({latitude: position.coords.latitude.toFixed(obj.decimalPlaces), longitude: position.coords.longitude.toFixed(obj.decimalPlaces)});
            } else {
                obj.dfd.resolve($.extend({}, position.coords));
            }
        };

        navigator.geolocation.getCurrentPosition(obj.success, obj.error);

        return obj.dfd.promise();
    };

    oApp.pg.connection.getDetails = function () {

        var obj = oApp.getDefaultTestObject(),
            networkState,
            states;

        if (navigator.connection === undefined) {
            obj.dfd.reject('navigator.connection === undefined');
            return obj.dfd.promise();
        }

        networkState = navigator.connection.type;

        states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        obj.dfd.resolve(states[networkState]);

        return obj.dfd.promise();

    };

    oApp.pg.camera.getPicture = function (camera) {

        camera = camera !== false;

        var obj = oApp.getDefaultTestObject();

        if (navigator.camera === undefined) {
            obj.dfd.reject('navigator.camera === undefined');
            return obj.dfd.promise();
        }

        obj.options = {
            sourceType: camera ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.DATA_URL
        };

        navigator.camera.getPicture(obj.success, obj.error, obj.options);

        return obj.dfd.promise();
    };

    oApp.pg.backbutton = function () {
        var r = confirm('Back button pressed; shall I ignore this?');
        if (r == true) {
            console.log('ignoring back button press');
            return false;
        }
    };

    document.addEventListener('backbutton', oApp.pg.backbutton, false);

}());