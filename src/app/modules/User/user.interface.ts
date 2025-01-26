/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE, USER_STATUS } from './user.constant';

export interface TUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: keyof typeof USER_ROLE; // Role values based on USER_ROLE constant
  status: typeof USER_STATUS[number]; // Status values based on USER_STATUS constant
  isDeleted: boolean;
  profileImg?: string; 
}

export interface UserModel extends Model<TUser> {
  // Instance methods for checking if the user exists by custom ID
  isUserExistsById(_id: string): Promise<TUser | null>;

  // Instance methods for checking if passwords match
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;

  // Instance methods for checking if JWT was issued before password change
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}

// Type for user roles
export type TUserRole = keyof typeof USER_ROLE;
