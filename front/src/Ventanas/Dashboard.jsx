import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import DataEntryForm from '../Components/DataEntryForm';
import DocumentList from '../Components/DocumentList';
import Swal from 'sweetalert2';
import { FaHome, FaUsers, FaChartLine, FaWallet, FaBell, FaCog, FaSignOutAlt, FaQuestionCircle, FaLanguage, FaUserCircle } from 'react-icons/fa';

function Dashboard() {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('home');

    const handleLogout = () => {
        Swal.fire({
            icon: 'warning',
            title: '¿Desea cerrar sesión?',
            text: 'Será redirigido al login.',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/');
            }
        });
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="profile-section">
                    <FaUserCircle className="profile-icon" />
                    <h3>SMC</h3>
                </div>
                <ul className="menu">
                    <li onClick={() => setActiveView('home')}><FaHome /> Dashboard</li>
                    <li onClick={() => setActiveView('formulario')}><FaChartLine /> Ingresar Datos</li>
                    <li onClick={() => setActiveView('docs')}><FaWallet /> Documentos</li>
                    <li onClick={() => setActiveView('notifications')}><FaBell /> Notificaciones</li>
                    <li onClick={() => setActiveView('help')}><FaQuestionCircle /> Ayuda</li>
                    <li onClick={() => setActiveView('config')}><FaCog /> Configuración</li>

                </ul>
                <ul className="bottom-toggle">
                    <li onClick={handleLogout}><FaSignOutAlt /> Cerrar Sesión</li>
                </ul>

            </aside>

            {/* Main Content */}
            <div className="main-section">
                {/* Top Navbar */}
                <header className="navbar">
                    <span>{new Date().toLocaleString()}</span>
                    <div className="navbar-right">
                        <span>Collection ▾</span>
                        <span><FaUserCircle /> Gilberto</span>
                    </div>
                </header>

                {/* View Content */}
                <main className="main-content">
                    {activeView === 'home' && <h1>Bienvenido al Dashboard</h1>}
                    {activeView === 'formulario' && (
                        <div className="formulario-wrapper">
                            <DataEntryForm />
                        </div>
                    )}

                    {activeView === 'docs' && <DocumentList />}
                    {activeView === 'notifications' && <h1>Notificaciones.</h1>}
                    {activeView === 'help' && <h1>Ayuda.</h1>}
                    {activeView === 'config' && <h1>Configuración.</h1>}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
