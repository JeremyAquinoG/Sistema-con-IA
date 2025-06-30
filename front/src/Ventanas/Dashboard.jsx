import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import DataEntryForm from '../Components/DataEntryForm';
import DocumentList from '../Components/DocumentList';
import EditarPerfil from '../Components/EditarPerfil';
import Historial from '../Components/Historial';
import Principal from '../Components/Principal';


import Swal from 'sweetalert2';
import { FaHome, FaUsers, FaChartLine, FaWallet, FaBell, FaCog, FaSignOutAlt, FaQuestionCircle, FaLanguage, FaUserCircle, FaBook } from 'react-icons/fa';

function Dashboard() {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState('');

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

    useEffect(() => {
        const nombre = localStorage.getItem('nombreUsuario');
        if (nombre) {
            setNombreUsuario(nombre);
        }
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleMenuClick = (view) => {
        setActiveView(view);
        closeSidebar(); // Cerrar sidebar en móvil después de seleccionar
    };

    return (
        

        <div className="dashboard-container">
            <button
                className={`hamburger-btn ${sidebarOpen ? 'inactive' : ''}`}
                onClick={toggleSidebar}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>


            {/* Overlay para cerrar el menú en móvil */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'inactive' : ''}`}
                onClick={closeSidebar}
            ></div>

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'inactive' : ''}`}>
                <div className="profile-section">
                    <FaUserCircle className="profile-icon" />
                    <h3>{nombreUsuario || 'Usuario'}</h3>

                </div>
                <ul className="menu">
                    <li
                        className={activeView === 'home' ? 'active' : ''}
                        onClick={() => handleMenuClick('home')}
                    >
                        <FaHome /> Dashboard
                    </li>

                    <li
                        className={activeView === 'formulario' ? 'active' : ''}
                        onClick={() => handleMenuClick('formulario')}
                    >
                        <FaChartLine /> Ingresar Datos
                    </li>

                    <li
                        className={activeView === 'docs' ? 'active' : ''}
                        onClick={() => handleMenuClick('docs')}
                    >
                        <FaWallet /> Documentos
                    </li>

                    <li
                        className={activeView === 'notifications' ? 'active' : ''}
                        onClick={() => handleMenuClick('notifications')}
                    >
                        <FaBook /> Historial
                    </li>

                    <li
                        className={activeView === 'config' ? 'active' : ''}
                        onClick={() => handleMenuClick('config')}
                    >
                        <FaCog /> Configuración
                    </li>


                </ul>
                <ul className="bottom-toggle">
                    <li onClick={handleLogout}>
                        <FaSignOutAlt /> Cerrar Sesión
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <div className="main-section">


                {/* View Content */}
                <main className="main-content">
                    {activeView === 'home' && <Principal/>}
                    {activeView === 'formulario' && (
                        <div className="formulario-wrapper">
                            <DataEntryForm />
                        </div>
                    )}
                    {activeView === 'docs' && <DocumentList />}
                    {activeView === 'notifications' && <Historial/>}
                    {activeView === 'config' && <EditarPerfil />}

                </main>
            </div>
        </div>
       
    );
}

export default Dashboard;