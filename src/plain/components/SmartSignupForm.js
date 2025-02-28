// src/components/SmartSignupForm.js
import React, { useState } from 'react';

export function SmartSignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const isStrongPassword = (password) => {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /\d/.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isStrongPassword(password) && username.trim().length > 0) {
            setMessage('Success!');
        } else {
            setMessage('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div>{message}</div>

            <button type="submit">Sign Up</button>
        </form>
    );
}
