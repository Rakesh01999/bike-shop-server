// import { User } from './user.interface'; // Import the user interface
import AppError from '../../errors/AppError';
import { TUser } from './user.interface'; // Import the user interface
import { UserModel } from './user.model';
import mongoose from 'mongoose';

// Create a new user in the database
const createUserInDB = async (user: TUser): Promise<TUser> => {
  const result = await UserModel.create(user); // Create user using the UserModel
  return result;
};

// Retrieve all users from the database with optional query filtering
const getAllUsersFromDB = async (
  query: Record<string, unknown> = {},
): Promise<TUser[]> => {
  const result = await UserModel.find(query); // Find users with optional filters
  return result;
};

// Retrieve a single user by ID from the database
const getSingleUserFromDB = async (id: string): Promise<TUser | null> => {
  const result = await UserModel.findById(id); // Find user by ID
  if (!result) {
    throw new AppError(404, 'User not found'); // Handle user not found
  }
  return result;
};

// Update a user in the database by ID
const updateUserInDB = async (
  id: string,
  payload: Partial<TUser>,
): Promise<TUser | null> => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators
  });
  if (!result) {
    throw new AppError(404, 'User not found for update');
  }
  return result;
};

// Soft delete a user by marking them as deleted
const deleteUserFromDB = async (id: string): Promise<TUser | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deletedUser = await UserModel.findByIdAndUpdate(
      id,
      { isDeleted: true }, // Soft delete by setting `isDeleted` to true
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(404, 'User not found for deletion');
    }

    await session.commitTransaction();
    return deletedUser;
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction Error:', error);
    throw new AppError(400, 'Failed to delete user');
  } finally {
    session.endSession();
  }
};

// Export the user services
export const UserServices = {
  createUserInDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
