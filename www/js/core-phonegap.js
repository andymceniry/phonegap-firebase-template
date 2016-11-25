/*global $, Connection*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.pg = oApp.pg || {};

    oApp.pg.runTest = function (test) {

        switch (test) {

        case 'connection':
            oApp.pg.connection.getDetails()
                .done(function (connection) {
                    console.log(connection);
                })
                .fail(function (error) {
                    console.log(error);
                });
            break;

        case 'geolocation-short':
            oApp.pg.geolocation.getCurrentPosition(false).done(function (latlng) {
                console.log(latlng);
            });
            break;

        case 'geolocation-full':
            oApp.pg.geolocation.getCurrentPosition().done(function (response) {
                console.log(response);
            });
            break;

        }

    };

    oApp.pg.geolocation = oApp.pg.geolocation || {};

    oApp.pg.geolocation.getCurrentPosition = function (allData, decimalPlaces) {

        allData = allData !== false;
        decimalPlaces = decimalPlaces || 4;

        var obj = {
            dfd: $.Deferred(),
            success: function (position) {
                if (allData === false) {
                    obj.dfd.resolve({latitude: position.coords.latitude.toFixed(decimalPlaces), longitude: position.coords.longitude.toFixed(decimalPlaces)});
                } else {
                    obj.dfd.resolve(position);
                }
            },
            error: function (error) {
                obj.dfd.reject(error);
            }
        };

        navigator.geolocation.getCurrentPosition(obj.success, obj.error);

        return obj.dfd.promise();
    };

    oApp.pg.connection = oApp.pg.connection || {};

    oApp.pg.connection.getDetails = function () {

        var dfd = $.Deferred(),
            networkState,
            states;

        if (navigator === undefined) {
            dfd.reject('navigator === undefined');
            return dfd.promise();
        }

        if (navigator.connection === undefined) {
            dfd.reject('navigator.connection === undefined');
            return dfd.promise();
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

        dfd.resolve('Connection type: ' + states[networkState]);

        return dfd.promise();

    };

}());