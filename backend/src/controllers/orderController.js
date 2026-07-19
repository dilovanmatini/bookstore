import { AdminUpdatableStatuses } from '../constants/orderStatus.js';
import {
    checkout,
    listUserOrders,
    getOrderWithItems,
    cancelUserOrder,
    listAdminOrders,
    updateOrderStatus,
} from '../services/orderService.js';

export const checkoutHandler = async (req, res) => {
    const { address } = req.body;

    try {
        const result = await checkout(req.userId, address);

        if (result.error === 'CART_EMPTY') {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty',
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: result.order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await listUserOrders(req.userId, {
            status: req.query.status,
        });

        return res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getOrder = async (req, res) => {
    try {
        const order = await getOrderWithItems(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order retrieved successfully',
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const result = await cancelUserOrder(req.userId, req.params.id);

        if (result.error === 'NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (result.error === 'INVALID_STATUS') {
            return res.status(400).json({
                success: false,
                message: 'Only pending orders can be cancelled',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order: result.order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getAdminOrders = async (req, res) => {
    try {
        const orders = await listAdminOrders({
            query: req.query.query,
            status: req.query.status,
            limit: req.query.limit || 20,
            offset: req.query.offset || 0,
        });

        return res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getAdminOrder = async (req, res) => {
    try {
        const order = await getOrderWithItems(req.params.id);

        if (!order || order.status === 'draft') {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order retrieved successfully',
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const updateAdminOrder = async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: 'Please fill the following fields: status',
        });
    }

    if (!AdminUpdatableStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `status must be one of: ${AdminUpdatableStatuses.join(', ')}`,
        });
    }

    try {
        const result = await updateOrderStatus(req.params.id, status);

        if (result.error === 'NOT_FOUND' || result.error === 'INVALID_STATUS') {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: result.order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
