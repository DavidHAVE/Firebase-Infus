
'use strict';

// Initializes FriendlyChat.
function Menu() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
   this.messageList = document.getElementById('messages');
 //this.messageForm = document.getElementById('message-form');
  this.judulInput = document.getElementById('judulInput');
this.informasiInput = document.getElementById('informasiInput');


   this.submitImageButton = document.getElementById('submitImage');

   this.imageForm = document.getElementById('image-form');
   this.mediaCapture = document.getElementById('mediaCapture');

  // Toggle for the button.
  var buttonTogglingHandler = this.toggleButton.bind(this);
  judulInput.addEventListener('keyup', buttonTogglingHandler);
  judulInput.addEventListener('change', buttonTogglingHandler);


  // // Events for image upload.
  this.submitImageButton.addEventListener('click', function(e) {
    e.preventDefault();

     this.mediaCapture.click();
  }.bind(this));
  this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));
// this.submitImageButton.addEventListener('click', this.saveImageMessage.bind(this));


  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
Menu.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  // this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
this.messagesRef = this.database.ref('menu');
  this.loadMessages();
  //
       this.saveMessagingDeviceToken();
};

// Loads chat messages history and listens for upcoming ones.
// Menu.prototype.loadMessages = function() {
//   this.messagesRef = this.database.ref('menu');
//   this.messagesRef.off();
//
//   var setMessage = function(data) {
//     var val = data.val();
//     this.displayMessage(data.key, val.title, val.information, val.imageUrl);
//   }.bind(this);
//   this.messagesRef.limitToLast(12).on('child_added', setMessage);
//   this.messagesRef.limitToLast(12).on('child_changed', setMessage);
// };


// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
Menu.prototype.saveImageMessage = function(event) {
  event.preventDefault();

  var chck = parseInt(document.querySelector('input[name="tipeMakanan"]:checked').value);

  var judull = this.judulInput.value;
  var informasii = this.informasiInput.value;
  var file = event.target.files[0];

  this.imageForm.reset();

  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return;
  }

  // if (this.checkSignedInWithMessage()) {
  //
  //   var currentUser = this.auth.currentUser;
    this.messagesRef.push({
      menuType: chck,
      title: judull,
      information: informasii,
      imageUrl: '/images/profile_placeholder.png'

    }).then(function(data) {

      var filePath = 'admin' + '/' + 'menu' + '/' + data.key + '/' + file.name;



      return this.storage.ref(filePath).put(file).then(function(snapshot) {

        var fullPath = snapshot.metadata.fullPath;
/
        return data.update({imageUrl: this.storage.ref(fullPath).toString()});
      }.bind(this));
    }.bind(this)).catch(function(error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
//  }
};


// Saves the messaging device token to the datastore.
// Menu.prototype.saveMessagingDeviceToken = function() {
//   firebase.messaging().getToken().then(function(currentToken) {
//     if (currentToken) {
//       console.log('Got FCM device token:', currentToken);
//       // Saving the Device Token to the datastore.
//       firebase.database().ref('/fcmTokens').child(currentToken)
//           .set(firebase.auth().currentUser.uid);
//     } else {
//       // Need to request permissions to show notifications.
//       this.requestNotificationsPermissions();
//     }
//   }.bind(this)).catch(function(error){
//     console.error('Unable to get messaging token.', error);
//   });
// };
//
// // Requests permissions to show notifications.
// Menu.prototype.requestNotificationsPermissions = function() {
//   console.log('Requesting notifications permission...');
//   firebase.messaging().requestPermission().then(function() {
//     // Notification permission granted.
//     this.saveMessagingDeviceToken();
//   }.bind(this)).catch(function(error) {
//     console.error('Unable to get permission to notify.', error);
//   });
// };
//
// // Resets the given MaterialTextField.
// Menu.resetMaterialTextfield = function(element) {
//   element.value = '';
//   element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
// };
//
// // Template for messages.
// Menu.MESSAGE_TEMPLATE =
//     '<div class="message-container">' +
//       '<div class="spacing"></div>' +
//       '<div class="title"></div>' +
//       '<div class="information"></div>' +
//       '<div class="imageUrl"></div>' +
//     '</div>';
//
//
// // A loading image URL.
// // FriendlyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
//
// // Displays a Message in the UI.
// Menu.prototype.displayMessage = function(key, title, information, imageUrl) {
//   var div = document.getElementById(key);
//   if (!div) {
//     var container = document.createElement('div');
//     container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
//     div = container.firstChild;
//     div.setAttribute('id', key);
//     this.messageList.appendChild(div);
//   }
//   // if (picUrl) {
//   //   div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
//   // }
//   div.querySelector('.title').textContent = title;
//   div.querySelector('.information').textContent = information;
//   div.querySelector('.imageUrl').textContent = imageUrl;
//
//
//   setTimeout(function() {div.classList.add('visible')}, 1);
//   this.messageList.scrollTop = this.messageList.scrollHeight;
//   this.messageInput.focus();
// };


// Menu.prototype.toggleButton = function() {
//   if (this.messageInput.value) {
//     this.submitButton.removeAttribute('disabled');
//   } else {
//     this.submitButton.setAttribute('disabled', 'true');
//   }
// };

// Checks that the Firebase SDK has been correctly setup and configured.
Menu.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Cloud Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.');
  }
};

window.onload = function() {
  window.menu = new Menu();
};
