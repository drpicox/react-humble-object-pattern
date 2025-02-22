// src/controllers/SignupController.js

class Controller {
    notify() {}
}

export class SignupController extends Controller {
    constructor() {
        super();
        this.username = '';
        this.password = '';
        this.message = '';
    }
    
    setUsername(username) {
        this.username = username;
        this.notify();
    }
    
    setPassword(password) {
        this.password = password;
        this.notify();
    }
    
    isStrongPassword() {
        return this.password.length >= 8 &&
               /[A-Z]/.test(this.password) &&
               /\d/.test(this.password);
    }
    
    validate() {
        this.message = this.isStrongPassword() && this.username.trim().length > 0
            ? 'Success!'
            : 'Invalid credentials';
        this.notify();
    }
}
