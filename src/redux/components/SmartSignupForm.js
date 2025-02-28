// src/redux/components/SmartSignupForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setUsername, 
  setPassword, 
  validate,
  selectMessage
} from '../controllers/SignupController';

export function SmartSignupForm() {
    const dispatch = useDispatch();
    const [username, setLocalUsername] = useState('');
    const [password, setLocalPassword] = useState('');
    const message = useSelector(selectMessage);

    const isStrongPassword = () => {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /\d/.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Update Redux state
        dispatch(setUsername(username));
        dispatch(setPassword(password));
        dispatch(validate());
    };

    const handleUsernameChange = (e) => {
        setLocalUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setLocalPassword(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                />
            </div>
            
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>

            <div>{message}</div>

            <button type="submit">Sign Up</button>
        </form>
    );
}