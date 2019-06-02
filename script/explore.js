// $(window).scroll(function () {
//     $("body").css("background-position","50% " + ($(this).scrollTop() / 2) + "px");
// });

var firebaseConfig = {
    apiKey: "AIzaSyB4AKWZTXb99QshBFOyd3t2TC1yjYo3JRc",
    authDomain: "westhills-201012.firebaseapp.com",
    databaseURL: "https://westhills-201012.firebaseio.com",
    projectId: "westhills-201012",
    storageBucket: "westhills-201012.appspot.com",
    messagingSenderId: "491380765949",
    appId: "1:491380765949:web:89846b496bc940bf"
}

firebase.initializeApp(firebaseConfig);
database = firebase.database();

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

let ref = database.ref('submittedPlaces');
ref.on('value', gotData, errData);

function gotData(data) {


  let places = data.val();
  let keys = Object.keys(places);
  console.log(keys);
  for (var i = 0; i < keys.length; i++) {
    let k = keys[i];
    let placeAdress = places[k].placeAdress;
    let placeCountry = places[k].placeCountry;
    let placeImage = places[k].placeImage;
    let placeInfos = places[k].placeInfos;
    let placeName = places[k].placeName;


    let listItem = document.createElement("li");
    let a = document.createElement("a");
    let img = document.createElement("img");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");
    let country = document.createElement("p");
    let placeKey = document.createElement("h5");

    listItem.id = "li" + i;
    listItem.setAttribute("onclick", "passValue(" + i + ")");
    listItem.setAttribute("class", i);
    a.id = "a" + i;
    img.id = "placeImage" + i;
    h3.id = "placeName" + i;
    p.id = "placeInfo" + i;
    country.id = "placeCountry" + i;
    country.style.color = "#fb275f";
    a.href = "place.html";
    img.src = placeImage;
    placeKey.id = k;
    placeKey.setAttribute("class", "key");

    document.getElementById("places").appendChild(listItem);
    document.getElementById("li" + i).appendChild(a);
    document.getElementById("a" + i).appendChild(img);
    document.getElementById("a" + i ).appendChild(h3);
    document.getElementById("a" + i ).appendChild(p);
    document.getElementById("a" + i ).appendChild(country);
    document.getElementById("a" + i ).appendChild(placeKey);

    document.getElementById('placeName' + i).innerHTML = placeName;
    document.getElementById('placeInfo' + i).innerHTML = placeInfos;
    document.getElementById('placeCountry' + i).innerHTML = placeCountry;

  }
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

let keyValue;
let key = "placeKey";

function passValue(pos) {

  keyValue = document.getElementsByClassName("key")[pos].id;

  sessionStorage.setItem('key', keyValue);

}
