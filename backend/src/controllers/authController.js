import { registerService } from '../services/authService.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    const { name, email, password, phone } = req.body;

    let error = [];

    if (!name) {
        error.push('Name');
    }

    if (!email) {
        error.push('Email');
    }

    if (!password) {
        error.push('Password');
    }

    if (error) {
        return res.status(400).json({
            success: false,
            message: `Please fill the following fields: ${error.join(', ')}`,
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await registerService(name, email, hashedPassword, 'user', phone);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
    
    return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: user,
    });
};