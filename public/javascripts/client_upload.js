
var config = {
  apiKey: "AIzaSyAYNL_pXtUz8xa5Qkw9YA1PlrXQSeeDkz4",
  authDomain: "node-test-36a42.firebaseapp.com",
  databaseURL: "https://node-test-36a42.firebaseio.com",
  storageBucket: "node-test-36a42.appspot.com",
  messagingSenderId: "13908002465"
};
firebase.initializeApp(config);

var uploadFile = function(el) {
  var imageContainer = document.getElementById('imageContainer');
  var img = document.createElement('img');
  img.setAttribute('width', '150');
  img.setAttribute('height', '150');
  var tStart = performance.now();
  var file = el.files[0];
  var storageRef = firebase.storage().ref();
  var imagesRef = storageRef.child('/images/' + file.name);

  var $picker = document.getElementById("colorPicker");
  var c = $picker.children[1].children[0];
  var ctx = c.getContext("2d");

  imagesRef.put(file).then(function(snapshot) {
    console.log('Uploaded a blob or file!');
    var tEnd = performance.now();
    console.log(tEnd - tStart);
    console.log(snapshot);
    img.setAttribute('src', snapshot.a.downloadURLs[0]);

    imageContainer.appendChild(img);
    img.onload = function() {
      ctx.drawImage(img, 10, 10);
    };
  });
};
