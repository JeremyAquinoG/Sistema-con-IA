// src/MainRouter.jsx
import { Routes, Route } from 'react-router-dom';
import App from './App';
import DisplayData from './DisplayData';
import Login from './Login';

function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/data-entry" element={<App />} />
      <Route path="/display/:nroCertificado" element={<DisplayData />} />
    </Routes>
  );
}

export default MainRouter;
