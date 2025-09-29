# Telegram Bot Setup Guide

This document explains how to set up and use the Telegram bot for SBM Forex Academy.

## Prerequisites

1. A Telegram account
2. Access to the SBM Forex Academy website
3. Admin access (for admin features)

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for @BotFather
2. Start a chat with BotFather
3. Send `/newbot` command
4. Follow the prompts to name your bot
5. BotFather will provide you with a bot token - save this securely

### 2. Configure Environment Variables

Add the following to your `.env` file:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_GROUP_ID=your_group_id_here
TELEGRAM_ADMIN_ID=your_admin_telegram_id_here
API_BASE_URL=http://localhost:5000  # or your deployed URL
```

### 3. Set Up a Telegram Group (Optional)

1. Create a new Telegram group
2. Add your bot to the group
3. Make the bot an administrator (required for message forwarding)
4. Get the group ID (you can find this by forwarding a message from the group to @JsonDumpBot)

## User Workflow

### 1. Connect Your Account

1. Log in to the SBM Forex Academy website
2. Go to Account Settings
3. Click "Generate Connection Token"
4. Copy the generated token
5. Open Telegram and find your bot
6. Send the command: `/token YOUR_TOKEN_HERE`

### 2. Check Your Status

Send `/status` to the bot to check your payment status and connection information.

### 3. Get Help

Send `/help` to see a list of available commands.

## Admin Workflow

### 1. Access Admin Panel

Send `/admin` to see the admin panel with available commands.

### 2. Toggle User Payment Status

Use `/togglepayment [user_telegram_id]` to change a user's payment status.

### 3. List All Users

Use `/users` to see a list of all users and their payment status.

### 4. Broadcast Messages

Use `/broadcast [message]` to send a message to all paying users.

### 5. Message Forwarding

When you post a message in the designated group, it will be automatically forwarded to all paying users.

## Technical Implementation Details

### API Endpoints

1. `POST /api/telegram/generate-token` - Generate a connection token (requires authentication)
2. `POST /api/telegram/connect` - Connect a Telegram account using a token (requires authentication)
3. `POST /api/telegram-validation/validate-token` - Validate a token and connect account (used by Telegram bot)

### How It Works

1. Users generate a connection token on the website
2. Users send the token to the Telegram bot via the `/token` command
3. The bot validates the token by calling the validation API endpoint
4. If valid, the user's Telegram ID is stored in their account
5. Admins can toggle payment status via Telegram commands
6. When admins post in the group, messages are forwarded to paying users only

### Security Considerations

1. Connection tokens expire after 10 minutes
2. Tokens can only be used once
3. Only admins can toggle payment status
4. Only admins can post messages that get forwarded to users
5. All API endpoints are protected with proper authentication

## Troubleshooting

### Common Issues

1. **"Invalid or expired connection token"**

   - Generate a new token and try again
   - Ensure you're copying the entire token

2. **Messages not being forwarded**

   - Ensure the bot is an administrator in the group
   - Check that the TELEGRAM_GROUP_ID is correct
   - Verify that the admin ID matches the sender's ID

3. **"User not found" when toggling payment status**
   - Ensure the user has connected their Telegram account
   - Check that the Telegram ID is correct

### Logs

Check the server logs for detailed error information:

- Token validation errors
- Message forwarding issues
- API call failures

## Maintenance

### Token Cleanup

The system automatically cleans up expired tokens, but in production, you should implement a background job to periodically clean up the token store.

### Scaling Considerations

For production use with many users:

1. Replace the in-memory token store with Redis or a database
2. Implement rate limiting for API endpoints
3. Add monitoring and alerting for critical failures
4. Consider using a message queue for message forwarding to handle high volume
