/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { USER_ROLE, USER_STATUS } from './user.constant';
import { TUser, UserModel } from './user.interface';

const userSchema = new Schema<TUser, UserModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            //   select: false, // Ensure password is not returned in queries by default
            select: 0,
        },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        passwordChangedAt: {
            type: Date,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLE), // Dynamically bind roles from USER_ROLE
            required: true,
        },
        status: {
            type: String,
            enum: USER_STATUS, // Dynamically bind statuses from USER_STATUS
            default: 'active',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
    const user = this; // Document instance

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(
            user.password,
            Number(config.bcrypt_salt_rounds)
        );
    }
    next();
});

// Post-save middleware to remove password from the response
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

// Static method to check if the user exists by custom ID
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password');
};

// Static method to check if the password matches
userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Static method to check if JWT was issued before password was changed
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
) {
    const passwordChangedTime =
        new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
