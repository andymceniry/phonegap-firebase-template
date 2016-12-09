/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.pgfb = oApp.pgfb || {};

    oApp.pgfb.googleSignIn = function () {

        if (oApp.configs.gapi.client_id === undefined) {
            console.log('No Google Client Id supplied');
            return false;
        }

        if (oApp.configs.gapi.client_secret === undefined) {
            console.log('No Google Client Secret supplied');
            return false;
        }

        oApp.gapi.googleapi.authorize({
            client_id: oApp.configs.gapi.client_id,
            client_secret: oApp.configs.gapi.client_secret,
            redirect_uri: oApp.configs.gapi.redirect_uri || 'http://localhost',
            scope: oApp.configs.gapi.scope || 'profile email'
        }).done(function (data) {
            console.log('Id Token: ' + data.id_token);
            var credential = firebase.auth.GoogleAuthProvider.credential(
                data.id_token
            );
            firebase.auth().signInWithCredential(credential)
                .done(function () {
                    oApp.showPage(oApp.configs.app.startPage);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }).fail(function (data) {
            console.log(data.error);
        });
    };

}());