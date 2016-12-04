/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.configs = {};

    oApp.storage = {};

    oApp.storage.set = function (key, value, session) {

        if (key === undefined) {
            console.warn('Need to specify a key to store');
            return false;
        }
        if (value === undefined) {
            console.warn('Need to specify a value to store');
            return false;
        }

        if (session === true) {
            sessionStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
        return true;

    };

    oApp.storage.get = function (key, session) {

        var value;

        if (key === undefined) {
            console.warn('Need to specify a storage key to retrieve');
            return false;
        }

        if (session === true) {
            value = sessionStorage.getItem(key, JSON.stringify(value));
        } else {
            value = localStorage.getItem(key, JSON.stringify(value));
        }

        if (value === undefined || value === null) {
            return false;
        }
        return JSON.parse(value);

    };

    oApp.initLogger = function () {
        console.log = function () {

            var i,
                j = arguments.length,
                item,
                json;

            for (i = 0; i < j; i++) {

                item = arguments[i];

                switch (typeof item) {
                case 'string':
                    $('#log').append(item);
                    break;
                case 'object':
                    json = JSON.stringify(item);
                    json = json.substr(1, json.length - 2);
                    json = json.split(',"').join('<br/>"');
                    json = json.split('":').join('" : ');
                    $('#log').append(json);
                    break;
                default:
                    $('#log').append(typeof item);
                    break;
                }

                $('#log').append('<br/>');

            }
        };

        console.clear = function () {
            $('#log').html('');
        };

        console.groupCollapsed = function (groupName) {
            $('#log').append('<span class="groupName">' + groupName + '</span><br/>');
        };

    };

    $('#logTrigger').click(function () {
        oApp.openLog();
    });

    $('#log').click(function () {
        $('#log').animate({opacity: 0, height: 0}, 250);
        $('#logTrigger').animate({opacity: 1}, 250);
    });

	$('#burger').click(function () {
		$(this).add('#menu').toggleClass('open');
	});

    oApp.setDeviceWidth = function () {
        var sheet = document.styleSheets[1],
            rules = sheet.hasOwnProperty('cssRules') ? sheet.cssRules : sheet.rules;
        rules[0].style.width = $(window).width() + 'px';
        rules[1].style.left = ($(window).width() * -1) + 'px';
    };

    oApp.openLog = function () {
        $('#log').animate({opacity: 1, height: '100%'}, 250);
        $('#logTrigger').animate({opacity: 0}, 250);
    };

    oApp.initPGFB = function (phonegapAvailable) {

        oApp.phonegapAvailable = phonegapAvailable !== false;

        //  if we are in phonegap then show on-screen logging else remove the div
        if (oApp.phonegapAvailable !== false) {
            $('#log').add('#logTrigger').remove();
        } else {
            oApp.initLogger();  //  we are in the app so override the console
            $('#log').add('#logTrigger').removeClass('hide');
        }

        $('#menu').removeClass('hide');

        $(window).resize(function () {
            oApp.setDeviceWidth();
        });
        oApp.setDeviceWidth();

        oApp.initPhonegap();
        oApp.initFirebase();
        oApp.init();

    };

    oApp.initPhonegap = function () {
        console.log('Phonegap setup');
        document.addEventListener('backbutton', oApp.pg.backbutton, false);
    };

    oApp.initFirebase = function () {
        console.groupCollapsed('Firebase setup');
        console.log(oApp.configs.fb);
        console.log('version: ' + firebase.SDK_VERSION);
        console.groupEnd('Firebase setup');

        firebase.initializeApp(oApp.configs.fb);
        oApp.fb.auth.setUpListener();
        oApp.fb.dbo = firebase.database();
    };

    oApp.getDefaultTestObject = function () {

        var defaultObj = {};

        defaultObj.dfd = $.Deferred();

        defaultObj.success = function (success) {
            defaultObj.dfd.resolve(success);
        };

        defaultObj.error = function (error) {
            defaultObj.dfd.reject(error);
        };

        return defaultObj;

    };

    oApp.outputTestResults = function (test, autoShow) {

        autoShow = autoShow === true;

        test
            .done(function (success) {
                console.log(success);
            })
            .fail(function (error) {
                console.log(error);
            });

        if (autoShow) {
            oApp.openLog();
        }
    };

    $('body').on('click', '.jsClickToHide', function () {
        $(this).addClass('hide');
    });

    oApp.handleAuthChange = function (user) {
        console.groupEnd();

        if (user) {
            console.groupCollapsed('User: ' + user.email);
            console.log(oApp.getEssentialUserData(user));
            console.groupEnd('User');
        } else {
            console.log('User: Nobody is signed in');
        }

    };

    oApp.getEssentialUserData = function (user) {

        return {
            'email': user.email,
            'name': user.displayName,
            'photoUrl': user.photoURL,
            'uid': user.uid
        };

    };

}());

