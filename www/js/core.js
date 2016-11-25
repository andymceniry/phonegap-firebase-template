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
                    $('#log').append(JSON.stringify(item));
                    break;
                default:
                    $('#log').append(typeof item);
                    break;
                }

                $('#log').append('<br/>');

            }
        };
    };

    $('ul#divTests li').click(function () {

        var el = $(this),
            type = el.data('type'),
            item = el.data('item');

        console.log('testing: ' + type + ' ' + item);

        switch (type) {

        case 'phonegap':
            oApp.pg.runTest(item);
            break;

        case 'firebase':
            oApp.fb.runTest(item);
            break;

        }

    });

    $('body').on('click', '.jsClickToHide', function() {
        $(this).addClass('hide');
    });

}());