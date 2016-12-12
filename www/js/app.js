/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.app = {};

    oApp.init.app = function () {
        console.log('initialising app');

        if (oApp.core.pgActive) {
            $('#divPhonegapReg').html('Phonegap is now ready to use :-)');
            console.log('phonegap loaded');
        } else {
            $('#divPhonegapReg').html('Phonegap is not available :-(');
        }

        oApp.core.waitForSplashEndThenShowStartPage();

    };

    oApp.pg.runTest = function (test) {

        var task = null;

        switch (test) {

        case 'compass':
            task = oApp.pg.compass.getDetails();
            oApp.app.outputTestResults(task, true);
            break;

        case 'connection':
            task = oApp.pg.connection.getDetails();
            oApp.app.outputTestResults(task, true);
            break;

        case 'device':
            task = oApp.pg.device.getDetails();
            oApp.app.outputTestResults(task, true);
            break;

        case 'geolocation-short':
            task = oApp.pg.geolocation.getCurrentPosition(false);
            oApp.app.outputTestResults(task, true);
            break;

        case 'geolocation-full':
            task = oApp.pg.geolocation.getCurrentPosition();
            oApp.app.outputTestResults(task, true);
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

        var callback,
            data,
            email,
            password,
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
            oApp.app.outputTestResults(task, true);
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
            oApp.app.outputTestResults(task, true);
            break;

        case 'authentication-signout':
            oApp.core.confirm('Sign out - Are you sure?', oApp.app.handleConfirmSignOut);
            break;

        case 'storage-string':
            string = prompt('Enter some content for file');
            if (string == '' || string == null) {
                return false;
            }
            task = oApp.fb.storage.string(oApp.timers.ts() + '.txt', string);
            oApp.app.outputTestResults(task);

            break;

        case 'storage-photo':
            oApp.pg.camera.getPicture()
                .done(function (data) {
                    task = oApp.fb.storage.image(oApp.timers.ts() + '.jpg', data);
                    oApp.app.outputTestResults(task);
                })
                .fail(function (error) {
                    console.log(error);
                });
            break;

        case 'storage-gallery':
            oApp.pg.camera.getPicture(false)
                .done(function (data) {
                    if (data.extension !== undefined) {
                        task = oApp.fb.storage.image(oApp.timers.ts() + '.' + data.extension, data.base64);
                    } else {
                        task = oApp.fb.storage.image(oApp.timers.ts() + '.jpg', data);
                    }
                    oApp.app.outputTestResults(task);
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
                ts: oApp.timers.ts(),
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
                        console.log(oApp.core.php.date('d.m.y @ H:i:s', items[i].ts / 1000) + ': ' + items[i].message);
                    }
                }
            };

            oApp.fb.db.viewList('messages/', callback);
            oApp.core.console.open();

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

    oApp.app.runTest = function (test) {

        switch (test) {

        case 'browser-location':
            console.log(location);
            oApp.core.console.open();
            break;

        case 'browser-navigator':
            console.log(navigator);
            oApp.core.console.open();
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
            oApp.app.runTest(item);
            break;

        }

    });

    oApp.app.outputTestResults = function (test, autoShow) {

        autoShow = autoShow === true;

        test
            .done(function (success) {
                console.log(success);
            })
            .fail(function (error) {
                console.log(error);
            });

        if (autoShow) {
            oApp.core.console.open();
        }
    };

    oApp.app.handleConfirmSignOut = function (button) {
        switch (button) {
        case 1:
            oApp.fb.auth.signout();
            oApp.core.showPage('signin');
            break;
        }
    };

}());
