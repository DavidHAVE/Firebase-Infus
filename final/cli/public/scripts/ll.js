//
// function toggleSignIn() {
//      if (firebase.auth().currentUser) {
//     //    [START signout]
//        firebase.auth().signOut();
//   //      [END signout]
//      } else {
//         var email = document.getElementById('email').value;
//         var password = document.getElementById('password').value;
//         if (email.length < 4) {
//           alert('Please enter an email address.')
//           return;
//         }
//         if (password.length < 4) {
//           alert('Please enter a password.')
//           return;
//         }
//         // Sign in with email and pass.
//         // [START authwithemail]
//         firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
//           // Handle Errors here.
//           var errorCode = error.code;
//           var errorMessage = error.message;
//           // [START_EXCLUDE]
//           if (errorCode === 'auth/wrong-password') {
//             alert('Wrong password.');
//           } else {
//             alert(errorMessage);
//           }
//           console.log(error);
//           document.getElementById('quickstart-sign-in').disabled = false;
//           // [END_EXCLUDE]
//         });
//         // [END authwithemail]
//      }
//       // document.getElementById('quickstart-sign-in').disabled = true;
//
//     }
//
//
// // Initializes FriendlyChat.
// function initApp(){
//
// document.getElementById.getElementById('login-form').addEventListener('click', toggleSignIn, false);
// //  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
//
//
//   // Listening for auth state changes.
//      // [START authstatelistener]
//      firebase.auth().onAuthStateChanged(function(user) {
//        // [START_EXCLUDE silent]
//     //   document.getElementById('quickstart-verify-email').disabled = true;
//        // [END_EXCLUDE]
//        if (user) {
//          // User is signed in.
//       //   var displayName = user.displayName;
//          var email = user.email;
//         // var emailVerified = user.emailVerified;
//         // var photoURL = user.photoURL;
//         // var isAnonymous = user.isAnonymous;
//          var uid = user.uid;
//          window.open('food.html')
//       //   var providerData = user.providerData;
//          // [START_EXCLUDE]
//         //  document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
//         //  document.getElementById('quickstart-sign-in').textContent = 'Sign out';
//
//          // [END_EXCLUDE]
//        } else {
//          // User is signed out.
//          // [START_EXCLUDE]
//         // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
//          document.getElementById('quickstart-sign-in').textContent = 'Sign in';
//       //   document.getElementById('quickstart-account-details').textContent = 'null';
//          // [END_EXCLUDE]
//        }
//        // [START_EXCLUDE silent]
//        document.getElementById('quickstart-sign-in').disabled = false;
//        // [END_EXCLUDE]
//      });
//      // [END authstatelistener]
// }
//
//
//
// window.onload = function() {
//   // window.friendlyChat = new FriendlyChat();
// initApp();
// };
