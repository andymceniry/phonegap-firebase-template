/*global $, FileReader, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.config = {};

    oApp.core = {
        code: {},
        console: {}
    };

    oApp.deferred = {};

    oApp.init = {};

    oApp.core.storage = {};

    oApp.timers = {
        intervals: {},
        timeouts: {},
        timestamps: {
            pageLoad: (new Date()).getTime()
        },
        ts: function () {
            return (new Date()).getTime();
        }
    };

    oApp.tmp = {};

    oApp.core.storage.set = function (key, value, session) {

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

    oApp.core.storage.get = function (key, session) {

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

    oApp.core.storage.getAndSetDefaultObject = function () {

        var obj = {
            id: (new Date()).getTime()
        };

        oApp.core.storage.set(oApp.core.storage.name, obj);

        return obj;

    };

    oApp.core.console.init = function () {
        console.log = function () {

            var i,
                j = arguments.length,
                item,
                json;

            for (i = 0; i < j; i++) {

                item = arguments[i];

                switch (typeof item) {
                case 'number':
                case 'string':
                    $('#log').append('<span class="' + typeof item + '">' + item + '</span>');
                    break;
                case 'object':
                    $('#log').append(oApp.core.code.syntaxHighlight(JSON.stringify(item, null, 2)));
                    break;
                case 'objectx':
                    json = JSON.stringify(item);
                    json = json.substr(1, json.length - 2);
                    json = json.split(',"').join('<br/>"');
                    json = json.replace(/"([a-zA-Z0-9]+)":/gm, "<span class='key'>$1</span>:");
                    json = json.replace(/:"([^"]+)"/gm, ": <span class='value'>$1</span>");
                    json = json.replace(/{/gm, " {<br>");
                    json = json.replace(/}/gm, "<br>}");
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

    oApp.core.console.open = function () {
        $('#log').animate({opacity: 1, height: '100%'}, 250);
        $('#logTrigger').animate({opacity: 0}, 250);
    };

    $('#logTrigger').click(function () {
        oApp.core.console.open();
    });

    $('#log').click(function () {
        $('#log').animate({opacity: 0, height: 0}, 250);
        $('#logTrigger').animate({opacity: 1}, 250);
    });

	$('#burger').click(function () {
		$(this).add('#menu').toggleClass('open');
	});

    oApp.core.setDeviceWidth = function () {
        var sheet = document.styleSheets[1],
            rules = sheet.hasOwnProperty('cssRules') ? sheet.cssRules : sheet.rules;
        rules[0].style.width = $(window).width() + 'px';
        rules[1].style.left = ($(window).width() * -1) + 'px';
    };

    oApp.core.showPage = function (id) {

        var currentPageId = $('.jsActivePage').attr('id'),
            page = $('#' + id),
            header = page.data('header');

        if (currentPageId === id) {
            console.warn('page already showing', id);
            return false;
        }

        $('#' + currentPageId)
            .add('header')
            .add('#burger')
            .animate({opacity: 0}, oApp.config.app.splashFadeSpeed);

        setTimeout(
            function () {
                $('#' + currentPageId).removeClass('jsActivePage');
                $('.page').addClass('hide');

                page.css('opacity', 0).removeClass('hide').addClass('jsActivePage').animate({opacity: 1}, oApp.config.app.splashFadeSpeed);
                $('#burger').css('opacity', 0).removeClass('hide').animate({opacity: 1}, oApp.config.app.splashFadeSpeed);
                if (header !== undefined) {
                    $('header').css('opacity', 0).find('h1').html(header);
                    $('header').removeClass('hide').animate({opacity: 1}, oApp.config.app.splashFadeSpeed);
                }

            },
            oApp.config.app.splashFadeSpeed
        );

    };

    oApp.init.pgfb = function (phonegapAvailable) {

        oApp.core.pgActive = phonegapAvailable !== false;

        oApp.core.showPage('splash');
        oApp.timers.timestamps.splashStart = (new Date()).getTime();

        //  if we are in phonegap then show on-screen logging else remove the div
        if (oApp.core.pgActive === false) {
            $('#log').add('#logTrigger').remove();
        } else {
            oApp.core.console.init();  //  we are in the app so override the console
        }

        $('#menu').removeClass('hide');

        $(window).resize(function () {
            oApp.core.setDeviceWidth();
        });
        oApp.core.setDeviceWidth();

        if (oApp.core.pgActive !== false) {
            oApp.init.phonegap();
        } else {
            console.groupCollapsed('Phonegap setup...');
            console.log('phonegap not available');
            console.groupEnd('Phonegap setup...');
        }
        oApp.init.firebase();
        oApp.init.storage();
        oApp.init.app();

    };

    oApp.init.app = function () {
        console.log('initialising app');
        oApp.core.waitForSplashEndThenShowStartPage();
    };

    oApp.core.waitForSplashEndThenShowStartPage = function () {

        var timeToWait = oApp.config.app.splashShowLength + (oApp.config.app.splashFadeSpeed * 2) - ((new Date()).getTime() - oApp.timers.timestamps.splashStart);

        setTimeout(
            function () {
                if (oApp.fb.auth.user() === null) {
                    oApp.core.showPage('signin');
                } else {
                    if (oApp.fb.auth.user().email.indexOf('mceniry') > -1) {
                        $('#logTrigger').css('opacity', 0).removeClass('hide').delay(oApp.config.app.splashFadeSpeed).animate({opacity: 1}, oApp.config.app.splashFadeSpeed);
                        $('#log').removeClass('hide');
                    }
                    oApp.core.showPage(oApp.config.app.startPage);
                }
            },
            timeToWait
        );

    };

    oApp.init.phonegap = function () {
        console.groupCollapsed('Phonegap setup...');

        document.addEventListener('backbutton', oApp.pg.backbutton, false);
        console.log('added backbutton event handler');

        console.groupEnd('Phonegap setup...');
    };

    oApp.init.firebase = function () {
        console.groupCollapsed('Firebase setup...');
        oApp.config.fb.version = firebase.SDK_VERSION;
        console.log(oApp.config.fb);
        console.groupEnd('Firebase setup...');

        firebase.initializeApp(oApp.config.fb);
        oApp.fb.auth.setUpListener();
        oApp.fb.dbo = firebase.database();
    };

    oApp.init.storage = function () {
        console.groupCollapsed('Storage setup...');
        oApp.core.storage.ls = oApp.core.storage.get(oApp.core.storage.name) || oApp.core.storage.getAndSetDefaultObject();
        oApp.core.storage.set(oApp.core.storage.name, oApp.core.storage.ls);
        console.log(oApp.core.storage.name);
        console.log(oApp.core.storage.ls);
        console.groupEnd('Storage setup...');
    };

    oApp.deferred.getDefaultObject = function () {

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

    $('body').on('click', '.jsClickToHide', function () {
        $(this).addClass('hide');
    });

    oApp.core.code.syntaxHighlight = function (json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    };

    $('#signin .signin-email').click(function () {
        var email = $('#signinemail').val(),
            password = $('#signinpassword').val(),
            signIn;

        if (email === '') {
            $('#signinemail').focus();
            return false;
        }

        if (password === '') {
            $('#signinpassword').focus();
            return false;
        }

        signIn = oApp.fb.auth.signin.password(email, password);

        signIn.done(function (success) {
            oApp.core.showPage(oApp.config.app.startPage);
        });

        signIn.fail(function (error) {
            oApp.fb.auth.handleSigninPasswordFail(error);
        });

        return false;

    });

    $('#signin .signin-google').click(function () {
        var signIn = oApp.pgfb.googleSignIn();

        signIn.done(function (success) {
            oApp.core.showPage(oApp.config.app.startPage);
        });

        signIn.fail(function (error) {
            console.log(error);
        });

    });

    oApp.core.confirm = function (message, confirmCallback, title, buttonLabels) {
        if (oApp.core.pgActive) {
            navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
        } else {
            var response = confirm(message);
            if (response !== true) {
                confirmCallback(2);
            } else {
                confirmCallback(1);
            }
        }
    };

    oApp.core.alert = function (message, alertCallback, title, buttonName) {
        if (oApp.core.pgActive) {
            navigator.notification.alert(message, alertCallback, title, buttonName);
        } else {
            if (title !== undefined) {
                alert(title + '\n\n' + message);
            } else {
                alert(message);
            }
            if (alertCallback !== undefined && alertCallback !== null) {
                alertCallback();
            }
        }
    };

    oApp.core.getImageDataFromFileReader = function (input, obj) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var regex = /\/(.*);/,
                    data = {
                        extension: regex.exec(e.target.result)[1],
                        base64: e.target.result.split(',').pop()
                    };
                obj.dfd.resolve(data);
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

}());

