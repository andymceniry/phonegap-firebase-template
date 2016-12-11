/*global $, Camera, Connection*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.pg = oApp.pg || {
        camera: {},
        connection: {},
        compass: {},
        device: {},
        geolocation: {}
    };

    oApp.pg.geolocation.getCurrentPosition = function (allData, decimalPlaces) {

        var obj = oApp.deferred.getDefaultObject();

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

        var obj = oApp.deferred.getDefaultObject(),
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

        oApp.core.readURLTempObject = oApp.deferred.getDefaultObject();

        if (navigator.camera === undefined) {
            $('body').append('<input id="lofou" type="file" onchange="var k = oApp.core.getImageDataFromFileReader(this, oApp.core.readURLTempObject); " accept="image/gif, image/jpeg, image/jpg, image/png" />');
            $('#lofou').trigger('click').remove();
            //oApp.core.readURLTempObject.dfd.reject('navigator.camera === undefined');
            return oApp.core.readURLTempObject.dfd.promise();
        }

        oApp.core.readURLTempObject.options = {
            sourceType: camera ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.DATA_URL
        };

        navigator.camera.getPicture(oApp.core.readURLTempObject.success, oApp.core.readURLTempObject.error, oApp.core.readURLTempObject.options);

        return oApp.core.readURLTempObject.dfd.promise();
    };

    oApp.pg.backbutton = function () {
        var r = confirm('Back button pressed; Are you sure you want to exit?');
        if (r == true) {
            navigator.app.exitApp();
        }
        console.log('ignoring back button press');
    };

    oApp.pg.menubutton = function () {
        console.log('menu button pressed');
    };

    oApp.pg.device.getDetails = function () {

        var obj = oApp.deferred.getDefaultObject();

        if (window.device === undefined) {
            obj.dfd.reject('window.device === undefined');
        } else {
            obj.dfd.resolve(window.device);
        }

        return obj.dfd.promise();

    };

}());