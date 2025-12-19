import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email service for sending transactional emails
 */
class EmailService {
    constructor() {
        this.from = process.env.EMAIL_FROM || 'Kazi <onboarding@resend.dev>';
        this.appUrl = process.env.APP_URL || 'http://localhost:5173';
        this.enabled = !!process.env.RESEND_API_KEY;
    }

    /**
     * Send an email
     * @private
     */
    async send({ to, subject, html }) {
        if (!this.enabled) {
            console.warn('[Email Service] Email sending is disabled. Set RESEND_API_KEY to enable.');
            console.log('[Email Service] Would have sent email:', { to, subject });
            return { success: false, message: 'Email service not configured' };
        }

        try {
            const { data, error } = await resend.emails.send({
                from: this.from,
                to,
                subject,
                html,
            });

            if (error) {
                console.error('[Email Service] Error sending email:', error);
                throw new Error(error.message);
            }

            console.log('[Email Service] Email sent successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('[Email Service] Failed to send email:', error);
            throw error;
        }
    }

    /**
     * Send password reset email
     */
    async sendPasswordReset(email, resetToken) {
        const resetUrl = `${this.appUrl}/reset-password?token=${resetToken}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e5e5e5;">
                                        <h1 style="margin: 0; color: #111827; font-size: 28px; font-weight: 700;">Kazi</h1>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">Reset Your Password</h2>

                                        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                                            We received a request to reset your password. Click the button below to create a new password:
                                        </p>

                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 16px; font-weight: 600;">
                                                        Reset Password
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                            Or copy and paste this URL into your browser:
                                        </p>
                                        <p style="margin: 8px 0 0 0; color: #3b82f6; font-size: 14px; word-break: break-all;">
                                            ${resetUrl}
                                        </p>

                                        <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e5e5;">
                                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                                <strong>This link will expire in 1 hour.</strong>
                                            </p>
                                            <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                                If you didn't request a password reset, you can safely ignore this email.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e5e5; border-radius: 0 0 8px 8px;">
                                        <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                            &copy; ${new Date().getFullYear()} Kazi. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        return this.send({
            to: email,
            subject: 'Reset Your Password - Kazi',
            html,
        });
    }

    /**
     * Send welcome email
     */
    async sendWelcome(email, name) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e5e5e5;">
                                        <h1 style="margin: 0; color: #111827; font-size: 28px; font-weight: 700;">Kazi</h1>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">Welcome to Kazi!</h2>

                                        <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                                            Hi${name ? ` ${name}` : ''},
                                        </p>

                                        <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                                            Thank you for signing up! We're excited to have you on board.
                                        </p>

                                        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                                            Kazi helps you manage tasks, collaborate with your team, and stay organized. Here's what you can do:
                                        </p>

                                        <ul style="margin: 0 0 24px 0; padding-left: 24px; color: #4b5563; font-size: 16px; line-height: 1.8;">
                                            <li>Create and manage workspaces</li>
                                            <li>Organize tasks with projects</li>
                                            <li>Collaborate with your team</li>
                                            <li>Track progress in real-time</li>
                                        </ul>

                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <a href="${this.appUrl}" style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 16px; font-weight: 600;">
                                                        Get Started
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e5e5;">
                                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                                Need help? Feel free to reach out to our support team.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e5e5; border-radius: 0 0 8px 8px;">
                                        <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                            &copy; ${new Date().getFullYear()} Kazi. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        return this.send({
            to: email,
            subject: 'Welcome to Kazi!',
            html,
        });
    }

    /**
     * Send workspace invitation email
     */
    async sendWorkspaceInvitation(email, workspaceName, inviterName, invitationUrl) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e5e5e5;">
                                        <h1 style="margin: 0; color: #111827; font-size: 28px; font-weight: 700;">Kazi</h1>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">You've Been Invited!</h2>

                                        <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                                            ${inviterName} has invited you to join the workspace <strong>${workspaceName}</strong> on Kazi.
                                        </p>

                                        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                                            Click the button below to accept the invitation and start collaborating:
                                        </p>

                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <a href="${invitationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 16px; font-weight: 600;">
                                                        Accept Invitation
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                            Or copy and paste this URL into your browser:
                                        </p>
                                        <p style="margin: 8px 0 0 0; color: #3b82f6; font-size: 14px; word-break: break-all;">
                                            ${invitationUrl}
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e5e5; border-radius: 0 0 8px 8px;">
                                        <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                            &copy; ${new Date().getFullYear()} Kazi. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        return this.send({
            to: email,
            subject: `You've been invited to ${workspaceName} - Kazi`,
            html,
        });
    }
}

export default new EmailService();
