// src/redux/components/ReduxSignupForm.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setUsername, 
  setPassword, 
  validate,
  selectUsername,
  selectPassword,
  selectMessage
} from '../signupSlice';

export function ReduxSignupForm() {
    const dispatch = useDispatch();
    const username = useSelector(selectUsername);
    const password = useSelector(selectPassword);
    const message = useSelector(selectMessage);

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            dispatch(validate());
        }}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => dispatch(setUsername(e.target.value))}
                />
            </div>
            
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                />
            </div>

            <div>{message}</div>

            <button type="submit">Sign Up</button>
        </form>
    );
}