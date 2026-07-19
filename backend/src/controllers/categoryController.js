import {
    listCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../services/categoryService.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await listCategories({ query: req.query.query });
        return res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getCategory = async (req, res) => {
    try {
        const category = await getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const createCategoryHandler = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Please fill the following fields: Name',
        });
    }

    try {
        const category = await createCategory(name);
        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const updateCategoryHandler = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Please fill the following fields: Name',
        });
    }

    try {
        const existing = await getCategoryById(req.params.id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        const category = await updateCategory(req.params.id, name);
        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const deleteCategoryHandler = async (req, res) => {
    try {
        const deleted = await deleteCategory(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
