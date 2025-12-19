# Email Setup Guide - Resend Integration

This guide will help you set up email functionality for your Kazi application using Resend.

## Overview

The email service is integrated for:
- **Welcome emails** when users register
- **Password reset emails** when users forget their password
- **Workspace invitations** (template ready, awaiting implementation)

## Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Free tier includes **3,000 emails/month** - perfect for getting started

## Step 2: Get Your API Key

1. Once logged in, navigate to **API Keys** in the dashboard
2. Click **Create API Key**
3. Give it a name (e.g., "Kazi Development" or "Kazi Production")
4. Copy the API key - it will look like: `re_123abc456def...`

## Step 3: Configure Environment Variables

Add these variables to your `apps/api/.env` file:

```env
# Email Configuration (Resend)
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="Kazi <onboarding@resend.dev>"
APP_URL="http://localhost:5173"
```

### Environment Variable Explanations:

- **`RESEND_API_KEY`**: Your Resend API key (required)
- **`EMAIL_FROM`**: The sender email and name (use `onboarding@resend.dev` for testing)
- **`APP_URL`**: Your frontend URL (used in email links)

## Step 4: Test the Integration

### Development Testing

With the default configuration, emails will use `onboarding@resend.dev` which is a test domain provided by Resend.

1. Start your API server:
   ```bash
   npm run dev:api
   ```

2. Test password reset:
   ```bash
   curl -X POST http://localhost:5000/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com"}'
   ```

3. Check your email inbox for the password reset email

### Registration Testing

1. Register a new user through the frontend or API
2. Check your email for the welcome message

## Step 5: Production Setup (Custom Domain)

For production, you should use your own domain instead of `onboarding@resend.dev`.

### Add Your Domain to Resend

1. In the Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS configuration steps

### DNS Records to Add

Resend will provide you with DNS records. Add these to your domain registrar:

**Example records:**
```
Type: TXT
Name: @
Value: resend-domain-verify=xxxxx

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none

Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA...
```

### Update Environment Variables for Production

```env
# Production Email Configuration
RESEND_API_KEY="re_your_production_api_key"
EMAIL_FROM="Kazi <noreply@yourdomain.com>"
APP_URL="https://yourdomain.com"
```

## Email Templates

The email service includes three pre-built templates:

### 1. Password Reset Email
- **Method**: `emailService.sendPasswordReset(email, resetToken)`
- **Triggered**: When user requests password reset
- **Contains**: Reset link with 1-hour expiration

### 2. Welcome Email
- **Method**: `emailService.sendWelcome(email, name)`
- **Triggered**: When user successfully registers
- **Contains**: Welcome message and getting started info

### 3. Workspace Invitation Email
- **Method**: `emailService.sendWorkspaceInvitation(email, workspaceName, inviterName, invitationUrl)`
- **Status**: Template ready, awaiting workspace invitation feature
- **Contains**: Invitation details and accept link

## Customizing Email Templates

Email templates are located in [apps/api/src/shared/services/email.service.js](src/shared/services/email.service.js).

To customize:

1. Find the template method (e.g., `sendWelcome`)
2. Modify the HTML in the template literal
3. Maintain responsive design (uses table-based layout for email compatibility)
4. Test across email clients (Gmail, Outlook, Apple Mail)

## Troubleshooting

### Emails Not Sending

1. **Check API key**: Ensure `RESEND_API_KEY` is set correctly
2. **Check logs**: Look for email service errors in console
3. **Verify email**: Make sure the recipient email exists and is valid

### Email Service Disabled Warning

If you see: `[Email Service] Email sending is disabled. Set RESEND_API_KEY to enable.`

This means the `RESEND_API_KEY` environment variable is not set. The app will continue to work, but no emails will be sent.

### Emails Going to Spam

For production:
1. Set up SPF, DKIM, and DMARC records properly
2. Use a custom domain (not `resend.dev`)
3. Warm up your domain by sending gradually increasing volumes
4. Include unsubscribe links for marketing emails
5. Maintain good sender reputation

### Rate Limits

Resend free tier limits:
- **3,000 emails/month**
- **100 emails/day** during trial

Upgrade to paid plan for higher limits.

## Monitoring and Analytics

Resend dashboard provides:
- Email delivery status
- Open rates (if tracking enabled)
- Bounce rates
- Spam complaints

Check regularly to ensure good deliverability.

## Cost Estimates

| Plan | Monthly Emails | Cost |
|------|---------------|------|
| **Free** | 3,000 | $0 |
| **Pro** | 50,000 | $20/month |
| **Business** | 100,000+ | Custom pricing |

Additional emails beyond limit: **$1 per 1,000 emails**

## Security Best Practices

1. **Never commit API keys** - use `.env` files (already in `.gitignore`)
2. **Use environment-specific keys** - separate keys for dev/staging/prod
3. **Rotate keys periodically** - generate new keys every 3-6 months
4. **Monitor usage** - check for unusual spikes that might indicate abuse
5. **Implement rate limiting** - prevent email bombing attacks

## Next Steps

After setup:
1. Test all email flows thoroughly
2. Monitor email deliverability in Resend dashboard
3. Consider implementing email preferences for users
4. Add email logging/audit trail for compliance
5. Set up alerts for failed email deliveries

## Support

- **Resend Documentation**: [resend.com/docs](https://resend.com/docs)
- **Resend Support**: support@resend.com
- **Email Service Code**: [apps/api/src/shared/services/email.service.js](src/shared/services/email.service.js)

---

**Email service successfully configured!** Your Kazi application can now send professional transactional emails.
