import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    console.log("Auth state listener setup");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "logged in" : "logged out");
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      return userCredential.user;
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  }, []);

  const formatAuthError = (error) => {
    const errorMessages = {
      "auth/email-already-in-use":
        "The email address is already in use by another account.",
      "auth/invalid-email": "The email address is invalid.",
      "auth/operation-not-allowed": "Email/password accounts are not enabled.",
      "auth/weak-password": "The password is too weak.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/user-not-found":
        "There is no user record corresponding to this email.",
      "auth/wrong-password": "The password is invalid for the given email.",
      "auth/too-many-requests":
        "Too many unsuccessful login attempts. Please try again later.",
    };

    return errorMessages[error.code] || error.message;
  };

  const getToken = useCallback(async () => {
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }, [currentUser]);

  const value = {
    currentUser,
    loading,
    authError,
    login,
    register,
    signOut,
    resetPassword,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
