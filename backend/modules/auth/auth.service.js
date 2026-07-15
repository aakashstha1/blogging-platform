import { NotFoundError, UnauthorizedError } from "../../utils/errors.js";
import { getUserByUsernameService } from "../users/user.service.js";

export const loginUserService = async (loginData) => {
  const { username, password } = loginData;
  const user = await getUserByUsernameService(username);

  const passwordWithPepper = password + process.env.PEPPER;

  const isPasswordMatch = await bcryptjs.compare(
    passwordWithPepper,
    user.password,
  );
  if (!isPasswordMatch) {
    throw new UnauthorizedError("Invalid password");
  }

  const { password: _, ...rest } = user.toObject();

  return rest;
};
