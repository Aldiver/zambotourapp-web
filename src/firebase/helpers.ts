import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db, functions } from '../firebase';
import { storage } from '../firebase';
import { httpsCallable } from 'firebase/functions';

interface DeleteUserResponse {
  message: string;
}

// Get the callable function
const deleteUser = httpsCallable<{}, DeleteUserResponse>(functions, 'deleteUser');

export async function getDownloadUrl(coverImageFile: File): Promise<string> {
  const storageRef = ref(storage, coverImageFile.name);
  const uploadTask = uploadBytesResumable(storageRef, coverImageFile);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Upload failed:', error);
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        }).catch((error) => {
          reject(error);
        });
      }
    );
  });
}

export async function deleteDocument(collectionName: string, document: string){
  await deleteDoc(doc(db, collectionName, document));
}

export async function deleteUserFunction (uid: string) {
  try {
    const result = await deleteUser({ uid });
    console.log(result.data.message);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};