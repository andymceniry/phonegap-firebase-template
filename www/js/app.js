/*global $*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.init = function () {
        console.log('initialising app');

        oApp.ls = oApp.storage.get(oApp.storage.name) || oApp.getAndSetDefaultStorageObject();
        oApp.storage.set(oApp.storage.name, oApp.ls);

    };

    oApp.getAndSetDefaultStorageObject = function () {

        var obj = {
            id: (new Date()).getTime()
        };

        oApp.storage.set(oApp.storage.name, obj);

        return obj;

    };


    var $loginButton = $('#login a');
    var $loginStatus = $('#login p');

    $loginButton.on('click', function() {

    });

}());




