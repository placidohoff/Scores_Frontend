import React from 'react';

import './App.css';
import { Footer, Header } from './Components';
import AppRoutes from './Routes/AppRoutes';

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100 bg-body">
      <Header />
      <main id='main' className='flex-grow-1'>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
