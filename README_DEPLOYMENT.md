# ChickenTracks Deployment Guide

## Quick Deploy to Netlify (5 minutes)

### Steps:

1. **Create a GitHub account** (if you don't have one): https://github.com/signup

2. **Create a new repository**:
   - Go to https://github.com/new
   - Name: `chickentracks`
   - Set to Public
   - Don't initialize with README
   - Click "Create repository"

3. **Upload your files**:
   - Download all these files from Claude
   - On GitHub, click "uploading an existing file"
   - Drag all files to upload
   - Commit the files

4. **Deploy to Netlify**:
   - Go to https://www.netlify.com/
   - Click "Sign up" (use GitHub to sign in)
   - Click "Add new site" > "Import an existing project"
   - Choose GitHub
   - Select your `chickentracks` repository
   - Build settings should auto-detect:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"
   - Wait 2-3 minutes for deployment

5. **Access on your iPhone**:
   - Open the Netlify URL in Safari
   - Tap the Share button (square with arrow)
   - Scroll down and tap "Add to Home Screen"
   - Tap "Add"
   - Now it's an app icon on your home screen!

## Alternative: Vercel (Also Free & Easy)

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Deploy (auto-detects settings)
6. Add to iPhone home screen same way

## What You Get:

✅ Free HTTPS hosting
✅ Custom domain (optional)
✅ Automatic updates when you push to GitHub
✅ Works offline as a PWA
✅ Looks like a native app on iPhone
✅ No app store approval needed

## Testing Tips:

- The app will feel like a native app on iPhone
- All data saves in browser (survives closing/reopening)
- Works offline after first load
- Can be used even without internet

## Notes:

- This is a Progressive Web App (PWA)
- No native iOS features (camera, notifications) yet
- To add those, you'd need React Native (more complex)
- Perfect for testing for a few days!
