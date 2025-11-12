# Deployment Guide - GitHub & Vercel

This guide will help you deploy your AI Agency website to GitHub and make it live using Vercel (recommended for Next.js).

## Prerequisites

1. A GitHub account (sign up at https://github.com)
2. A Vercel account (free, sign up at https://vercel.com)

## Step 1: Initialize Git Repository

Run these commands in your terminal:

```bash
# Navigate to your project directory
cd "/Users/krishna/Personal/Ai agency"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI Agency website"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `ai-agency-website` (or any name you prefer)
4. Description: "Futuristic AI Agency website with consultation booking"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

## Step 3: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-agency-website.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com and sign up/login (use GitHub to sign in)
2. Click **"Add New Project"**
3. Import your GitHub repository (`ai-agency-website`)
4. Vercel will auto-detect Next.js settings
5. **Add Environment Variables:**
   - Click **"Environment Variables"**
   - Add these variables:
     ```
     RESEND_API_KEY=your_resend_api_key
     YOUR_EMAIL=your-email@example.com
     RAZORPAY_KEY_ID=your_razorpay_key_id (optional)
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret (optional)
     ```
6. Click **"Deploy"**
7. Your site will be live in ~2 minutes! 🎉

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? ai-agency-website
# - Directory? ./
# - Override settings? No
```

## Step 5: Configure Environment Variables in Vercel

1. Go to your project dashboard on Vercel
2. Click **Settings** → **Environment Variables**
3. Add all your environment variables:
   - `RESEND_API_KEY`
   - `YOUR_EMAIL`
   - `RAZORPAY_KEY_ID` (if using automatic payments)
   - `RAZORPAY_KEY_SECRET` (if using automatic payments)
   - `GOOGLE_CLIENT_EMAIL` (optional, for Google Calendar)
   - `GOOGLE_PRIVATE_KEY` (optional, for Google Calendar)
   - `GOOGLE_CALENDAR_ID` (optional, for Google Calendar)

4. **Important:** After adding variables, redeploy your site:
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update email "from" address in `app/api/consultation/route.ts` to use your domain

## Alternative: Deploy to Netlify

If you prefer Netlify:

1. Go to https://netlify.com and sign up
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables in **Site settings** → **Environment variables**
6. Deploy!

## Post-Deployment Checklist

- [ ] Test the website on the live URL
- [ ] Test consultation form submission
- [ ] Verify emails are being sent
- [ ] Test payment flow (if using Razorpay)
- [ ] Check mobile responsiveness
- [ ] Update any hardcoded URLs to use the live domain

## Continuous Deployment

Once connected to Vercel/Netlify:
- Every push to `main` branch automatically deploys
- Pull requests create preview deployments
- No manual deployment needed!

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all environment variables are set
- Verify `package.json` has all dependencies

### Emails Not Sending
- Verify `RESEND_API_KEY` is set in Vercel
- Check Resend dashboard for errors
- Ensure domain is verified in Resend (for production)

### Payment Not Working
- Verify Razorpay keys are set in Vercel
- Check browser console for errors
- Test with Razorpay test keys first

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- GitHub Docs: https://docs.github.com

