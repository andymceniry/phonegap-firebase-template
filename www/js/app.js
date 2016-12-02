/*global $*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.init = function () {
        console.log('initialising app');

        oApp.ls = oApp.storage.get(oApp.storage.name) || oApp.getAndSetDefaultStorageObject();
        oApp.storage.set(oApp.storage.name, oApp.ls);

    };

    oApp.getAndSetDefaultStorageObject = function () {

        var obj = {
            id: (new Date()).getTime()
        };

        oApp.storage.set(oApp.storage.name, obj);

        return obj;

    };


    var $loginButton = $('#login a');
    var $loginStatus = $('#login p');

    $loginButton.on('click', function() {
        googleapi.authorize({
            client_id: '499750290208-hh5hd6dr5bpdmiii9f152qv2ofiph7f8.apps.googleusercontent.com',
            client_secret: '25gBMgoXkBYy97mcPVmV-JlP',
            redirect_uri: 'https://auth.firebase.com/auth/google/callback',
            scope: 'profile email'
        }).done(function(data) {
            //$loginStatus.html('Access Token: ' + data.access_token);
            $loginStatus.html('Id Token: ' + data.id_token);
console.clear();
console.log(data);
            var credential = firebase.auth.GoogleAuthProvider.credential(
                //googleUser.getAuthResponse().id_token
                data.id_token
            );
            firebase.auth().signInWithCredential(credential)
                .catch(function (error) {
                    console.log(error);
                });


        }).fail(function(data) {
            $loginStatus.html(data.error);
        });
    });

}());


var googleapi = {
    authorize: function(options) {
        var deferred = $.Deferred();

        //  build the OAuth consent page URL
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });

        //  open the OAuth consent page in the InAppBrowser
        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');


        $(authWindow).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                authWindow.close();
            }
console.log(code);
console.log(error);
            if (code) {
                $.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function(data) {
                    deferred.resolve(data);
                }).fail(function(response) {
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};


