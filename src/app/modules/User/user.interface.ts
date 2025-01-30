import { Document } from 'mongoose';
import { USER_ROLE } from './user.constant';

// export interface TUser {
export interface TUser extends Document {
  // id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'customer';
  status?: 'active' | 'blocked';
  isBlocked: boolean;
  isDeleted: boolean;
  // createdAt: Date;
  // updatedAt: Date;
}

export type TUserRole = keyof typeof USER_ROLE;
