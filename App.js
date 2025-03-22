// // App.js
// import React from 'react';
// import Navigation from './src/navigation';

// export default function App() {
//   return <Navigation />;
// }
// src/App.js
import React from 'react';
import Navigation from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
        <Navigation />
    </AuthProvider>
  );
}
