/*global $*/
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
                item;

            for (i = 0; i < j; i++) {

                item = arguments[i];

                switch (typeof item) {
                case 'string':
                    $('#log').append(item);
                    break;
                case 'object':
                    var json = JSON.stringify(item);
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
            item = el.data('item');

        console.clear();
        console.log('> test "' + type + ' ' + item + '"');

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

}());