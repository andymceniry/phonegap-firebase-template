/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

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

    };

    oApp.initFirebase = function () {

        var config = {
            apiKey: "AIzaSyBpnArTxWPmqfAkAETrZD6GCLCohFFNH6Y",
            authDomain: "fir-test-f461d.firebaseapp.com",
            databaseURL: "https://fir-test-f461d.firebaseio.com",
            storageBucket: "fir-test-f461d.appspot.com",
            messagingSenderId: "584262174821"
        };

        console.groupCollapsed('Firebase setup');
        console.log(config);
        console.log('version: ' + firebase.SDK_VERSION);
        console.groupEnd('Firebase setup');

        firebase.initializeApp(config);

    };

}());