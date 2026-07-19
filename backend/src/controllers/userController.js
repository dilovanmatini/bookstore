import bcrypt from 'bcryptjs';
import { Role } from '../constants/role.js';
import {
    listUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    setUserActiveStatus,
    deleteUser,
    sanitizeUser,
} from '../services/userService.js';
import { deleteSessionsByUserId } from '../services/sessionService.js';

export const getUsers = async (req, res) => {
    try {
        const users = await listUsers({
            query: req.query.query,
            limit: req.query.limit || 20,
            offset: req.query.offset || 0,
        });

        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            user: sanitizeUser(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const createUserHandler = async (req, res) => {
    const { name, email, password, phone, role = Role.User } = req.body;
    const missing = [];

    if (!name) missing.push('name');
    if (!email) missing.push('email');
    if (!password) missing.push('password');

    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Please fill the following fields: ${missing.join(', ')}`,
        });
    }

    if (![Role.Admin, Role.User].includes(role)) {
        return res.status(400).json({
            success: false,
            message: `role must be one of: ${Role.Admin}, ${Role.User}`,
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
            role,
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

export const updateUserHandler = async (req, res) => {
    const { name, email, phone, role, password, is_active: isActive } = req.body;

    if (
        name === undefined &&
        email === undefined &&
        phone === undefined &&
        role === undefined &&
        password === undefined &&
        isActive === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: 'Provide at least one field to update',
        });
    }

    if (role !== undefined && ![Role.Admin, Role.User].includes(role)) {
        return res.status(400).json({
            success: false,
            message: `role must be one of: ${Role.Admin}, ${Role.User}`,
        });
    }

    try {
        const existing = await getUserById(req.params.id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (email && email !== existing.email) {
            const emailTaken = await getUserByEmail(email);
            if (emailTaken) {
                return res.status(409).json({
                    success: false,
                    message: 'Email is already registered',
                });
            }
        }

        let hashedPassword;
        if (password !== undefined) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const user = await updateUser(req.params.id, {
            name,
            email,
            phone,
            role,
            password: hashedPassword,
            isActive,
        });

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: sanitizeUser(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const setUserActiveHandler = async (req, res) => {
    const { is_active: isActive } = req.body;

    if (typeof isActive !== 'boolean' && isActive !== 0 && isActive !== 1) {
        return res.status(400).json({
            success: false,
            message: 'is_active must be a boolean',
        });
    }

    try {
        const existing = await getUserById(req.params.id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const active = Boolean(isActive);
        const user = await setUserActiveStatus(req.params.id, active);

        if (!active) {
            await deleteSessionsByUserId(req.params.id);
        }

        return res.status(200).json({
            success: true,
            message: 'User status updated successfully',
            user: sanitizeUser(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const deleteUserHandler = async (req, res) => {
    try {
        if (Number(req.params.id) === Number(req.userId)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account',
            });
        }

        const deleted = await deleteUser(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
