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

function errData(err) {
  console.log('Error!');
  console.log(err);
}



function postToGoogle() {
                var field1 = $("#subject_field").val();
                var field2 = $("#email_field").val();
                var field3 = $("#textarea_field").val();

                console.log(field1);

				if(field1 == ""){
					alert('Please Fill out a Subject');
					document.getElementById("subject_field").focus();
					return false;
				}
				if(field2 == ""){
					alert('Please Fill out an email');
					document.getElementById("email_field").focus();
					return false;
				}
				if(field3 == ""){
					alert('Please Fill out a text');
					document.getElementById("textarea_field").focus();
					return false;
				}




                $.ajax({
                    url: "https://docs.google.com/forms/d/e/1FAIpQLSfvH79stEWkrbBvR2lY-fylM-YjgBbsIDJzy9dyyJBU1o8hxQ/formResponse?",
					data: {"entry.1863596363": field1, "entry.2049462959": field2, "entry.1115171214": field3},
                    type: "POST",
                    dataType: "xml",
                    success: function(d)
					{
					},
					error: function(x, y, z)
						{

							$('#success-msg').show();
							$('#form').hide();

						}
                });
				return false;
            }

//   document.getElementById('subject_field').onkeydown = function(event) {
//       if (event.keyCode == 13) {
//           postToGoogle();
//       }
//   }
//
//   document.getElementById('email_field').onkeydown = function(event) {
//       if (event.keyCode == 13) {
//         postToGoogle();
//       }
//   }
//
//   document.getElementById('textarea_field').onkeydown = function(event) {
//       if (event.keyCode == 13) {
// postToGoogle();
//       }
  // }

  function logout(){
    firebase.auth().signOut();
    alert("Successful logout")
  }
