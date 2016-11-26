/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.storage.name = 'phonegap-firebase-template';

    oApp.initApp = function (phonegapAvailable) {

        oApp.phonegapAvailable = phonegapAvailable !== false;

        //  if we are in phonegap then show on-screen logging else remove the div
        if (oApp.phonegapAvailable === false) {
            $('#log').remove();
            $('#divPhonegapReg').html('Phonegap is not available :-(');
            console.log('no phonegap');
        } else {
            oApp.initLogger();  //  we are in the app so override the console
            $('#log').removeClass('hide');
            $('#divPhonegapReg').html('Phonegap is now ready to use :-)');
            console.log('phonegap loaded');
        }

        $('#divTests').removeClass('hide');
        oApp.initFirebase();
        oApp.init();
    };

    oApp.initFirebase = function () {

        var config = {
            apiKey: "AIzaSyCVpw804Nrmyn6N8idPnqVWtBK5b0wvBZ8",
            authDomain: "phonegap-firebase-template.firebaseapp.com",
            databaseURL: "https://phonegap-firebase-template.firebaseio.com",
            storageBucket: "gs://phonegap-firebase-template.appspot.com",
            messagingSenderId: "534493340673"
        };

        console.groupCollapsed('Firebase setup');
        console.log(config);
        console.log('version: ' + firebase.SDK_VERSION);
        console.groupEnd('Firebase setup');

        firebase.initializeApp(config);
        oApp.fb.auth.setUpListener();
    };

}());