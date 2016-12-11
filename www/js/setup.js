/*global $*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.core.storage.name = 'phonegap-firebase-template';

    oApp.config.app = {
        startPage: 'home',
        splashFadeSpeed: 500,
        splashShowLength: 200
    };

    oApp.config.fb = {
        apiKey: 'AIzaSyCVpw804Nrmyn6N8idPnqVWtBK5b0wvBZ8',
        authDomain: 'phonegap-firebase-template.firebaseapp.com',
        databaseURL: 'https://phonegap-firebase-template.firebaseio.com',
        storageBucket: 'gs://phonegap-firebase-template.appspot.com',
        messagingSenderId: '534493340673'
    };

    oApp.config.gapi = {
        client_id: '499750290208-hh5hd6dr5bpdmiii9f152qv2ofiph7f8.apps.googleusercontent.com',
        client_secret: '25gBMgoXkBYy97mcPVmV-JlP',
        scope: 'profile email'
    };

    oApp.config.pg = {};

}());