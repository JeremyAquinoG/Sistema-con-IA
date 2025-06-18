import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import DataEntryForm from '../Components/DataEntryForm';
import DocumentList from '../Components/DocumentList';


function Dashboard() {
    const navigate = useNavigate();
const [activeView, setActiveView] = useState('home');
    const handleLogout = () => {
        // Aquí puedes limpiar tokens si estás usando auth
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2 className="logo">SMC</h2>
                <ul className="menu">
  <li onClick={() => setActiveView('home')}>Inicio</li>
  <li onClick={() => setActiveView('formulario')}>Ingresar Datos</li>
  <li onClick={() => setActiveView('docs')}>Documentos</li>
  <li onClick={() => setActiveView('config')}>Configuración</li>
  <li onClick={() => navigate('/')}>Cerrar Sesión</li>
</ul>

            </aside>
            <main className="main-content">
  {activeView === 'home' && <h1>Bienvenido al Dashboard</h1>}
  {activeView === 'formulario' && <DataEntryForm />}
  {activeView === 'docs' && <DocumentList />}
  {activeView === 'config' && <p>Sección de Configuración (en desarrollo)</p>}
   
</main>

        </div>
    );
}

export default Dashboard;
