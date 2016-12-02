/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.pgfb = oApp.pgfb || {};

    oApp.pgfb.googleSignIn = function () {

        oApp.gapi.googleapi.authorize({
            client_id: '499750290208-hh5hd6dr5bpdmiii9f152qv2ofiph7f8.apps.googleusercontent.com',
            client_secret: '25gBMgoXkBYy97mcPVmV-JlP',
            redirect_uri: 'http://localhost',
            scope: 'profile email'
        }).done(function (data) {
            console.log('Id Token: ' + data.id_token);
            var credential = firebase.auth.GoogleAuthProvider.credential(
                data.id_token
            );
            firebase.auth().signInWithCredential(credential)
                .catch(function (error) {
                    console.log(error);
                });
        }).fail(function (data) {
            console.log(data.error);
        });
    };

}());