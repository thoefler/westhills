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

  let key = sessionStorage.getItem('key');

  let places = data.val();
  let keys = Object.keys(places);
  console.log(keys);

  for (var i = 0; i < keys.length; i++) {


    if (keys[i] == key) {


    let k = keys[i];
    let placeAdress = places[k].placeAdress;
    let placeCountry = places[k].placeCountry;
    let placeImage = places[k].placeImage;
    let placeInfos = places[k].placeInfos;
    let placeName = places[k].placeName;
    let placeUser = places[k].user;



    document.getElementById('place_name').innerHTML = placeName;
    document.getElementById('place_description').innerHTML = placeInfos;
    document.getElementById("place_description").style.width = "20vw";
    document.getElementById("place_description").style.height = "20vw";
    document.getElementById('placeCountry').innerHTML = placeCountry;
    document.getElementById('place_adress').innerHTML = placeAdress;
    document.getElementById('user_uploaded').innerHTML = "Uploaded by: " + placeUser;
    let img = document.getElementById('place_img');
    img.src = placeImage;

    }
  }
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

function logout(){
  firebase.auth().signOut();
}
