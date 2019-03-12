
'use strict';

// Initializes FriendlyChat.
function Food() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
   this.messageList = document.getElementById('messages');
 this.messageForm = document.getElementById('message-form');
  this.makananInput = document.getElementById('makananInput');
this.jumlahInput = document.getElementById('jumlahInput');
this.kaloriInput = document.getElementById('kaloriInput');
this.karbohidratInput = document.getElementById('karbohidratInput');
this.proteinInput = document.getElementById('proteinInput');
this.lemakInput = document.getElementById('lemakInput');


this.submitButton = document.getElementById('submit');


  // Saves message on form submit.
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this));

  // Toggle for the button.
  var buttonTogglingHandler = this.toggleButton.bind(this);
  this.makananInput.addEventListener('keyup', buttonTogglingHandler);
  this.makananInput.addEventListener('change', buttonTogglingHandler);


  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
Food.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  // this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
this.messagesRef = this.database.ref('food');
  this.loadMessages();
  //
       this.saveMessagingDeviceToken();
};

// Loads chat messages history and listens for upcoming ones.
// Food.prototype.loadMessages = function() {
//   this.messagesRef = this.database.ref('food');
//   this.messagesRef.off();
//
//   var setMessage = function(data) {
//     var val = data.val();
//     this.displayMessage(data.key, val.name, val.type, val.calorie, val.carbohydrate,
//       val.protein, val.fat, val.quality);
//   }.bind(this);
//   this.messagesRef.limitToLast(12).on('child_added', setMessage);
//   this.messagesRef.limitToLast(12).on('child_changed', setMessage);
// };

// Saves a new message on the Firebase DB.
Food.prototype.saveMessage = function(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (this.makananInput.value) {

  var typeChck = parseInt(document.querySelector('input[name="tipeMakanan"]:checked').value);
  var qualityChck = parseInt(document.querySelector('input[name="kualitasMakanan"]:checked').value);


    // var currentUser = this.auth.currentUser;
    // Add a new message entry to the Firebase Database.
    this.messagesRef.push({
      foodName: this.makananInput.value,
      type : typeChck,
      amount : parseFloat(this.jumlahInput.value),
      foodCalorie: parseFloat(this.kaloriInput.value),
      foodCarbohydrate: parseFloat(this.karbohidratInput.value),
      foodProtein: parseFloat(this.proteinInput.value),
      foodFat: parseFloat(this.lemakInput.value),
      foodQuality : qualityChck
    }).then(function() {
      // Clear message text field and SEND button state.
      Food.resetMaterialTextfield(this.makananInput);
      this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};


// // Saves the messaging device token to the datastore.
// FriendlyChat.prototype.saveMessagingDeviceToken = function() {
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
// FriendlyChat.prototype.requestNotificationsPermissions = function() {
//   console.log('Requesting notifications permission...');
//   firebase.messaging().requestPermission().then(function() {
//     // Notification permission granted.
//     this.saveMessagingDeviceToken();
//   }.bind(this)).catch(function(error) {
//     console.error('Unable to get permission to notify.', error);
//   });
// };

// Resets the given MaterialTextField.
// FriendlyChat.resetMaterialTextfield = function(element) {
//   element.value = '';
//   element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
// };

// Template for messages.
// FriendlyChat.MESSAGE_TEMPLATE =
//     '<div class="message-container">' +
//       '<div class="spacing"></div>' +
//       '<div class="name"></div>' +
//       '<div class="type"></div>' +
//       '<div class="jumlah"></div>' +
//       '<div class="calorie"></div>' +
//       '<div class="carbohydrate"></div>' +
//       '<div class="protein"></div>' +
//       '<div class="fat"></div>' +
//       '<div class="quality"></div>' +
//     '</div>';


// A loading image URL.
// FriendlyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
// FriendlyChat.prototype.displayMessage = function(key, name, type, jumlah, carbohydrate, calorie,
//   protein, fat, quality) {
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
//   div.querySelector('.name').textContent = name;
//   div.querySelector('.type').textContent = type;
//   div.querySelector('.jumlah').textContent = jumlah;
//   div.querySelector('.calorie').textContent = calorie;
//   div.querySelector('.carbohydrate').textContent = carbohydrate;
//   div.querySelector('.protein').textContent = protein;
//   div.querySelector('.fat').textContent = fat;
//   div.querySelector('.quality').textContent = quality;
//
//
//   setTimeout(function() {div.classList.add('visible')}, 1);
//   this.messageList.scrollTop = this.messageList.scrollHeight;
//   this.messageInput.focus();
// };
//
//
// FriendlyChat.prototype.toggleButton = function() {
//   if (this.messageInput.value) {
//     this.submitButton.removeAttribute('disabled');
//   } else {
//     this.submitButton.setAttribute('disabled', 'true');
//   }
// };

// Checks that the Firebase SDK has been correctly setup and configured.
Food.prototype.checkSetup = function() {
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
  window.food = new Food();
};
