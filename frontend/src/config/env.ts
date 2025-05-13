const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_PROJECT_ID,
    VITE_STORAGE_BUCKET,
    VITE_MESSAGING_SENDER_ID,
    VITE_APP_ID,
    VITE_MEASUREMENT_ID,
    VITE_API_URL
} = import.meta.env;

export const firebaseVariables = {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_PROJECT_ID,
    storageBucket: VITE_STORAGE_BUCKET,
    messagingSenderId: VITE_MESSAGING_SENDER_ID,
    appId: VITE_APP_ID,
    measurementId: VITE_MEASUREMENT_ID,
}
export const apiVariables = {
    apiUrl: VITE_API_URL,
}