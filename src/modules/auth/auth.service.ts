import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../database/prisma.js";
import { validateEmail, validatePassword } from "../../shared/utils/validation.js";

export const register = async (data: any) => {
  const { email, password } = data;

  // Validate email format
  if (!email || !validateEmail(email)) {
    throw new Error("Invalid email format");
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }

  // Check for duplicate email
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  return { message: "User registered", user };
};

export const login = async (data: any) => {
  const { email, password } = data;

  // Validate inputs
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid email or password");

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };

    // Verify user still exists
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
