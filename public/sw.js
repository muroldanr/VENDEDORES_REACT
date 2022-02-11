importScripts('https://www.gstatic.com/firebasejs/6.4.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/6.4.2/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyDRmDOYFKDT_hPjlfBbdTzaABXOI03Z8TU",
  authDomain: "avanti-424cb.firebaseapp.com",
  databaseURL: "https://avanti-424cb.firebaseio.com",
  projectId: "avanti-424cb",
  storageBucket: "",
  messagingSenderId: "424503588203",
  appId: "1:424503588203:web:2ecb473d135a12e3"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(function(payload) {
  var notificationTitle = payload.data.title;
  var notificationOptions = {
    body: payload.data.body,
    icon: '/logo-rtorres.bmp'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('message', event =>  {
  let user = event.data;
  console.log(user);
  messaging.getToken().then((token) => {
    if (token) {
      fetch(user.path, {
        method: 'post',  
        headers: {  
          "Content-Type" : "application/json"
        },  
        body: JSON.stringify({
          UsuarioWeb: user.usuario,
          Token: token
        })
      }).then(function (response) {  
        console.log(response);
        console.log(response.data)
      })  
      .catch(function (error) {  
        console.log(error);
      });
    } else {
      console.log('Instancia de token no disponible, solicita permiso para generar uno');
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
  });
});

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://rtorresapp.com:3000")
  );
})