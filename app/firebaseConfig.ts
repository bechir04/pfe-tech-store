import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCM1eynqZewjJSGnIJN7xj2yx2IbjyYKZU', // Get this from Project settings > Your apps
  authDomain: 'tech-ff62e.firebaseapp.com',
  projectId: 'tech-ff62e',
  storageBucket: 'tech-ff62e.firebasestorage.app',
  messagingSenderId: '108363831956', // From Project settings > General
  appId: 'tech-ff62e', // From Project settings > Your apps
};

export const app = initializeApp(firebaseConfig);
