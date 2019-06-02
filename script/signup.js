let user = firebase.auth().currentUser;
// let name, email, photoUrl, emailVerified;
// let database = firebase.database();
//
// if (user != null) {
//   name = user.displayName;
//   email = user.email;
//   photoUrl = user.photoURL;
//   emailVerified = user.emailVerified;
// }

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
        console.log("Key (i):" + keys[i]);
        console.log("Key    :" + userId);

        if (keys[i] == userId) {

        let k = keys[i];
        let userEmail = users[k].email;
        let userName = users[k].username;

        if (userEmail == "" && userName == "") {

          console.log("BOTH NULL");

        }

        console.log(userEmail);
        console.log(userName);

        document.getElementById("acc_button").firstChild.data = userName;


        }
      }
    }

    function errData(err) {
      console.log('Error!');
      console.log(err);
    }


    let userName = document.getElementById('username_field').value;
    let userEmail = document.getElementById('email_field').value;

    writeUserToDatabase(userName, userEmail, userId);


    document.getElementById("login_div").style.display = "none";
    document.getElementById("user_div").style.display = "block";
    document.getElementById("dropdown_logout").innerHTML = "Log out";

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




function signup() {
  let userName = document.getElementById('username_field').value;
  let userEmail = document.getElementById('email_field').value;
  let userPassword = document.getElementById('password_field').value;


  // SIGN UP
  firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
  });


  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

  

    // ...
  });
}


function anotherOne() {

  firebase.auth().signOut();

  document.getElementById("user_div").style.display = "none";
  document.getElementById("login_div").style.display = "block";
  document.getElementById("dropdown_logout").innerHTML = "Log in";
  document.getElementById("Account_Button").innerHTML = "Account";

}

document.getElementById('password_field').onkeydown = function(event) {
    if (event.keyCode == 13) {
        signup();
    }
}

document.getElementById('email_field').onkeydown = function(event) {
    if (event.keyCode == 13) {
        signup();
    }
}

document.getElementById('username_field').onkeydown = function(event) {
    if (event.keyCode == 13) {
        signup();
    }
}

function writeUserToDatabase(userName, userEmail, userId) {
   firebase.database().ref('users/' + userId).set({
     username: userName,
     email: userEmail
   }, (error) => {
     if (error) {
       // The write failed...
     } else {
       // Data saved successfully!
     }
   })
}
