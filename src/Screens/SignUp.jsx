import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Login from './Login';
import Swal from 'sweetalert2';
import './Signup.css';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [signedUp, setSignedUp] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Signup successful:', user);
            setSignedUp(true);

            Swal.fire({
                icon: 'success',
                title: 'Signup Successful!',
                text: 'You can now proceed to login.',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        
        <>
        {!signedUp && (
        <div className='signup-container'>
                    <h2>IOCL Fastag Signup</h2>
                    <form onSubmit={handleSignup}>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                    {error && <p>{error}</p>}
                    <p>Already have an account? <button onClick={() => setSignedUp(true)}>Login</button></p>
        </div>
            )}
            {signedUp && <Login/>} {/* Render Login component if signedUp is true */}
            </>
        
            
        
    );
};
export default SignUp;
