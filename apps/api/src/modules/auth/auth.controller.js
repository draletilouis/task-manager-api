import * as AuthService from './auth.service.js';

/**
 * Handle user registration
 */
export async function register(req, res) {
    try {
        const result = await AuthService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Handle user login
 */
export async function login(req, res) {
    try {
        const tokens = await AuthService.login(req.body);
        res.status(200).json(tokens);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

/**
 * Handle token refresh
 */
export async function refresh(req, res) {
    try {
        const { refreshToken } = req.body;
        const newTokens = await AuthService.refreshAccessToken(refreshToken);
        res.status(200).json(newTokens);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

/**
 * Handle password change
 */
export async function changePassword(req, res) {
    try {
        const userId = req.user.userId;
        const result = await AuthService.changePassword(userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Handle password reset request
 */
export async function requestPasswordReset(req, res) {
    try {
        const result = await AuthService.requestPasswordReset(req.body.email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Handle password reset
 */
export async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;
        const result = await AuthService.resetPassword(token, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}