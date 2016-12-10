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
                case 'number':
                case 'string':
                    $('#log').append('<span class="' + typeof item + '">' + item + '</span>');
                    break;
                case 'object':
                    $('#log').append(oApp.syntaxHighlight(JSON.stringify(item, null, 2)));
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

    oApp.showPage = function (id) {

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
            .animate({opacity: 0}, oApp.configs.app.splashFadeSpeed);

        setTimeout(
            function () {
                $('#' + currentPageId).removeClass('jsActivePage');
                $('.page').addClass('hide');

                page.css('opacity', 0).removeClass('hide').addClass('jsActivePage').animate({opacity: 1}, oApp.configs.app.splashFadeSpeed);
                $('#burger').css('opacity', 0).removeClass('hide').animate({opacity: 1}, oApp.configs.app.splashFadeSpeed);
                if (header !== undefined) {
                    $('header').css('opacity', 0).find('h1').html(header);
                    $('header').removeClass('hide').animate({opacity: 1}, oApp.configs.app.splashFadeSpeed);
                }

            },
            oApp.configs.app.splashFadeSpeed
        );

    };

    oApp.initPGFB = function (phonegapAvailable) {

        oApp.phonegapAvailable = phonegapAvailable !== false;

        oApp.showPage('splash');
        oApp.splashStart = (new Date()).getTime();

        //  if we are in phonegap then show on-screen logging else remove the div
        if (oApp.phonegapAvailable === false) {
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

        if (oApp.phonegapAvailable !== false) {
            oApp.initPhonegap();
        } else {
            console.groupCollapsed('Phonegap setup...');
            console.log('phonegap not available');
            console.groupEnd('Phonegap setup...');
        }
        oApp.initFirebase();
        oApp.initStorage();
        oApp.init();

    };

    oApp.init = function () {
        console.log('initialising app');
        oApp.waitForSplashEndThenShowStartPage();
    };

    oApp.waitForSplashEndThenShowStartPage = function () {

        var timeToWait = oApp.configs.app.splashShowLength + (oApp.configs.app.splashFadeSpeed * 2) - ((new Date()).getTime() - oApp.splashStart);

        setTimeout(
            function () {
                if (oApp.fb.auth.user() === null) {
                    oApp.showPage('signin');
                } else {
                    oApp.showPage(oApp.configs.app.startPage);
                }
            },
            timeToWait
        );

    };

    oApp.initPhonegap = function () {
        console.groupCollapsed('Phonegap setup...');
        document.addEventListener('backbutton', oApp.pg.backbutton, false);
        console.log('added backbutton event handler');
        console.groupEnd('Phonegap setup...');
    };

    oApp.initFirebase = function () {
        console.groupCollapsed('Firebase setup...');
        oApp.configs.fb.version = firebase.SDK_VERSION;
        console.log(oApp.configs.fb);
        console.groupEnd('Firebase setup...');

        firebase.initializeApp(oApp.configs.fb);
        oApp.fb.auth.setUpListener();
        oApp.fb.dbo = firebase.database();
    };

    oApp.initStorage = function () {
        console.groupCollapsed('Storage setup...');
        oApp.ls = oApp.storage.get(oApp.storage.name) || oApp.getAndSetDefaultStorageObject();
        oApp.storage.set(oApp.storage.name, oApp.ls);
        console.log(oApp.storage.name);
        console.log(oApp.ls);
        console.groupEnd('Storage setup...');
    };

    oApp.getDefaultDeferredObject = function () {

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
            console.log('User: {}');
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

    oApp.syntaxHighlight = function (json) {
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
            password = $('#signinemail').val();

        oApp.fb.auth.signin.password(email, password)
            .done(function (r) {
                console.log(r);
                oApp.showPage(oApp.configs.app.startPage);
            });

        return false;

    });

    $('#signin .signin-google').click(function () {
        var signIn = oApp.pgfb.googleSignIn();

        signIn.done(function (success) {
            console.log(success);
            oApp.showPage(oApp.configs.app.startPage);
        });

        signIn.fail(function (error) {
            console.log(error);
        });

    });

    oApp.confirm = function (message, confirmCallback, title, buttonLabels) {
        if (oApp.phonegapAvailable) {
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

}());

