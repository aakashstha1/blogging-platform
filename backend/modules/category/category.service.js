import { ConflictError, NotFoundError } from "../../utils/errors.js";
import Category from "./category.model.js";
import slugify from "slugify";

// --------------------------------------------- Create a new category ---------------------------------------------
export const createCategoryService = async (categoryData) => {
  const { name } = categoryData;

  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (existingCategory) {
    throw new ConflictError("Category already exists with this name");
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  return await Category.create({
    ...categoryData,
    slug,
  });
};

// --------------------------------------------- Get all categories ---------------------------------------------
export const getCategoriesService = async () => {
  const categories = await Category.find();
  if (categories.length === 0) {
    throw new NotFoundError("No categories found");
  }
  return categories;
};

// --------------------------------------------- Get a category by ID ---------------------------------------------
export const getCategoryByIdService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  return category;
};

// --------------------------------------------- Update a category by ID ---------------------------------------------
export const updateCategoryByIdService = async (categoryId, updateData) => {
  const { name } = updateData;

  if (name) {
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      throw new ConflictError("This name is already taken.");
    }

    updateData.slug = slugify(name, {
      lower: true,
      strict: true,
    });
  }

  const category = await Category.findByIdAndUpdate(categoryId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  return category;
};

// --------------------------------------------- Delete a category by ID ---------------------------------------------
export const deleteCategoryByIdService = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
};
