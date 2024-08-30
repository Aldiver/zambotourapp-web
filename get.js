import admin from 'firebase-admin';
import serviceAccount from './zctourapp-firebase-adminsdk-cwmqr-b4a6dfcc3f.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const getCustomClaims = async (uid) => {
  try {
    const user = await admin.auth().getUser(uid);
    console.log('Custom claims:', user.customClaims);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

// Replace 'USER_UID' with the UID of the user you want to make an admin
getCustomClaims('kDwdhlFcY1QI3Q8c9ZeljxrfI4G2');
