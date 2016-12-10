/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.pgfb = oApp.pgfb || {};

    oApp.pgfb.googleSignIn = function () {

        var obj = oApp.getDefaultDeferredObject(),
            googleAuth,
            firebaseSignIn;

        if (oApp.configs.gapi.client_id === undefined) {
            obj.dfd.reject('No Google Client Id supplied');
            return false;
        }

        if (oApp.configs.gapi.client_secret === undefined) {
            obj.dfd.reject('No Google Client Secret supplied');
            return false;
        }

        googleAuth = oApp.gapi.googleapi.authorize({
            client_id: oApp.configs.gapi.client_id,
            client_secret: oApp.configs.gapi.client_secret,
            redirect_uri: oApp.configs.gapi.redirect_uri || 'http://localhost',
            scope: oApp.configs.gapi.scope || 'profile email'
        });

        googleAuth.done(function (data) {
            console.log('PGFB: googleAuth > done', data);
            var credential = firebase.auth.GoogleAuthProvider.credential(data.id_token);
            console.log('PGFB: googleAuth > done > credential', credential);
            firebaseSignIn = firebase.auth().signInWithCredential(credential);

            console.log('PGFB: googleAuth > done > firebaseSignIn', firebaseSignIn);

            firebaseSignIn.done(function (success) {
                console.log('PGFB: googleAuth > done > firebaseSignIn > done', success);
                obj.dfd.resolve(success);
            });

            firebaseSignIn.catch(function (error) {
                console.log('PGFB: googleAuth > done > firebaseSignIn > catch', error);
                obj.dfd.reject(error);
            });

            firebaseSignIn.fail(function (error) {
                console.log('PGFB: googleAuth > done > firebaseSignIn > fail', error);
                obj.dfd.reject(error);
            });
        });

        googleAuth.fail(function (data) {
            obj.dfd.reject(data.error);
        });

        return obj.dfd.promise();

    };

}());