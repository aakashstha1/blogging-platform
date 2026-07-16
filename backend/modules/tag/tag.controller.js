import {
  createTagService,
  deleteTagByIdService,
  getTagByIdService,
  getTagsService,
  updateTagByIdService,
} from "./tag.service.js";

// --------------------------------------------- Create a new tag ---------------------------------------------
export const createTag = async (req, res, next) => {
  try {
    const tag = await createTagService(req.body);
    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Get all categories ---------------------------------------------
export const getTags = async (req, res, next) => {
  try {
    const categories = await getTagsService();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Get tag by id ---------------------------------------------
export const getTagById = async (req, res, next) => {
  try {
    const tag = await getTagByIdService(req.params.id);
    res.status(200).json(getTags);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Update tag by id ---------------------------------------------
export const updateTag = async (req, res, next) => {
  try {
    const tag = await updateTagByIdService(req.params.id, req.body);
    res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Delete tag by id ---------------------------------------------
export const deleteTag = async (req, res, next) => {
  try {
    await deleteTagByIdService(req.params.id);
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    next(error);
  }
};
