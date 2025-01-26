/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { TUser } from './user.interface';
import { User } from './user.model';
import { USER_ROLE } from './user.constant';

/**
 * Create a new customer and store it in the database.
 */
const createCustomerIntoDB = async (file: any, password: string, payload: Partial<TUser>) => {
  const userData: Partial<TUser> = {
    password: password || 'defaultPassword123', // Use the provided password or default
    role: USER_ROLE.customer,
    email: payload.email,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if a profile image file is provided
    if (file) {
      const imageName = `${userData._id || payload.email}`;
      const path = file.path;

      // Upload the image to Cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // Create the customer user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create customer');
    }

    await session.commitTransaction();
    await session.endSession();

    return newUser[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

/**
 * Create a new admin and store it in the database.
 */
const createAdminIntoDB = async (file: any, password: string, payload: Partial<TUser>) => {
  const userData: Partial<TUser> = {
    password: password || 'defaultPassword123', // Use the provided password or default
    role: USER_ROLE.admin,
    email: payload.email,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if a profile image file is provided
    if (file) {
      const imageName = `${userData._id || payload.email}`;
      const path = file.path;

      // Upload the image to Cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // Create the admin user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newUser[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

/**
 * Retrieve the logged-in user's information.
 */
const getMe = async (userId: string, role: string) => {
  const result = await User.findOne({ _id: userId, role });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return result;
};

/**
 * Change the status of a user (e.g., active, blocked, pending).
 */
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return result;
};

/**
 * Retrieve all users.
 */
const getAllUsersFromDB = async (filters: Record<string, any>) => {
  const { role, status, page = 1, limit = 10 } = filters;

  const query: Partial<TUser> = {};
  if (role) query.role = role;
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const users = await User.find(query).skip(skip).limit(Number(limit));
  const total = await User.countDocuments(query);

  return { users, total };
};

const deleteUserFromDB = async (id: string) => {
    const user = await User.findById(id);
  
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
  
    // Mark the user as deleted
    const result = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  
    if (!result) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to delete user'
      );
    }
  
    return result;
  };
  

export const UserServices = {
  createCustomerIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
  getAllUsersFromDB,
  deleteUserFromDB,
};
