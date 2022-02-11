//import firebase from 'firebase/app';
//import '@firebase/messaging';

/*
let messaging;

if(firebase.messaging.isSupported()) {

   messaging = firebase.messaging();

  messaging.setBackgroundMessageHandler(function(payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification("my notification title");
    });
  return promiseChain;
  });
}
*/

/*
export function register() {
  window.addEventListener('load', () => {

    const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          console.log("service worker registrado");
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        console.log('No se dio permiso a la aplicación para mostrar notificaciones');
      }
    });
  });
}

export function listen() {
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

  messaging.onMessage((payload) => {
    Notification
      .requestPermission()
      .then(function() {
        var notificationOptions = {
          body: payload.data.body,
          icon: '/logo-rtorres.bmp',
        };
        let noti = new Notification(payload.data.title, notificationOptions);
        noti.onclick = function(event) {
          window.open("https://rtorresapp.com:3000")
        };
      });
  });
}
*/