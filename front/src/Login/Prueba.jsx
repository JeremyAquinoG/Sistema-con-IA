import "../Login/Prueba.css";

export default function LoginGlassmorphism() {
  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Panel - Form */}
        <div className="login-form-section">
          <h2 className="login-title">Login to system</h2>
          <p className="login-subtitle">
            Please enter your login information or <span className="register-link">click here</span> to registration
          </p>
          <form className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Enter your username" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>
            <div className="form-remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
        </div>

        {/* Right Panel - Decorative */}
        <div className="login-image-section"></div>
      </div>
    </div>
  );
}
