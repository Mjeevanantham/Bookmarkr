# Slack Credentials Setup for Bookmarkr

Bookmarkr uses Slack for high-priority bookmark notifications. You can use either **Incoming Webhooks** (simpler) or **Bot Token** (more flexible).

---

## Option 1: Incoming Webhook URL (Recommended for per-user notifications)

Use this for the **Settings → Slack Webhook** field. Each user enters their own webhook to receive notifications in their chosen channel.

### Steps

1. **Go to Slack API**
   - Visit [api.slack.com/apps](https://api.slack.com/apps)
   - Click **Create New App** → **From scratch**
   - Name it (e.g. "Bookmarkr") and select your workspace

2. **Enable Incoming Webhooks**
   - In the app sidebar, go to **Incoming Webhooks**
   - Toggle **Activate Incoming Webhooks** to **On**

3. **Add Webhook to Workspace**
   - Click **Add New Webhook to Workspace**
   - Choose the channel where you want notifications (e.g. `#bookmarks`)
   - Click **Allow**

4. **Copy the Webhook URL**
   - Copy the full webhook URL from the Slack app page and paste it into **Settings → Incoming Webhook URL** in Bookmarkr

5. **Security**
   - Treat this URL as a secret
   - Don’t commit it to git or share it publicly

---

## Option 2: Bot Token (For server-side / `.env`)

Use this if you want the app to send notifications from the server (e.g. via `SLACK_BOT_TOKEN` in `.env`).

### Steps

1. **Create a Slack App**
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - **Create New App** → **From scratch**
   - Name it and select your workspace

2. **Add Bot Scopes**
   - Go to **OAuth & Permissions**
   - Under **Scopes** → **Bot Token Scopes**, add:
     - `chat:write` – send messages
     - `chat:write.public` – send to channels without joining (optional)

3. **Install to Workspace**
   - Click **Install to Workspace**
   - Review permissions and click **Allow**

4. **Copy the Bot Token**
   - On **OAuth & Permissions**, copy the **Bot User OAuth Token**
   - It starts with `xoxb-`
   - Add to `.env`:
     ```
     SLACK_BOT_TOKEN=xoxb-your-token-here
     ```

5. **Invite the bot to a channel**
   - In Slack, type `/invite @YourAppName` in the channel where you want notifications

---

## Summary

| Use case                          | Credential type      | Where to put it                 |
| --------------------------------- | -------------------- | ------------------------------- |
| Per-user notifications (Settings) | Incoming Webhook URL | Settings → Incoming Webhook URL |
| Server-side notifications         | Bot Token            | `.env` → `SLACK_BOT_TOKEN`      |

---

## Troubleshooting

- **"invalid_payload"** – Check that the webhook URL is correct and not revoked
- **"channel_not_found"** – Invite the bot to the channel with `/invite @YourAppName`
- **"not_in_channel"** – Add `chat:write.public` scope or invite the bot to the channel
