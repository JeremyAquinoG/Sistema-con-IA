import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Login/Login.css';
//import logo from './logo-smc.png';
import getURL from '../Config/config';
import Swal from 'sweetalert2';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Estado para cambiar entre login y registro
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, ingrese ambos, usuario y contraseña.',
            });
            return;
        }
        try {
            const response = await axios.post(`${getURL()}/login`, { username, password });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    text: 'Inicio de sesión exitoso',
                    timer: 2000,
                    showConfirmButton: false
                });

                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login fallido',
                    text: 'Intente nuevamente.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: error.response?.data?.message || 'Credenciales inválidas o error del servidor.',
            });
            console.error('Error de login:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, ingrese ambos, usuario y contraseña.',
            });
            return;
        }

        try {
            const response = await axios.post(`${getURL()}/register`, { username, password });

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Usuario registrado correctamente. Ahora puede iniciar sesión.',
                    timer: 2500,
                    showConfirmButton: false
                });

                setTimeout(() => {
                    setIsLogin(true);
                }, 2500);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registro fallido',
                    text: 'Intente nuevamente.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: error.response?.data?.message || 'Hubo un problema al registrar el usuario.',
            });
            console.error('Error de registro:', error);
        }
    };


    return (
        <div className="login-wrapper">
            <div className="login-left">
                <img src="https://smc-peru.com/appsmc/logo-smc.png" alt="Logo SMC" />
            </div>
            <div className="login-form">
                {isLogin ? (
                    <form onSubmit={handleLogin}>
                        <h2 className="login-title">Iniciar Sesión</h2>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Iniciar Sesión
                        </button>
                        <p className="mt-3 text-center">
                            ¿No tiene una cuenta?{' '}
                            <button type="button" onClick={() => setIsLogin(false)} className="btn btn-link">
                                Regístrese aquí
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        <h2 className="login-title">Registrarse</h2>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Registrarse
                        </button>
                        <p className="mt-3 text-center">
                            ¿Ya tiene una cuenta?{' '}
                            <button type="button" onClick={() => setIsLogin(true)} className="btn btn-link">
                                Inicie sesión aquí
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );

}

export default Login;
