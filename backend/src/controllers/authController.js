import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { Role } from '../constants/role.js';
import {
    createUser,
    getUserByEmail,
    getUserById,
    sanitizeUser,
    updateUserProfile,
} from '../services/userService.js';
import {
    createSession,
    deleteSession,
    deleteSessionsByUserId,
    getValidSession,
} from '../services/sessionService.js';

const issueToken = async (userId) => {
    const jti = crypto.randomUUID();
    const token = jwt.sign({ id: userId, jti }, env.jwt.secret, {
        expiresIn: env.jwt.expiresIn,
    });
    const { exp } = jwt.decode(token);
    const expiresAt = new Date(exp * 1000);

    await createSession(userId, jti, expiresAt);

    return token;
};

export const register = async (req, res) => {
    const { name, email, password, phone } = req.body;
    const missing = [];

    if (!name) missing.push('Name');
    if (!email) missing.push('Email');
    if (!password) missing.push('Password');

    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Please fill the following fields: ${missing.join(', ')}`,
        });
    }

    try {
        const existing = await getUserByEmail(email);
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({
            name,
            email,
            password: hashedPassword,
            role: Role.User,
            phone,
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: sanitizeUser(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const missing = [];

    if (!email) missing.push('Email');
    if (!password) missing.push('Password');

    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Please fill the following fields: ${missing.join(', ')}`,
        });
    }

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = await issueToken(user.id);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const logout = async (req, res) => {
    try {
        if (req.sessionJti) {
            await deleteSession(req.sessionJti);
        }

        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await getUserById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Current user retrieved successfully',
            user: sanitizeUser(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const updateMe = async (req, res) => {
    const { name, phone, password } = req.body;

    if (name === undefined && phone === undefined && password === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Provide at least one of: name, phone, password',
        });
    }

    try {
        let hashedPassword;

        if (password !== undefined) {
            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: 'Password cannot be empty',
                });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const user = await updateUserProfile(req.userId, {
            name,
            phone,
            password: hashedPassword,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (hashedPassword && req.sessionJti) {
            const currentSession = await getValidSession(req.sessionJti);
            await deleteSessionsByUserId(req.userId);

            if (currentSession) {
                await createSession(req.userId, req.sessionJti, currentSession.expires_at);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: sanitizeUser(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
