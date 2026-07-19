import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { Role } from '../constants/role.js';
import { getUserById } from '../services/userService.js';
import { getValidSession } from '../services/sessionService.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication token is missing',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.jwt.secret);

        if (!decoded.jti) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }

        const session = await getValidSession(decoded.jti);

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }

        const user = await getUserById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive',
            });
        }

        req.userId = user.id;
        req.user = user;
        req.sessionJti = decoded.jti;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== Role.Admin) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required',
        });
    }

    next();
};
