/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.storage.name = 'phonegap-firebase-template';

    oApp.configs.app = {
        startPage: 'home',
        splashFadeSpeed: 500,
        splashShowLength: 2000
    };

    oApp.configs.fb = {
        apiKey: 'AIzaSyCVpw804Nrmyn6N8idPnqVWtBK5b0wvBZ8',
        authDomain: 'phonegap-firebase-template.firebaseapp.com',
        databaseURL: 'https://phonegap-firebase-template.firebaseio.com',
        storageBucket: 'gs://phonegap-firebase-template.appspot.com',
        messagingSenderId: '534493340673'
    };

    oApp.configs.gapi = {
        client_id: '499750290208-hh5hd6dr5bpdmiii9f152qv2ofiph7f8.apps.googleusercontent.com',
        client_secret: '25gBMgoXkBYy97mcPVmV-JlP',
        scope: 'profile email'
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

        case 'database-read':

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
            oApp.openLog();

            break;

        }

    };

    oApp.pgfb.runTest = function (test) {

        switch (test) {

        case 'authentication-signin-google':
            oApp.pgfb.googleSignIn();
            break;

        }

    };

    oApp.runTest = function (test) {

        switch (test) {

        case 'browser-location':
            console.log(location);
            oApp.openLog();
            break;

        case 'browser-navigator':
            console.log(navigator);
            oApp.openLog();
            break;

        }

    };

    $('ul#divTests li span').click(function () {

        var el = $(this),
            type = el.data('type'),
            item = el.data('item'),
            groupName = type + ': ' + item.split('-').join(' ');

        console.clear();
        console.groupCollapsed(groupName);

        switch (type) {

        case 'pg':
            oApp.pg.runTest(item);
            break;

        case 'fb':
            oApp.fb.runTest(item);
            break;

        case 'pgfb':
            oApp.pgfb.runTest(item);
            break;

        case 'misc':
            oApp.runTest(item);
            break;

        }

    });

}());