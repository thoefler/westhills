var target = $(this.hash);

$(function() {
         $.scrollify({
           section : ".snap",
         });
       });

$(window).scroll(function () {
      $("body").css("background-position","50% " + ($(this).scrollTop() / 2) + "px");

});


var firebaseConfig = {
    apiKey: "AIzaSyB4AKWZTXb99QshBFOyd3t2TC1yjYo3JRc",
    authDomain: "westhills-201012.firebaseapp.com",
    databaseURL: "https://westhills-201012.firebaseio.com",
    projectId: "westhills-201012",
    storageBucket: "westhills-201012.appspot.com",
    messagingSenderId: "491380765949",
    appId: "1:491380765949:web:89846b496bc940bf"
}



let fileName;
let file;

firebase.initializeApp(firebaseConfig);


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    database = firebase.database();

    let userId = user.uid;
    console.log(userId);

    let ref = database.ref('users');
    ref.on('value', gotData, errData);
    let bothNull = true;

    function gotData(data) {

      let users = data.val();
      let keys = Object.keys(users);
      console.log(keys);

      for (var i = 0; i < keys.length; i++) {

        if (keys[i] == userId) {

        let k = keys[i];
        let userEmail = users[k].email;
        let userName = users[k].username;

        console.log(userEmail);
        console.log(userName);

        document.getElementById("acc_button").firstChild.data = userName;
        document.getElementById("dropdown_logout").innerHTML = "Log out";
        document.getElementById("dropdown_logout").setAttribute("onclick", "logout()");
        document.getElementById("dropdown_logout").setAttribute("href", "#");

        }
      }
    }




  } else {
    // No user is signed in.

    document.getElementById("dropdown_logout").setAttribute("href", "login.html");
    document.getElementById("acc_button").firstChild.data = "Account";
    document.getElementById("dropdown_logout").innerHTML = "Log in";
    document.getElementById("dropdown_logout").setAttribute("onclick", "login()");
    document.getElementById("Account_Button").innerHTML = "Account";

  }
});

function getFileName() {
  var input = event.srcElement;
  fileName = input.files[0].name;
  file = input.files[0];
  console.log(file);
  submitPlace();
}


function submitPlace() {


  let database = firebase.database();
  let storage = firebase.storage();

  let myData = database.ref('submittedPlaces');

  let placeName = document.getElementById('placeName').value;
  let placeCountry = document.getElementById('placeCountry').value;
  let placeAdress = document.getElementById('searchField').value;
  let placeInfos = document.getElementById('placeInfos').value;

  if(placeName == ""){
    alert('Please Fill out a name');
    document.getElementById("placeName").focus();
    scrollToAnchor("name");
    return false;
  }
  if(placeCountry == ""){
    alert('Please Fill out a country');
    document.getElementById("placeCountry").focus();
    scrollToAnchor("country");
    return false;
  }
  if(placeAdress == ""){
    alert('Please Fill out an adress');
    document.getElementById("searchField").focus();
    scrollToAnchor("adress");
    return false;
  }
  if(placeInfos == ""){
    alert('Please Fill out the infos');
    document.getElementById("placeInfos").focus();
    scrollToAnchor("add_infos");
    return false;
  }

  let storageRef = firebase.storage().ref('/submitedPlaceImages/' + fileName);
  let uploadTask = storageRef.put(file);

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


  }, function() {
  // Upload completed successfully, now we can get the download URL
  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    console.log('File available at', downloadURL);
    var user = firebase.auth().currentUser;

    let userId = user.uid;
    console.log(userId);

    let ref = database.ref('users');
    ref.on('value', gotData, errData);
    let bothNull = true;

    function gotData(data) {

        database = firebase.database();

      let users = data.val();
      let keys = Object.keys(users);
      console.log(keys);
      let done = false;
      let k;
      let userName;

      for (var i = 0; i < keys.length; i++) {

        if (keys[i] == userId && done == false) {

        k = keys[i];
        userName = users[k].username;

        pushData(downloadURL, userName);
        done = true;
        }
        
      }

      if (done == false) {
        pushData(downloadURL, "Anonymous");
      }

    }

    // pushData(downloadURL);
  });


  function pushData(downloadURL, userName) {
    let postKey = database.ref('submitPlace/').push().key;
    // let downloadURL = uploadTask.snapshot.downloadURL;
    console.log(downloadURL);

    let data = {
      user: userName,
      placeImage: downloadURL,
      placeName: placeName,
      placeCountry: placeCountry,
      placeAdress: placeAdress,
      placeInfos: placeInfos
    }

    myData.push(data);
    alert("Thanks for submitting a place!");
    window.location.href = "explore.html";
    scrollToAnchor("home");
    currentPlace = 0;


    console.log("Data pushed");
  }


  });
}



function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('searchField');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }


window.onload = function() {

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length ; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {



          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
          });

          a.appendChild(b);


        }
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("placeCountry"), countries);
}

let currentPlace = 0;
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   let sections = ["name", "country", "adress", "add_infos", "submit"];
   let inputFields = ["name", "country", "adress", "add_infos", "submit"];

   if (key == 13 && currentPlace < 5) {

     event.preventDefault();
     scrollToAnchor(sections[currentPlace]);
     document.getElementById(sections[currentPlace]).focus();
     console.log(currentPlace);
     currentPlace++;

   } else if (key == 13 && currentPlace == 5) {
     submitPlace();

   }

}

function scrollToAnchor(aid){
    console.log(aid);
    var aTag = $("#"+ aid);
    console.log(aTag);
    console.log(aTag.offset());

    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

function logout(){
  firebase.auth().signOut();
}
