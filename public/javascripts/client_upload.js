
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
  // img.crossOrigin = "Anonymous";
  img.width = 150;
  img.height = 150;
  var tStart = performance.now();
  var file = el.files[0];

  var $picker = document.getElementById("colorPicker");
  var c = $picker.children[1].children[0];
  var ctx = c.getContext("2d");


  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      // console.log(xhr.responseText);
      img.src = xhr.responseText;
      imageContainer.appendChild(img);
      img.onload = function() {
        ctx.drawImage(img, 10, 10);
      };
    }
  }

  var formData = new FormData();
  formData.append('theFile', file);
  xhr.open('POST', 'http://localhost:3000');
  xhr.send(formData);

};
