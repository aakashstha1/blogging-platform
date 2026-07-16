import { ConflictError, NotFoundError } from "../../utils/errors.js";
import Tag from "./tag.model.js";
import slugify from "slugify";

// --------------------------------------------- Create a new tag ---------------------------------------------
export const createTagService = async (tagData) => {
  const { name } = tagData;

  const existingTag = await Tag.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (existingTag) {
    throw new ConflictError("Tag already exists with this name");
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  return await Tag.create({
    ...tagData,
    slug,
  });
};

// --------------------------------------------- Get all tags ---------------------------------------------
export const getTagsService = async () => {
  const tags = await Tag.find();
  if (tags.length === 0) {
    throw new NotFoundError("No tags found");
  }
  return tags;
};

// --------------------------------------------- Get a tag by ID ---------------------------------------------
export const getTagByIdService = async (tagId) => {
  const tag = await Tag.findById(tagId);
  if (!tag) {
    throw new NotFoundError("Tag not found");
  }
  return tag;
};

// --------------------------------------------- Update a tag by ID ---------------------------------------------
export const updateTagByIdService = async (tagId, updateData) => {
  const { name } = updateData;

  if (name) {
    const existingTag = await Tag.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: tagId },
    });

    if (existingTag) {
      throw new ConflictError("This name is already taken.");
    }

    updateData.slug = slugify(name, {
      lower: true,
      strict: true,
    });
  }

  const tag = await Tag.findByIdAndUpdate(tagId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!tag) {
    throw new NotFoundError("Tag not found");
  }
  return tag;
};

// --------------------------------------------- Delete a tag by ID ---------------------------------------------
export const deleteTagByIdService = async (tagId) => {
  const tag = await Tag.findByIdAndDelete(tagId);
  if (!tag) {
    throw new NotFoundError("Tag not found");
  }
};
