let appID = "224823c2f82cb12b";
let region = "us";
let FCM_TOKEN = 'AAAA04jQsmY:APA91bEZnQiQeDPZ_k70brRU0LTFkOxf984t12KXTKIHdMPizjq1WV5IEKGDdGi6iANzaA0CZ8dp4TrI025Y081o2yAjyDQbUIU0hP_V0AU9tCHEGj8C0Lyo_xQMNBa4ewfF60J6zwg7';
let appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .autoEstablishSocketConnection(true)
  .build();
CometChat.init(appID, appSetting).then(
  () => {
    console.log("Initialization completed successfully");
  }, error => {
    console.log("Initialization failed with error:", error);
  }
);

// var sendMessageCondition = false;

async function login() {
  var UID = document.getElementById("uid").value;
  console.log(UID)
  var authKey = "e7cbd583336589d85743974a8f805a414975ae45";

  const messaging = firebase.messaging();
  FCM_TOKEN = await messaging.getToken();
  console.log('2. Received FCM Token', FCM_TOKEN);

  CometChat.login(UID, authKey).then(
    user => {
      console.log("Login Successful:", { user });
      onlogin(user, UID, authKey)

      loginListner()
    }, error => {
      console.log("RUN")
      console.log("Login failed with exception:", { error });

    }
  );
}

function loginListner() {
  let listenerID = "UNIQUE_LISTENER_ID";
  CometChat.addLoginListener(
    listenerID,
    new CometChat.LoginListener({
      loginSuccess: (e) => {
        console.log("LoginListener :: loginSuccess", e);

      },
      loginFailure: (e) => {
        console.log("LoginListener :: loginFailure", e);
      },
      logoutSuccess: () => {
        console.log("LoginListener :: logoutSuccess");
      },
      logoutFailure: (e) => {
        console.log("LoginListener :: logoutFailure", e);
      }
    })
  );
}



async function onlogin(user, UID, authKey) {
  console.log("Login Successful:", user);


  document.getElementById("login-card").style.display = 'none';
  document.getElementById("chat-card").style.display = 'block';
  document.getElementById('your-username').innerHTML = user.name;
  retriveConvos();

  const messaging = firebase.messaging(); 
  FCM_TOKEN = await messaging.getToken();
  console.log('2. Received FCM Token', FCM_TOKEN);

  // Register the FCM Token
  await CometChat.registerTokenForPushNotification(FCM_TOKEN);
  console.log('3. Registered FCM Token');


}

async function logout() {
  const messaging = firebase.messaging();
  FCM_TOKEN = await messaging.getToken();
  console.log('2. Received FCM Token', FCM_TOKEN);

  // Register the FCM Token
  await CometChat.registerTokenForPushNotification(FCM_TOKEN);
  console.log('3. Registered FCM Token');
  CometChat.logout().then(
    () => {

      console.log("Logout completed successfully");
      document.getElementById('conversation-card').innerHTML = "";
      document.getElementById("login-card").style.display = 'block';
      document.getElementById("chat-card").style.display = 'none';



      removeListner()
    }, error => {
      console.log("Logout failed with exception:", { error });
    }
  );
}
function removeListner() {
  let listenerID = "UNIQUE_LISTENER_ID";
  CometChat.removeLoginListener(
    listenerID,
  );
}

function retriveConvos() {
  let limit = 30;
  let conversationsRequest = new CometChat.ConversationsRequestBuilder()
    .setLimit(limit)
    .build();

  conversationsRequest.fetchNext().then(
    conversationList => {
      console.log(conversationList)
      // conversationList.filter(convo=>convo);
      addlist(conversationList)

    }, error => {
      console.log("Conversations list fetching failed with error:", error);
    }
  );
}

//  ADDING FETCHED LIST OF CONVERSATION 


function addlist(conversationList) {
  console.log("Printing List", conversationList)
  conversationList.map(function (elem, ind) {

    // console.log("elem",elem.conversationWith.guid || elem.conversationWith.guid )
    var app = document.getElementById('conversation-card');
    var div = document.createElement('div');
    div.setAttribute("class", "usernames");
    var p = document.createElement('p');
    p.textContent = elem.conversationWith.name;
    // console.log(elem.conversationWith.name)
    var btn = document.createElement("button");
    btn.textContent = "View";
    btn.setAttribute("id", "view-button");
    btn.addEventListener("click", function (elem, index) {
      console.log("INSIDE MAP", conversationList[ind].conversationType)
      console.log("INSIDE MAP", conversationList[ind].conversationWith)
      if (conversationList[ind].conversationType == 'user') {
        individual(conversationList[ind].conversationWith.uid, conversationList[ind].conversationType)

      }
      else {
        individual(conversationList[ind].conversationWith.guid, conversationList[ind].conversationType)
      }
    })
    div.append(p, btn);
    document.getElementById('conversation-card').append(div);
  })



}

// Sending A Message
Firebase

function sendMessage() {
  let receiverID = receiver_Id;
  let messageText = document.getElementById('message').value;
  let receiverType = type;
  let textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);
  individual(receiverID, receiverType)
  CometChat.sendMessage(textMessage).then(
    message => {
      console.log("Message sent successfully:", message);
      document.getElementById('message').innerText = ""
      // Firebase Notification
      const myInterval=(function() { 
        alert("Message to alert every 5 seconds"); 
        console.log("Interval Wala Message",message)

        console.log(message)
      }, 5000);

     window.clearInterval();

    }, error => {
      console.log("Message sending failed with error:", error);
    }
  );
}



