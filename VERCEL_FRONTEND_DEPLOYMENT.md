# Vercel Frontend Deployment - Simplified Approach

## 🎯 Strategy Change

The monorepo setup is causing build conflicts. We'll deploy just the frontend to Vercel, which is simpler and more reliable.

**Backend will be deployed separately to Heroku or another platform.**

---

## ✅ Steps to Deploy Frontend Only

### Step 1: Delete vercel.json (2 minutes)

The `vercel.json` file is causing conflicts. We'll let Vercel auto-detect the React app instead.

In your terminal:
```bash
cd C:\Users\USER\Documents\Coding\Projects\MkulimaLink
git rm vercel.json
git commit -m "Remove vercel.json - use Vercel auto-detection for React"
git push origin main
```

### Step 2: Disconnect & Reconnect Project in Vercel (3 minutes)

1. Go to **https://vercel.com/dashboard**
2. Click on **MkulimaLink** project
3. Go to **Settings** → **General**
4. Scroll down and click **"Remove Project"**
5. Confirm deletion

Now reconnect:
1. Click **"Add New"** → **"Project"**
2. Click **"Continue with GitHub"**
3. Search **"MkulimaLink"**
4. Click **"Import"**

### Step 3: Configure for Frontend Directory (5 minutes)

In the import dialog:

1. **Root Directory**: Click **"Edit"** and select **`frontend`**
2. **Framework**: Should auto-detect as **React**
3. **Build Command**: Should be `npm run build`
4. **Output Directory**: Should be `build`
5. Click **"Deploy"**

Wait for build to complete (3-5 minutes).

### Step 4: Add Environment Variables (5 minutes)

Once deployed, go to **Settings** → **Environment Variables**:

Add:
```
REACT_APP_API_URL = https://api.mkulimalink.com
REACT_APP_MAPBOX_TOKEN = <your-mapbox-token>
REACT_APP_FIREBASE_CONFIG = <your-firebase-config>
```

### Step 5: Redeploy (2 minutes)

Go to **Deployments** → Click **"Redeploy"** to apply environment variables.

---

## ✅ Frontend is Now Live!

Your frontend will be at: `https://mkulimalink.vercel.app`

---

## 🔄 Backend Deployment (Separate)

For the backend, we'll use Heroku (simpler than trying to combine with Vercel):

1. Go to **https://heroku.com**
2. Create app: `heroku create mkulimalink-api`
3. Add MongoDB: `heroku addons:create mongolab:sandbox`
4. Set env vars: `heroku config:set NODE_ENV=production ...`
5. Deploy: `git push heroku main`

---

## 📝 Next Steps

1. Delete `vercel.json` and push to GitHub
2. Disconnect and reconnect project in Vercel
3. Select `frontend` as root directory
4. Deploy
5. Add environment variables
6. Redeploy

Then come back and tell me when frontend is live!
