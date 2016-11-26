/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.fb = oApp.fb || {};

    oApp.fb.runTest = function (test) {

        switch (test) {

        case 'storage-string':
            var file = (new Date()).getTime() + '.txt';
            var string = prompt('Enter some content for file');
            if (string == '' || string == null) {
                return false;
            }
            console.log(file, string);
            oApp.fb.storage.putString(file, string)
                .done(function (connection) {
                    console.log(connection);
                })
                .fail(function (error) {
                    console.log(error);
                });
            break;

        }

    };

    oApp.fb.storage = oApp.fb.storage || {};

    oApp.fb.storage.putString = function (file, string) {

        var obj = {
            dfd: $.Deferred(),
            success: function (position) {
                if (allData === false) {
                    obj.dfd.resolve({latitude: position.coords.latitude.toFixed(decimalPlaces), longitude: position.coords.longitude.toFixed(decimalPlaces)});
                } else {
                    obj.dfd.resolve(position);
                }
            },
            error: function (error) {
                obj.dfd.reject(error);
            }
        };

        var ref = firebase.storage().ref().child(file);

        ref.putString('test').then(function(snapshot) {
            obj.dfd.resolve(snapshot);
        });

        return obj.dfd.promise();
    };















    oApp.fb.storeBase64 = function (location, base64) {

        var storage = firebase.storage(),
            storageRef = storage.ref(),
            imagesRef = storageRef.child(location);

        console.log('fb storing "' + location + '"');

base64 = '5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';

        var uploadTask = imagesRef.putString(base64);
// .then(function (snapshot) {
            // console.log('Uploaded a base64 string!');
            // console.log(snapshot);
        // });

uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
console.log(error.code);
console.log(error);
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;


    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, function() {
  // Upload completed successfully, now we can get the download URL
  var downloadURL = uploadTask.snapshot.downloadURL;
});

    };

}());
