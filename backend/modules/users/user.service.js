import User from "./user.model.js";

export const getUsers = async (req, res) => {
  const users = await User.find();
  if (users.length===0) {
    return res.status(404).json({ message: "No users found" });
  }
  res.status(200).json(users);
};