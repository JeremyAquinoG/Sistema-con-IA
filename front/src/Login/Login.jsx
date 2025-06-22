import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BiUser, BiLock, BiEnvelope } from 'react-icons/bi';
import '../Login/Login.css';
import getURL from '../Config/config';
import logoSMC from '../assets/smclogo.png';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true);
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
            setError('Por favor, ingrese ambos, usuario y contraseña.');
            return;
        }

        try {
            const response = await axios.post(getURL() + '/register', { username, password });
            if (response.status === 201) {
                setError('Usuario registrado con éxito. Ahora puede iniciar sesión.');
                setIsLogin(true);
            } else {
                setError('Registro fallido, intente nuevamente.');
            }
        } catch (error) {
            setError('Registro fallido, intente nuevamente.');
            console.error('Error de registro:', error);
        }
    };

    return (
        <div className={`login-wrapper ${isLogin ? '' : 'active'}`}>
            <div className="box">
                {/* Formulario */}
                <div className="form-box">
                    <div className={`form-content ${isLogin ? 'slide-in-left' : 'slide-in-right'}`}>
                        <form onSubmit={isLogin ? handleLogin : handleRegister}>
                            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                            {error && <p className="text-danger" style={{ textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

                            <div className="input-box">
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label>Nombre de usuario</label>
                                <BiUser />
                            </div>

                            {!isLogin && (
                                <div className="input-box">
                                    <input type="email" required />
                                    <label>Email</label>
                                    <BiEnvelope />
                                </div>
                            )}

                            <div className="input-box">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label>Contraseña</label>
                                <BiLock />
                            </div>

                            <button type="submit" className="btn">{isLogin ? 'Login' : 'Sign Up'}</button>

                            <p className="toggle">
                                {isLogin ? "¿No tiene una cuenta?" : "¿Ya tiene una cuenta?"}
                                <span onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? ' Regístrese aquí' : ' Inicie sesión aquí'}
                                </span>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Panel lateral */}
                <div className="side-box">
                     <div className="glass-bg"></div>
                    <img src={logoSMC} alt="Logo SMC" />
                    
                </div>
            </div>
        </div>
    );
}

export default Login;
