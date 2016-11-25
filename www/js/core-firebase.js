/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.fb = oApp.fb || {};

    oApp.fb.storeFile = function (location, file) {

        var storage = firebase.storage();

        var storageRef = storage.ref();

        var imagesRef = storageRef.child(location + '/' + file);

        imagesRef.put(file).then(function(snapshot) {
            console.log('Uploaded a blob or file!');
            console.log(snapshot);
        });
    };

}());