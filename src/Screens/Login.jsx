import React, { useState } from 'react';
import './Login.css'; 
import Publicpage from './Publicpage';
import SignUp from './SignUp';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [showSignup, setShowSignup] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Signed in
            const user = userCredential.user;
            setAuthenticated(true);
            setShowSignup(false); 
            console.log(user);
        } catch (error) {
            setError('Error signing in: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSuccess = () => {
        setShowSignup(false); 
    };

    return (
        <>
            {!authenticated && !showSignup && (
                <div className="login-container">
                    <h2>IOCL Fastag Login</h2> 
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin(e.target.email.value, e.target.password.value);
                    }}>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="password" name="password" />
                        </div>
                        <button type="submit">{loading ? 'Logging in...' : 'Login'}</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                    <p>Don't have an account? <button onClick={() => setShowSignup(true)}>Sign up</button></p>
                </div>
            )}
            {showSignup && <SignUp onSignupSuccess={handleSignupSuccess} />}
            {authenticated && <Publicpage />}
        </>
    );
};

export default Login;
