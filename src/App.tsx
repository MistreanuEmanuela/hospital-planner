import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react'
import FirstPage from './FirstPageFolder/FirstPage';
import Verificare from './VerificationPage/Verificare'
import Appointment from './AppRequestPage/AppRequest'
import Doc from './DocPage/Doc'

function App(): JSX.Element {

    return (
      <Router>
      <Routes>
        <Route path="/" element={<FirstPage />}/>
        <Route path="/Verificare" element={<Verificare />} />
        <Route path="/Appointment" element={<Appointment />} />
        <Route path="/Doc" element={<Doc />} />
        </Routes>
         </Router>
  );
}
export default App;
