import admin from 'firebase-admin';
import serviceAccount from './zctourapp-firebase-adminsdk-cwmqr-b4a6dfcc3f.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const setAdminClaim = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin claim set for user with UID: ${uid}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
};

// Replace 'USER_UID' with the UID of the user you want to make an admin
setAdminClaim('kDwdhlFcY1QI3Q8c9ZeljxrfI4G2');
