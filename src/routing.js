import React from 'react';
import App from './App';
import { Route, Routes } from 'react-router-dom';

export const Routing = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<App/>} />
        {/* <Route path="/print" element={<Print/>} /> */}
      </Routes>
    </div>
  );
};

