// src/components/HumbleSignupForm.js
import React from 'react';
import { useController } from '../hooks/useController';
import { SignupController } from '../controllers/SignupController';

export function HumbleSignupForm() {
    const controller = useController(SignupController);

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            controller.validate();
        }}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    value={controller.username}
                    onChange={(e) => controller.setUsername(e.target.value)}
                />
            </div>
            
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={controller.password}
                    onChange={(e) => controller.setPassword(e.target.value)}
                />
            </div>

            <div>{controller.message}</div>

            <button type="submit">Sign Up</button>
        </form>
    );
}
