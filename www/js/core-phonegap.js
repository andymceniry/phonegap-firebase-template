/*global $, Camera, Connection*/
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
            oApp.pg.geolocation.getCurrentPosition(false)
                .done(function (latlng) {
                    console.log(latlng);
                })
                .fail(function (error) {
                    console.log(error);
                });
            break;

        case 'geolocation-full':
            oApp.pg.geolocation.getCurrentPosition()
                .done(function (response) {
                    console.log(response);
                })
                .fail(function (error) {
                    console.log(error);
                });
            break;

        case 'photo-camera':
        case 'photo-gallery':
            oApp.pg.camera.getPicture(test === 'photo-camera')
                .done(function (imageData) {
                    $('#testCameraOutput').removeClass('hide').attr('src', 'data:image/jpeg;base64,' + imageData);
                    oApp.fb.storeBase64('images/avatars/' + oApp.ls.id + '.jpg', imageData);
                })
                .fail(function (error) {
                    console.log(error);
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


    oApp.pg.camera = oApp.pg.camera || {};

    oApp.pg.camera.getPicture = function (camera) {

        camera = camera !== false;

        var obj = {
            dfd: $.Deferred(),
            success: function (imageURI) {
                obj.dfd.resolve(imageURI);
            },
            error: function (error) {
                obj.dfd.reject(error);
            }
        };

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

}());