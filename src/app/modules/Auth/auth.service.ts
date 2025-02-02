import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../User/user.model';
import AppError from '../../errors/AppError';
import { createToken } from './auth.utils';
import config from '../../config';
// import { USER_ROLE } from '../User/user.constant';
// import { Admin } from '../Admin/admin.model';

const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = payload;

  // Check if the email is already registered
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is already registered');
  }

  // Hash the password
  // const hashedPassword = await bcrypt.hash(
  //   password,
  //   Number(config.bcrypt_salt_rounds),
  // );

  // Create and save the user
  const newUser = await UserModel.create({
    
    name,
    email,
    password,
    // password: hashedPassword,
    role: "user",
  });

  // return {
  //   _id: newUser._id,
  //   name: newUser.name,
  //   email: newUser.email,
  // };
  return newUser ;
};



// const loginUser = async (payload: { email: string; password: string }) => {
//   const { email, password } = payload;

//   // console.log('f-service', email);

//   // Try finding the user in both UserModel and Admin collections
//   // let user = await UserModel.findOne({ email }); // Query UserModel first
//   const user = await UserModel.findOne({ email }); // Query UserModel first
//   // let isAdmin = false;

//   // if (!user) {
//   //   user = await Admin.findOne({ email }); // Query Admin collection if not found in UserModel
//   //   isAdmin = true; // Mark as admin for later checks
//   // }

//   // console.log('f-service user', user);

//   if (!user) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
//   }

//   // Check if the user is blocked or deleted
//   if (user.isBlocked) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
//   }
//   if (user.isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
//   }

//   // Verify password using bcrypt
//   // const isPasswordMatched = await bcrypt.compare(password, user.password);
//   // if (!isPasswordMatched) {
//   //   throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
//   // }

//   if (user.password !== password) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
//   }

//   // Verify role
//   // if (isAdmin && user.role !== USER_ROLE.admin) {
//   //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized as admin');
//   // }
//   // if (!isAdmin && user.role !== USER_ROLE.user) {
//   //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized as a user');
//   // }

//   // Create JWT payload
//   const jwtPayload = {
//     userId: user._id.toString(), // Convert ObjectId to string
//     role: user.role,
//   };

//   // Generate access token
//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     // config.jwt_access_expires_in as string,
//   );

//   return {
//     accessToken,
//     needsPasswordChange: user.needsPasswordChange,
//     role: user.role,
//   };
// };

// ----------------

const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  if (user.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const jwtPayload = {
    // userId: user._id.toString(),
    userId: user.id.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
    needsPasswordChange: user.needsPasswordChange,
    role: user.role,
  };
};

// ----------------

export const AuthServices = {
  registerUser,
  loginUser,
};
