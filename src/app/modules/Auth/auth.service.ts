import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
// import { sendEmail } from '../../utils/sendEmail';
import { User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';


const registerUser = async (payload: { name: string; email: string; password: string }) => {
  const { name, email, password } = payload;

  // Check if the email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is already registered!');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  // Create the new user with the default role as 'customer'
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'customer', // Default role
  });

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
};

const loginUser = async (payload: TLoginUser) => {
  // const { email, password } = payload; 
   // Check if the user exists by email
  //  const user = await User.findOne({ email }).select('+password'); // Include password in the query
  const user = await User.findOne({ email: payload.email });


  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // Verify the password
  const isPasswordMatched = await User.isPasswordMatched(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  // Generate tokens
  const jwtPayload = { userId: user._id, role: user.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return { accessToken, refreshToken, needsPasswordChange: user.needsPasswordChange };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsById(userData.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  const isPasswordMatched = await User.isPasswordMatched(payload.oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password is incorrect');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    { id: userData.userId, role: userData.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return { success: true };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  const user = await User.isUserExistsById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Token is invalid due to password change');
  }

  const jwtPayload = { userId: user._id, role: user.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

const forgetPassword = async (userId: string) => {
  const user = await User.isUserExistsById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  const jwtPayload = { userId: user._id, role: user.role };

  const resetToken = createToken(jwtPayload, config.jwt_access_secret as string, '10m');

  const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken}`;
  // await sendEmail(user.email, 'Password Reset Request', resetUILink);

  return { resetLink: resetUILink };
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { userId } = decoded;

  if (payload.id !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid token for password reset');
  }

  const user = await User.isUserExistsById(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    { id: userId },
    { password: newHashedPassword, needsPasswordChange: false, passwordChangedAt: new Date() },
  );

  return { success: true };
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
