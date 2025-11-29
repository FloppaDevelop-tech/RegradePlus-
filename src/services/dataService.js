import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  SUBMISSIONS: 'submissions'
};

// Helper to convert Firestore timestamp to ISO string
const timestampToISO = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

export const dataService = {
  // ==================== USERS ====================
  
  // Get all users
  getUsers: async () => {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS);
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  },

  // Save/Update user
  saveUser: async (user) => {
    try {
      const userId = user.email.replace(/[.@]/g, '_'); // Use email as ID (sanitized)
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      
      await setDoc(userRef, {
        ...user,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      return { success: true };
    } catch (error) {
      console.error('Error saving user:', error);
      return { success: false, error: error.message };
    }
  },

  // Save multiple users (for migration)
  saveUsers: async (users) => {
    try {
      const promises = users.map(user => dataService.saveUser(user));
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('Error saving users:', error);
      return { success: false, error: error.message };
    }
  },

  // ==================== SUBMISSIONS ====================
  
  // Get all submissions
  getSubmissions: async () => {
    try {
      const submissionsRef = collection(db, COLLECTIONS.SUBMISSIONS);
      const snapshot = await getDocs(submissionsRef);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: timestampToISO(data.submittedAt),
          completedAt: timestampToISO(data.completedAt),
          deletedAt: timestampToISO(data.deletedAt)
        };
      });
    } catch (error) {
      console.error('Error getting submissions:', error);
      return [];
    }
  },

  // Subscribe to submissions (real-time updates)
  subscribeToSubmissions: (callback) => {
    try {
      const submissionsRef = collection(db, COLLECTIONS.SUBMISSIONS);
      
      return onSnapshot(submissionsRef, (snapshot) => {
        const submissions = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            submittedAt: timestampToISO(data.submittedAt),
            completedAt: timestampToISO(data.completedAt),
            deletedAt: timestampToISO(data.deletedAt)
          };
        });
        callback(submissions);
      }, (error) => {
        console.error('Error in submissions subscription:', error);
      });
    } catch (error) {
      console.error('Error subscribing to submissions:', error);
      return () => {}; // Return empty unsubscribe function
    }
  },

  // Add new submission
  addSubmission: async (submission) => {
    try {
      const submissionId = submission.id || Date.now().toString();
      const submissionRef = doc(db, COLLECTIONS.SUBMISSIONS, submissionId);
      
      await setDoc(submissionRef, {
        ...submission,
        submittedAt: serverTimestamp()
      });
      
      return { success: true, id: submissionId };
    } catch (error) {
      console.error('Error adding submission:', error);
      return { success: false, error: error.message };
    }
  },

  // Update submission
  updateSubmission: async (id, updates) => {
    try {
      const submissionRef = doc(db, COLLECTIONS.SUBMISSIONS, id);
      
      await updateDoc(submissionRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating submission:', error);
      return { success: false, error: error.message };
    }
  },

  // Save submissions (for compatibility with old code)
  saveSubmissions: async (submissions) => {
    try {
      const promises = submissions.map(submission => {
        const submissionRef = doc(db, COLLECTIONS.SUBMISSIONS, submission.id);
        return setDoc(submissionRef, submission, { merge: true });
      });
      
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('Error saving submissions:', error);
      return { success: false, error: error.message };
    }
  },

  // Soft delete - move to trash
  deleteSubmission: async (id) => {
    try {
      const submissionRef = doc(db, COLLECTIONS.SUBMISSIONS, id);
      
      await updateDoc(submissionRef, {
        isDeleted: true,
        deletedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting submission:', error);
      return { success: false, error: error.message };
    }
  },

  // Restore from trash
  restoreSubmission: async (id) => {
    try {
      const submissionRef = doc(db, COLLECTIONS.SUBMISSIONS, id);
      
      await updateDoc(submissionRef, {
        isDeleted: false,
        deletedAt: null,
        status: 'รอตรวจ'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error restoring submission:', error);
      return { success: false, error: error.message };
    }
  },

  // Permanent delete - marks as permanently deleted but keeps data
  // This hides it from admin but students can still see it in their history
  permanentDeleteSubmission: async (id) => {
    try {
      const submissionRef = doc(db, COLLECTIONS.SUBMISSIONS, id);
      
      await updateDoc(submissionRef, {
        isPermanentlyDeleted: true
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error permanently deleting submission:', error);
      return { success: false, error: error.message };
    }
  }
};
