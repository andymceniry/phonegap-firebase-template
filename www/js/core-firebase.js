/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.fb = oApp.fb || {};

    oApp.fb.outputTestResults = function (test) {
        test.done(function (snapshot) {
            console.log(snapshot);
        })
            .fail(function (error) {
                console.log(error);
            });
    };



    oApp.fb.runTest = function (test) {

        var ts = (new Date()).getTime(),
            task,
            string;

        switch (test) {

        case 'storage-string':
            string = prompt('Enter some content for file');
            if (string == '' || string == null) {
                return false;
            }
            task = oApp.fb.storage.putString(ts + '.txt', string);
            oApp.fb.outputTestResults(task);

            break;

        case 'storage-image':
            oApp.pg.camera.getPicture(false)
                .done(function (imageData) {
                    task = oApp.fb.storeBase64(ts + '.jpg', imageData);
                    oApp.fb.outputTestResults(task);
                })
                .fail(function (error) {
                    console.log(error);
                });
            break;

        }

    };

    oApp.fb.storage = oApp.fb.storage || {};

    oApp.fb.storage.monitor = function (task) {
        task.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, function (error) {
            console.log('Error: ', error);
        }, function () {
            console.log('Download URL: ', task.snapshot.downloadURL);
        });
    };

    oApp.fb.storage.putString = function (file, string) {

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
            task = ref.putString(string);

        task.then(function (snapshot) {
            obj.dfd.resolve(snapshot);
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

}());
