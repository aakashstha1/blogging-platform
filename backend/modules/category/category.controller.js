import {
  createCategoryService,
  deleteCategoryByIdService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryByIdService,
} from "./category.service.js";

// --------------------------------------------- Create a new category ---------------------------------------------
export const createCategory = async (req, res, next) => {
  try {
    const category = await createCategoryService(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Get all categories ---------------------------------------------
export const getCategories = async (req, res, next) => {
  try {
    const categories = await getCategoriesService();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Get category by id ---------------------------------------------
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Update category by id ---------------------------------------------
export const updateCategory = async (req, res, next) => {
  try {
    const category = await updateCategoryByIdService(req.params.id, req.body);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Delete category by id ---------------------------------------------
export const deleteCategory = async (req, res, next) => {
  try {
    await deleteCategoryByIdService(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
