import { createUserService } from "../users/user.service";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await createUserService({ username, email, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};
