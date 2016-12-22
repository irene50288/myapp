
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
  // img.width = 150;
  // img.height = 150;
  var tStart = performance.now();
  var file = el.files[0];
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      img.src = xhr.responseText;
      imageContainer.appendChild(img);
      img.onload = function(){
        var rect = img.getBoundingClientRect();
        console.log(rect.top, rect.right, rect.bottom, rect.left);
        generateColorPicker('primaryBgColor', img);
      };
    }
  };
  var formData = new FormData();
  formData.append('theFile', file);
  xhr.open('POST', 'http://localhost:3000');
  xhr.send(formData);
};

var toggleUploadImageField = function(el){
  var fileWrapper = document.getElementById('fileForPicker');
  if (el.checked) {
    fileWrapper.style.display = 'block';
  } else {
    fileWrapper.style.display = 'none';
  }
};

var toggleCustomColorPicker = function(el, id){
  var nativePicker = document.getElementById(id + 'Input');
  var picker = document.getElementById(id);
  var img = document.getElementById('imageContainer').children[0];
  if (el.checked) {
    picker.style.display = 'block';
    nativePicker.style.display = 'none';
    tinycolorpicker(picker);
    var c = picker.children[1].children[0];
    var ctx = c.getContext("2d");
    ctx.drawImage(img, 10, 10);
  } else {
    picker.style.display = 'none';
    nativePicker.style.display = 'block';
  }
};
var generateColorPicker = function(id, image){
  var container = document.createElement('div');
  container.id = id + 'Picker';
  container.className = 'colorPicker';
  var color = document.createElement('a');
  color.className = 'color';
  var colorInner = document.createElement('div');
  colorInner.className = 'colorInner';
  color.appendChild(colorInner);
  var track = document.createElement('div');
  track.className = 'track';
  var input = document.createElement('input');
  input.type = 'hidden';
  input.name = id;
  input.className = 'colorInput';
  container.appendChild(color);
  container.appendChild(track);
  container.appendChild(input);
  var place = document.getElementById(id + 'Wrapper');
  place.innerHTML = '';
  place.appendChild(container);
  // init color picker
  var picker = tinycolorpicker(container);

  // put the image to canvas
  var c = container.children[1].children[0];
  var ctx = c.getContext("2d");
  ctx.canvas.width = image.width;
  ctx.canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  var imageRect = image.getBoundingClientRect();
  container.style.left = imageRect.left + 'px';
  container.style.top = imageRect.top + 'px';
  container.style.position = 'absolute';
  console.log(image.width, image.height);

  container.addEventListener('change',function(){
    var destinationInput = document.getElementById(id + 'Input');
    destinationInput.value = input.value;
  });


};

var generateNativeColorPicker = function(id){
  var input = document.createElement('input');
  input.type = 'color';
  input.name = 'id';
  var place = document.getElementById(id + 'Wrapper');
  place.innerHTML = '';
  place.appendChild(input);
};