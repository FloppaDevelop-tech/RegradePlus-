import { auth } from '../firebase/config';
import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Extract user data
        return {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        throw error;
    }
};

// Register with Email and Password
export const registerWithEmail = async (email, password, name) => {
    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, {
            displayName: name
        });

        // Return user data
        return {
            uid: user.uid,
            email: user.email,
            name: name,
            photoURL: null,
            emailVerified: user.emailVerified
        };
    } catch (error) {
        console.error('Email Registration Error:', error);
        throw error;
    }
};

// Sign in with Email and Password
export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };
    } catch (error) {
        console.error('Email Login Error:', error);
        throw error;
    }
};

// Sign out
export const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Sign Out Error:', error);
        throw error;
    }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            callback({
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            });
        } else {
            callback(null);
        }
    });
};

export const authService = {
    signInWithGoogle,
    registerWithEmail,
    loginWithEmail,
    signOutUser,
    onAuthStateChange
};
