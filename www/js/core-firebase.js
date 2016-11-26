/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.fb = oApp.fb || {
        auth: {
            password: {}
        },
        storage: {}
    };

    oApp.fb.runTest = function (test) {

        var ts = (new Date()).getTime(),
            task,
            string;

        switch (test) {

        case 'authentication-password':
            var email = prompt('Enter email');
            if (email == '' || email == null) {
                return false;
            }
            var password = prompt('Enter password');
            if (password == '' || password == null) {
                return false;
            }
            task = oApp.fb.auth.password.register(email, password);
            oApp.outputTestResults(task);
            break;

        case 'storage-string':
            string = prompt('Enter some content for file');
            if (string == '' || string == null) {
                return false;
            }
            task = oApp.fb.storage.putString(ts + '.txt', string);
            oApp.outputTestResults(task);

            break;

        case 'storage-image':
            oApp.pg.camera.getPicture(false)
                .done(function (imageData) {
                    task = oApp.fb.storeBase64(ts + '.jpg', imageData);
                    oApp.outputTestResults(task);
                })
                .fail(function (error) {
                    console.log(error);
                });
            break;

        }

    };

    oApp.fb.storage.monitor = function (task) {
        task.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress.toFixed(2) + '% done');
        }, function (error) {
            console.log('Error: ', error);
        }, function () {
            console.log('Download URL: ', task.snapshot.downloadURL);
        });
    };

    oApp.fb.storage.putString = function (file, string) {

        var obj = {
            dfd: $.Deferred(),
            success: function (success) {
                obj.dfd.resolve(success);
            },
            error: function (error) {
                obj.dfd.reject(error);
            }
        },
            ref = firebase.storage().ref().child(file),
            task = ref.putString(string);

        task.then(function (success) {
            obj.dfd.resolve(success);
        });
        oApp.fb.storage.monitor(task);

        return obj.dfd.promise();
    };

    oApp.fb.storeBase64 = function (file, base64) {

        var obj = {
            dfd: $.Deferred(),
            success: function (snapshot) {
                obj.dfd.resolve(snapshot);
            },
            error: function (error) {
                obj.dfd.reject(error);
            }
        },

            ref = firebase.storage().ref().child(file),
            task = ref.putString(base64, 'base64');

        task.then(function (snapshot) {
            obj.dfd.resolve(snapshot);
        });
        oApp.fb.storage.monitor(task);

        return obj.dfd.promise();

    };

    oApp.fb.auth.password.register = function (email, password) {

        var obj = oApp.getDefaultTestObject(),
            task = firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (snapshot) {
                obj.dfd.resolve(snapshot);
            })
            .catch(function(error) {
                obj.dfd.reject(error);
            });

        return obj.dfd.promise();

    };

}());
