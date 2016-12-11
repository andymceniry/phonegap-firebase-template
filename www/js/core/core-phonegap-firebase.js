/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.pgfb = oApp.pgfb || {};

    oApp.pgfb.googleSignIn = function () {

        var obj = oApp.deferred.getDefaultObject(),
            googleAuth,
            firebaseSignIn;

        if (oApp.config.gapi.client_id === undefined) {
            obj.dfd.reject('No Google Client Id supplied');
            return false;
        }

        if (oApp.config.gapi.client_secret === undefined) {
            obj.dfd.reject('No Google Client Secret supplied');
            return false;
        }

        googleAuth = oApp.gapi.googleapi.authorize({
            client_id: oApp.config.gapi.client_id,
            client_secret: oApp.config.gapi.client_secret,
            redirect_uri: oApp.config.gapi.redirect_uri || 'http://localhost',
            scope: oApp.config.gapi.scope || 'profile email'
        });

        googleAuth.done(function (data) {

            var credential = firebase.auth.GoogleAuthProvider.credential(data.id_token);

            firebase.auth().signInWithCredential(credential)
                .catch(function (error) {
                    obj.dfd.reject(error);
                }).then(function (value) {
                    obj.dfd.resolve(value);
                });
        });

        googleAuth.fail(function (data) {
            obj.dfd.reject(data.error);
        });

        return obj.dfd.promise();

    };

}());