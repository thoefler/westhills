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
