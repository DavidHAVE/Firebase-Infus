
'use strict';

// Initializes FriendlyChat.
function FriendlyChat() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
   this.messageList = document.getElementById('messages');
 //this.messageForm = document.getElementById('message-form');
  this.judulInput = document.getElementById('judulInput');
this.informasiInput = document.getElementById('informasiInput');


   this.submitImageButton = document.getElementById('submitImage');
  //
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
FriendlyChat.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  // this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
this.messagesRef = this.database.ref('tips');
  this.loadMessages();
  //
       this.saveMessagingDeviceToken();
};

// Loads chat messages history and listens for upcoming ones.
FriendlyChat.prototype.loadMessages = function() {
  this.messagesRef = this.database.ref('tips');
  this.messagesRef.off();

  var setMessage = function(data) {
    var val = data.val();
    this.displayMessage(data.key, val.title, val.information, val.imageUrl);
  }.bind(this);
  this.messagesRef.limitToLast(12).on('child_added', setMessage);
  this.messagesRef.limitToLast(12).on('child_changed', setMessage);
};


// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
FriendlyChat.prototype.saveImageMessage = function(event) {
  event.preventDefault();
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
//
//
//

// Create the file metadata
var metadata = {
  contentType: 'image/*'
};

// Upload file and metadata to the object 'images/mountains.jpg'
var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
var downloadURL;
// Listen for state changes, errors, and completion of the upload.
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
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;
    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, function() {
  // Upload completed successfully, now we can get the download URL
  downloadURL = uploadTask.snapshot.downloadURL;

});
this.messagesRef.push({
  title: judull,
  information: informasii,
  imageUrl: downloadURL
}).then(function() {
}.bind(this)).catch(function(error) {
  console.error('Error writing new message to Firebase Database', error);
});

};



// Saves the messaging device token to the datastore.
FriendlyChat.prototype.saveMessagingDeviceToken = function() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(firebase.auth().currentUser.uid);
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
};

// Requests permissions to show notifications.
FriendlyChat.prototype.requestNotificationsPermissions = function() {
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    this.saveMessagingDeviceToken();
  }.bind(this)).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
};

// Resets the given MaterialTextField.
FriendlyChat.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
FriendlyChat.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"></div>' +
      '<div class="title"></div>' +
      '<div class="information"></div>' +
      '<div class="imageUrl"></div>' +
    '</div>';


// A loading image URL.
// FriendlyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
FriendlyChat.prototype.displayMessage = function(key, title, information, imageUrl) {
  var div = document.getElementById(key);
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  // if (picUrl) {
  //   div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  // }
  div.querySelector('.title').textContent = title;
  div.querySelector('.information').textContent = information;
  div.querySelector('.imageUrl').textContent = imageUrl;


  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};


FriendlyChat.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
FriendlyChat.prototype.checkSetup = function() {
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
  window.friendlyChat = new FriendlyChat();
};
