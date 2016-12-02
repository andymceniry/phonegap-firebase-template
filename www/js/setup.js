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
        oApp.fb.dbo = firebase.database();
    };


    oApp.pg.runTest = function (test) {

        var task = null;

        switch (test) {

        case 'connection':
            task = oApp.pg.connection.getDetails();
            oApp.outputTestResults(task, true);
            break;

        case 'geolocation-short':
            task = oApp.pg.geolocation.getCurrentPosition(false);
            oApp.outputTestResults(task, true);
            break;

        case 'geolocation-full':
            task = oApp.pg.geolocation.getCurrentPosition();
            oApp.outputTestResults(task, true);
            break;

        case 'camera-photo':
        case 'camera-gallery':
            oApp.pg.camera.getPicture(test === 'camera-photo')
                .done(function (imageData) {
                    $('#testCameraOutput').removeClass('hide').attr('src', 'data:image/jpeg;base64,' + imageData);
                })
                .fail(function (error) {
                    console.log(error);
                });
            break;

        }

    };

    oApp.fb.runTest = function (test) {

        var ts = (new Date()).getTime(),
            callback,
            data,
            email,
            password,
            response,
            task,
            string;

        switch (test) {

        case 'authentication-register-password':
            email = prompt('Enter email');
            if (email == '' || email == null) {
                return false;
            }
            password = prompt('Enter password');
            if (password == '' || password == null) {
                return false;
            }
            task = oApp.fb.auth.register.password(email, password);
            oApp.outputTestResults(task, true);
            break;

        case 'authentication-signin-password':
            email = prompt('Enter email');
            if (email == '' || email == null) {
                return false;
            }
            password = prompt('Enter password');
            if (password == '' || password == null) {
                return false;
            }
            task = oApp.fb.auth.signin.password(email, password);
            oApp.outputTestResults(task, true);
            break;

        case 'authentication-signout':
            response = confirm('Sign out - Are you sure?');
            if (response !== true) {
                return false;
            }

            task = oApp.fb.auth.signout();
            oApp.outputTestResults(task);
            break;

        case 'storage-string':
            string = prompt('Enter some content for file');
            if (string == '' || string == null) {
                return false;
            }
            task = oApp.fb.storage.putString(ts + '.txt', string);
            oApp.outputTestResults(task);

            break;

        case 'storage-image':
            oApp.pg.camera.getPicture(false)
                .done(function (imageData) {
                    task = oApp.fb.storeBase64(ts + '.jpg', imageData);
                    oApp.outputTestResults(task);
                })
                .fail(function (error) {
                    console.log(error);
                });
            break;

        case 'database-write':
            string = prompt('Enter a message to store');
            if (string == '' || string == null) {
                return false;
            }

            data = {
                id: firebase.auth().currentUser.uid,
                ts: (new Date()).getTime(),
                message: string
            };

            oApp.fb.db.addToList('messages/', data);

            break;

        case 'database-view':

            callback = function (data) {
                var i,
                    items = data.val();

            console.clear();
            console.groupCollapsed('Messages');

                for (i in items) {
                    if (items.hasOwnProperty(i)) {
                        console.log(oApp.php.date('d.m.y @ H:i:s', items[i].ts / 1000) + ': ' + items[i].message);
                    }
                }
            };

            oApp.fb.db.viewList('messages/', callback);

            break;

        }

    };

    oApp.pgfb.runTest = function (test) {

        var task = null;

        switch (test) {

        case 'authentication-signin-google':
            task = oApp.pgfb.googleSignIn();
            oApp.outputTestResults(task, true);
            break;

        }

    };

}());