/*global $, Camera, Connection*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.gapi = {

        googleapi: {

            authorize: function (options) {
                var deferred = $.Deferred(),
                    authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                        client_id: options.client_id,
                        redirect_uri: options.redirect_uri,
                        response_type: 'code',
                        scope: options.scope
                    }),
                    authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

                $(authWindow).on('loadstart', function (e) {
                    var url = e.originalEvent.url,
                        code = /\?code=(.+)$/.exec(url),
                        error = /\?error=(.+)$/.exec(url);

                    if (code || error) {
                        authWindow.close();
                    }

                    if (code) {
                        $.post('https://accounts.google.com/o/oauth2/token', {
                            code: code[1],
                            client_id: options.client_id,
                            client_secret: options.client_secret,
                            redirect_uri: options.redirect_uri,
                            grant_type: 'authorization_code'
                        }).done(function (data) {
                            deferred.resolve(data);
                        }).fail(function (response) {
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

        }

    };

}());