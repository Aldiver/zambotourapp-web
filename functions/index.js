/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.deleteUser = functions.https.onCall((data, context) => {
  // Only allow admins to delete users.
  // if (!context.auth || !context.auth.token.admin) {
  //   throw new functions.https.HttpsError('permission-denied', 'Must be an administrative user to delete a user.');
  // }

  const uid = data.uid;

  return admin.auth().deleteUser(uid)
    .then(() => {
      return { message: `Successfully deleted user with UID: ${uid}` };
    })
    .catch(error => {
      throw new functions.https.HttpsError('unknown', `Error deleting user with UID: ${uid}`, error);
    });
});
