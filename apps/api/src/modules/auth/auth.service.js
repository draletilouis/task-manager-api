import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../database/prisma.js';
import { validateEmail, validatePassword } from '../../shared/utils/validation.js';
import emailService from '../../shared/services/email.service.js';

/**
 * Register a new user
 */
export async function register(data){
    const { email, password, name } = data;

    // Validate email and password
    if (!validateEmail(email)) {
        throw new Error('Invalid email format.');
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
    }

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('Email already in use.');
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: name || null
        }
    });

    // Send welcome email (async, don't block registration)
    emailService.sendWelcome(user.email, user.name).catch(error => {
        console.error('Failed to send welcome email:', error);
    });

    return { message: 'User registered successfully', user: { id: user.id, email: user.email, name: user.name } };
}

/**
 * Login user and return JWT tokens
 */
export async function login(data) {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error('Email and password are required.');
    }

    // Find user and verify password
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error('Invalid email or password.');
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken) {
    if (!refreshToken) {
        throw new Error('Refresh token is required.');
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Verify user still exists
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            throw new Error('User not found.');
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        return { accessToken: newAccessToken };
    } catch (error) {
        throw new Error('Invalid refresh token.');
    }
}

/**
 * Change user password
 */
export async function changePassword(userId, data) {
    const { currentPassword, newPassword } = data;

    if (!currentPassword || !newPassword) {
        throw new Error('Current password and new password are required.');
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found.');
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
        throw new Error('Current password is incorrect.');
    }

    // Check if new password is same as current
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
        throw new Error('New password must be different from current password.');
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });

    return { message: 'Password changed successfully' };
}

/**
 * Request password reset
 * Generates a reset token and stores it (in production, would send email)
 */
export async function requestPasswordReset(email) {
    if (!email) {
        throw new Error('Email is required.');
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Don't reveal if email exists (security best practice)
    // Always return success to prevent email enumeration
    if (!user) {
        return {
            message: 'If an account with that email exists, a password reset link has been sent.',
            resetToken: null // Don't expose this in production
        };
    }

    // Generate secure random token
    const resetToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET + user.password, // Include password to invalidate token when password changes
        { expiresIn: '1h' }
    );

    // Store token and expiry in database
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken,
            resetTokenExpiry
        }
    });

    // Send password reset email
    try {
        await emailService.sendPasswordReset(user.email, resetToken);
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        // Don't throw error - we still want to return success to prevent email enumeration
    }

    return {
        message: 'If an account with that email exists, a password reset link has been sent.'
    };
}

/**
 * Reset password using token
 */
export async function resetPassword(token, newPassword) {
    if (!token || !newPassword) {
        throw new Error('Reset token and new password are required.');
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
    }

    // Find user with this token
    const user = await prisma.user.findUnique({
        where: { resetToken: token }
    });

    if (!user) {
        throw new Error('Invalid or expired reset token.');
    }

    // Check if token has expired
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        // Clear expired token
        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken: null, resetTokenExpiry: null }
        });
        throw new Error('Reset token has expired. Please request a new one.');
    }

    // Verify JWT token
    try {
        jwt.verify(token, process.env.JWT_SECRET + user.password);
    } catch (error) {
        throw new Error('Invalid reset token.');
    }

    // Check if new password is same as current (optional security measure)
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
        throw new Error('New password must be different from your current password.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });

    return { message: 'Password has been reset successfully. You can now log in with your new password.' };
}