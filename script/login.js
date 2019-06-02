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

var user = firebase.auth().currentUser;
var name, email, photoUrl, emailVerified;


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


        }
      }
    }

    document.getElementById("login_div").style.display = "none";
    document.getElementById("user_div").style.display = "block";
    document.getElementById("dropdown_logout").innerHTML = "Log out";
    document.getElementById("dropdown_logout").setAttribute("onclick", "logout()");


  } else {
    // No user is signed in.

    document.getElementById("acc_button").firstChild.data = "Account";

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    document.getElementById("dropdown_logout").innerHTML = "Log in";
    document.getElementById("dropdown_logout").setAttribute("onclick", "login()");
    document.getElementById("Account_Button").innerHTML = "Account";

  }
});

function login() {

  let userEmail = document.getElementById('email_field').value;
  let userPassword = document.getElementById('password_field').value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){
  firebase.auth().signOut();
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}