var receiver_Id = "";
function individual(conversationWith, conversationType) {
  // console.log("inside INDIVIDUAL CONVERSATION WITH", conversationWith);
  // console.log("inside Individual", conversationType);

  // console.log("UserName = :", conversationWith)
  // messaging.onMessage((payload) => {
  //   console.log('Message received. ', payload);
  //   // ...
  // });

  document.getElementById("individualName").innerHTML = "";


  document.getElementById("individualName").textContent = conversationWith;
  CometChat.getConversation(conversationWith, conversationType).then(
    conversation => {
      console.log('conversation', conversation);

      // debugger
      receiver_Id = conversation.conversationWith.uid || conversation.conversationWith.guid

      console.log("IDDDDD", receiver_Id);
      if (conversationType == 'user') {
        let UID = conversationWith;
        let limit = 10;
        let messagesRequest = new CometChat.MessagesRequestBuilder()
          .setUID(UID)
          .setLimit(limit)
          .build();




        messagesRequest.fetchPrevious().then(
          messages => {

// Marking as Read for users


            console.log("Message list fetched:", messages);
            displayMessages(messages, conversationWith, conversationType)
          }, error => {
            console.log("Message fetching failed with error:", error);
          }
        );
      }
      else {

        let GUID = conversationWith;
        let limit = 10;
        let messagesRequest = new CometChat.MessagesRequestBuilder()
          .setGUID(GUID)
          .setLimit(limit)
          .build();

        messagesRequest.fetchPrevious().then(
          messages => {
            console.log("Message list fetched:", messages);

            // Marking as read 
            CometChat.markAsRead(message.getId(), message.getSender().getUid(), 'user', message.getSender().getUid()).then(
              () => {
                console.log("mark as read success.");
              }, error => {
                console.log("An error occurred when marking the message as read.", error);
              }
            );


            displayMessages(messages, conversationWith, conversationType)
          }, error => {
            console.log("Message fetching failed with error:", error);
          }
        );

      }

    }, error => {
      console.log('error while fetching a conversation', error);
    }
  );
}


var type = "";


function displayMessages(messages, conversationWith, conversationType) {
  type = conversationType;
  document.getElementById("messagesDIV").innerHTML = "";
  var uid = conversationWith;

  // console.log("UID", uid)
  // console.log("TYPE", conversationType)

  messages.map(function (message) {
    CometChat.markAsRead(message);
    console.log("After Marking", message);
    messageID = document.getElementById("messagesDIV");
    var messageP = document.createElement('p');
    messageP.setAttribute("class", "received_message");

    messageP.textContent = `${message.sender.name}: ${message.text || message.message}`
    messageID.append(messageP);


  })


  let listenerID = "UNIQUE_LISTENER_ID";
  CometChat.addMessageListener(
    listenerID,
    new CometChat.MessageListener({

      onTextMessageReceived: textMessage => {
        // if (type == 'user') {
        console.log(`receivers end ${conversationWith}===${textMessage.sender.guid}`)
        if (conversationWith === textMessage.sender.uid || conversationWith === textMessage.sender.guid) {
          console.log("Text message received successfully", textMessage);
          console.log("FIRST IS RUNNING");
          messages.push(textMessage)

          messages.map(function (e, i, messages) {
            if (i + 1 === messages.length) {
              messageID = document.getElementById("messagesDIV");
              var messageP = document.createElement('p');
              messageP.setAttribute("class", "received_message");
              messageP.textContent = `${e.sender.name}: ${e.text || e.message}`
              messageID.append(messageP);

            }
          })
          var receiverUID = textMessage.receiver.uid;
          console.log("receiver id", receiverUID)
          var messageType = textMessage.receiverType;
          console.log("message Type", messageType);
        }
        // }
        // else {

        // }

      },
      onMediaMessageReceived: mediaMessage => {
        console.log("Media message received successfully", mediaMessage);
      },
      onCustomMessageReceived: customMessage => {
        console.log("Custom message received successfully", customMessage);
      }
    })
  );


}

// SENDING  MESSAGE


// console.log("receiver id", receiver_Id);
// ;




// received Message Listener




// var receiverUID=message.receiver.uid;
// var senderUID=message.sender.uid;

// var i=0;
// 
// console.log("sender id",senderUID)



// let i = 0
// messages.map(function (e, i, messages) {
//   if (i + 1 === messages.length) {
//     messageID = document.getElementById("messagesDIV");
//     var messageP = document.createElement('p');
//     messageP.setAttribute("class", "received_message");
//     messageP.textContent = `${e.sender.name}: ${e.text || e.message}`
//     messageID.append(messageP);
//     console.log("HEY THIS IS RUNNING")
//     // msgListner();
//   }
// })
// messages.map(function (e, i, messages) {
//   // individual()
//   if (i + 1 === messages.length) {
//     messageID = document.getElementById("messagesDIV");
//     var messageP = document.createElement('p');
//     messageP.setAttribute("class", "received_message");
//     messageP.textContent = `${e.sender.name}: ${e.text || e.message}`
//     messageID.append(messageP);
//   }
// })

// let listenerID = "UNIQUE_LISTENER_ID";

// CometChat.addMessageListener(
//   listenerID,
//   new CometChat.MessageListener({
//     onTextMessageReceived: textMessage => {
//       console.log("SECOND IS RUNNING");
//       console.log("Text message received successfully", textMessage);
//     },
//     onMediaMessageReceived: mediaMessage => {
//       console.log("Media message received successfully", mediaMessage);
//     },
//     onCustomMessageReceived: customMessage => {
//       console.log("Custom message received successfully", customMessage);
//     }
//   })
// );

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(error => console.log('Registration error', error));
}




