import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
//import logo from './logo-smc.png';
import getURL from './config';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Estado para cambiar entre login y registro
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Por favor, ingrese ambos, usuario y contraseña.');
            return;
        }

        try {
            console.log(getURL()+'/login')
            //const response = await axios.post(getURL()+'/login', { username, password });
            const response = await axios.post('http://localhost:3000/api/login', { username, password });
            if (response.status === 200) {
                //navigate('/data-entry');
                navigate('/data-entry');  
                //navigate('/appsmc/data-entry');                
            } else {
                setError('Login fallido, intente nuevamente.');
            }
        } catch (error) {
            setError('Login fallido, intente nuevamente.');
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
            //console.log(getURL()+'/login')
            //const response = await axios.post(getURL()+'/register', { username, password });
            const response = await axios.post('http://localhost:3000/api/register', { username, password });
            if (response.status === 201) {
                setError('Usuario registrado con éxito. Ahora puede iniciar sesión.');
                setIsLogin(true); // Cambia a la vista de login después de registrar
            } else {
                setError('Registro fallido, intente nuevamente.');
            }
        } catch (error) {
            setError('Registro fallido, intente nuevamente.');
            console.error('Error de registro:', error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="row w-100">
                <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
                    <img src={"https://smc-peru.com/appsmc/logo-smc.png"} alt="Logo" className="img-fluid" />
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
                        {isLogin ? (
                            <form onSubmit={handleLogin}>
                                <h2 className="text-center">Iniciar Sesión</h2>
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
                                <br></br>
                                <button type="submit" className="btn btn-primary btn-block">
                                    Iniciar Sesión
                                </button>  
                                <p className="mt-3 text-center">
                                    ¿No tiene una cuenta? <button type="button" onClick={() => setIsLogin(false)} className="btn btn-link">Regístrese aquí</button>
                                </p>                       
                            </form>
                        ) : (
                            <form onSubmit={handleRegister}>
                                <h2 className="text-center">Registrarse</h2>
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
                                <br></br>
                                <button type="submit" className="btn btn-primary btn-block">
                                    Registrarse
                                </button>
                                <p className="mt-3 text-center">
                                    ¿Ya tiene una cuenta? <button type="button" onClick={() => setIsLogin(true)} className="btn btn-link">Inicie sesión aquí</button>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
