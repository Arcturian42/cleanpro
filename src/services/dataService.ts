import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dataService = {
  // Real-time listener factory
  listenToCollection: (collectionPath: string, callback: (data: any[]) => void) => {
    const q = query(collection(db, collectionPath));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    });
  },

  // Generic write
  saveDoc: async (collectionPath: string, id: string, data: any) => {
    try {
      await setDoc(doc(db, collectionPath, id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${id}`);
    }
  },

  // Generic update
  updateDoc: async (collectionPath: string, id: string, data: any) => {
    try {
      await updateDoc(doc(db, collectionPath, id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionPath}/${id}`);
    }
  },

  // Generic delete
  deleteDoc: async (collectionPath: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionPath, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionPath}/${id}`);
    }
  },

  // Connection test as required
  testConnection: async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }
};
