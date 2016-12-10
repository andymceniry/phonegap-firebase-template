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
        }

        oApp.waitForSplashEndThenShowStartPage();

    };

    oApp.getAndSetDefaultStorageObject = function () {

        var obj = {
            id: (new Date()).getTime()
        };

        oApp.storage.set(oApp.storage.name, obj);

        return obj;

    };

    oApp.handleConfirmSignOut = function (button) {
        console.log(button);
        switch(button) {
        case 1:
            var task = oApp.fb.auth.signout();
            oApp.showPage('signin');
            oApp.outputTestResults(task);
            break;
        }
    };

}());
