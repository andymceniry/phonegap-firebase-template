/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.fb = oApp.fb || {
        auth: {
            register: {},
            signin: {}
        },
        storage: {}
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
            success: function (success) {
                obj.dfd.resolve(success);
            },
            error: function (error) {
                obj.dfd.reject(error);
            }
        },

            ref = firebase.storage().ref().child(file),
            task = ref.putString(base64, 'base64');

        task.then(function (success) {
            obj.dfd.resolve(success);
        });
        oApp.fb.storage.monitor(task);

        return obj.dfd.promise();

    };

    oApp.fb.auth.setUpListener = function () {

        firebase.auth().onAuthStateChanged(function (user) {
            oApp.handleAuthChange(user);
        });

    };

    oApp.fb.auth.register.password = function (email, password) {

        var obj = oApp.getDefaultTestObject();

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (success) {
                obj.dfd.resolve(success);
            })
            .catch(function (error) {
                obj.dfd.reject(error);
            });

        return obj.dfd.promise();

    };

    oApp.fb.auth.signin.password = function (email, password) {

        var obj = oApp.getDefaultTestObject();

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (success) {
                obj.dfd.resolve(success);
            })
            .catch(function (error) {
                obj.dfd.reject(error);
            });

        return obj.dfd.promise();

    };

    oApp.fb.auth.signout = function () {

        var obj = oApp.getDefaultTestObject();

        firebase.auth().signOut()
            .then(function (success) {
                obj.dfd.resolve(success);
            })
            .catch(function (error) {
                obj.dfd.reject(error);
            });

        return obj.dfd.promise();

    };

}());
