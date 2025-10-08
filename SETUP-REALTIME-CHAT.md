# Setting Up Real-Time Multi-User Chat

Your PostureGiveitAgo app now supports **real-time multi-user chat** with Supabase! This means messages and posts are synced across all users in real-time, no matter which computer they're using.

## Current Setup

Right now, the app works with **localStorage** (local storage on your computer only). To enable real-time sync across different users and computers, follow these steps:

## How to Set Up Supabase (Free!)

### Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (it's free!)
3. Create a new project
   - Choose a project name (e.g., "posture-app")
   - Set a database password (save this!)
   - Select a region close to you

### Step 2: Set Up the Database

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` file (in your project root)
4. Paste it into the SQL editor
5. Click "Run" to create all the tables and security policies

### Step 3: Get Your API Keys

1. In Supabase dashboard, go to "Project Settings" (gear icon in sidebar)
2. Click on "API" in the left menu
3. You'll see two important values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 4: Configure Your App

1. In your project root, create a file called `.env.local`
2. Add these lines (replace with your actual values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

### Step 5: Restart Your App

```bash
npm run dev
```

That's it! Your app now has real-time multi-user chat! 🎉

## How It Works

### With Supabase (Real-Time Mode)
- ✅ Posts and comments sync across all users instantly
- ✅ Multiple users can chat from different computers
- ✅ Real-time updates when someone likes a post
- ✅ All data is stored in the cloud
- ✅ Works on any device, anywhere

### Without Supabase (LocalStorage Mode)
- ⚠️ Posts only saved on your computer
- ⚠️ Other users won't see your messages
- ⚠️ Data is lost if you clear browser cache
- ⚠️ Only works on the same browser/computer

## Testing Real-Time Chat

To test that it's working:

1. Open your app in two different browsers (Chrome + Firefox, or use incognito mode)
2. Log in with different accounts in each browser
3. Post a message in one browser
4. Watch it appear instantly in the other browser! 🚀

## Troubleshooting

### "Posts not syncing"
- Check that `.env.local` has the correct values
- Make sure you ran the SQL schema in Supabase
- Restart your dev server (`npm run dev`)

### "Cannot read from Supabase"
- Verify your API keys are correct
- Check that Row Level Security policies were created (in SQL schema)
- Look at browser console for specific error messages

### "Real-time not working"
- In Supabase, go to Database > Replication
- Make sure `posts` and `comments` tables are enabled for replication

## Database Schema

The app uses two main tables:

### `posts`
Stores all community posts with user info, content, likes, etc.

### `comments`
Stores all comments on posts with user info and timestamps

Both tables support real-time subscriptions, so any INSERT, UPDATE, or DELETE is instantly broadcast to all connected clients.

## Security

- Row Level Security (RLS) is enabled on all tables
- Anyone can read posts (public feed)
- Users can only edit/delete their own content
- All user authentication is handled securely

## Cost

Supabase free tier includes:
- Up to 500MB database
- Up to 2GB file storage
- Up to 50,000 monthly active users
- Unlimited API requests

This is more than enough for most projects!

## Need Help?

If you run into issues:
1. Check the browser console for errors
2. Verify your `.env.local` file
3. Make sure the SQL schema was executed correctly
4. Try the Supabase documentation: https://supabase.com/docs
