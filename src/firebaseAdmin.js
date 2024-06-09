// firebaseAdmin.js
const admin = require('firebase-admin');

const serviceAccount = require('./sindh-revenue-board-firebase-adminsdk.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
