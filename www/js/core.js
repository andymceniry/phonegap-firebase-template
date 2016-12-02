/*global $, gapi*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    $('#log').click(function () {
        $(this).toggleClass('open');
    });

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
            $('#log').addClass('open');
        }
    };

    $('ul#divTests li').click(function () {

        var el = $(this),
            type = el.data('type'),
            item = el.data('item'),
            groupName = type + ': ' + item.split('-').join(' ');

        console.clear();
        console.groupCollapsed(groupName);

        switch (type) {

        case 'phonegap':
            oApp.pg.runTest(item);
            break;

        case 'firebase':
            oApp.fb.runTest(item);
            break;

        }

    });

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




    oApp.isUserEqual = function (googleUser, firebaseUser) {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData,
                i;

            for (i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID && providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    return true;
                }
            }
        }
        return false;
    };

    oApp.onSignIns = function (googleUser) {
        console.groupCollapsed('Google Auth Response');
        console.log(googleUser);
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            if (!oApp.isUserEqual(googleUser, firebaseUser)) {
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.getAuthResponse().id_token
                );
                firebase.auth().signInWithCredential(credential)
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                console.log('User already signed-in Firebase.');
            }
        });
    };

    oApp.signOut = function () {
        console.log('signOut');
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    };

}());

