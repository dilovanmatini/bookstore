import {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
} from '../services/cartService.js';

export const getCartHandler = async (req, res) => {
    try {
        const cart = await getCart(req.userId);
        return res.status(200).json({
            success: true,
            message: 'Cart retrieved successfully',
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const addToCart = async (req, res) => {
    const { book_id: bookId, quantity = 1 } = req.body;

    if (!bookId) {
        return res.status(400).json({
            success: false,
            message: 'Please fill the following fields: book_id',
        });
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
            success: false,
            message: 'The quantity is invalid',
        });
    }

    const qty = Number(quantity);

    try {
        const result = await addCartItem(req.userId, bookId, qty);

        if (result.error === 'BOOK_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart: result.cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const updateCartItemHandler = async (req, res) => {
    const { quantity } = req.body;

    if (quantity === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Please fill the following fields: quantity',
        });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 0) {
        return res.status(400).json({
            success: false,
            message: 'quantity must be a non-negative integer',
        });
    }

    try {
        const result = await updateCartItem(req.userId, req.params.itemId, qty);

        if (result.error === 'CART_NOT_FOUND' || result.error === 'ITEM_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cart item updated',
            cart: result.cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const removeCartItemHandler = async (req, res) => {
    try {
        const result = await removeCartItem(req.userId, req.params.itemId);

        if (result.error === 'CART_NOT_FOUND' || result.error === 'ITEM_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cart item removed',
            cart: result.cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const clearCartHandler = async (req, res) => {
    try {
        const result = await clearCart(req.userId);
        return res.status(200).json({
            success: true,
            message: 'Cart cleared',
            cart: result.cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
