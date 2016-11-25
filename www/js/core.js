/*global $*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    $('#log').click(function () {
        $(this).toggleClass('open');
    });

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


}());