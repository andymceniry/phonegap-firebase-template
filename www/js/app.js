/*global $*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.init = function () {
        console.log('initialising app');

        if (oApp.phonegapAvailable) {
            $('#divPhonegapReg').html('Phonegap is now ready to use :-)');
            console.log('phonegap loaded');
        } else {
            $('#divPhonegapReg').html('Phonegap is not available :-(');
            console.log('no phonegap');
        }

        $('#divTests').removeClass('hide');

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

}());
