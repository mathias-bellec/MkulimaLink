# Quick Vercel Re-Import & Deploy (5-10 minutes)

## ✅ Project Deleted - Now Re-Import

### Step 1: Re-Import Project (2 minutes)

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New"** → **"Project"**
3. Click **"Continue with GitHub"**
4. Search for **"MkulimaLink"**
5. Click **"Import"**

### Step 2: Configure Settings (1 minute)

**IMPORTANT: Keep these settings as-is**

In the configuration dialog:
- **Root Directory**: `.` (root) - DO NOT CHANGE
- **Framework Preset**: Select **"Other"** or leave blank
- **Build Command**: Leave empty
- **Output Directory**: Leave empty
- **Install Command**: Leave empty

**Why?** These settings tell Vercel to use `vercel.json` which has all the correct build configuration.

### Step 3: Click Deploy (1 minute)

Click **"Deploy"** button

**Wait 5-7 minutes for build to complete.**

---

## 📊 What to Expect

The build logs should show:
```
Cloning github.com/kadioko/MkulimaLink (Branch: main, Commit: 349b2ed)
Running "vercel build"
Installing dependencies...
Skipping root install
Building...
> cd frontend && npm ci --legacy-peer-deps && npm run build

Creating an optimized production build...
Compiled successfully!
```

**Look for**: Green checkmark with **"Production"** status

---

## ✅ After Deployment Succeeds

1. Go to **Settings** → **Environment Variables**
2. Add these 3 variables:

```
REACT_APP_API_URL = https://mkulimalink-api.herokuapp.com
REACT_APP_MAPBOX_TOKEN = pk.eyJ1Ijoia2FkaW9rbyIsImEiOiJja3JweXRkdngyaHd4MnZydjNsc3RpNmdyIn0.gdAy5iD7-rwddWTyqUBSNQ
REACT_APP_FIREBASE_CONFIG = {"apiKey":"AIzaSyC_4XJgrfKC0ALBcwW2jh-62ENyIb4OJpg","authDomain":"mkulimalink.firebaseapp.com","projectId":"mkulimalink","storageBucket":"mkulimalink.firebasestorage.app","messagingSenderId":"711411966579","appId":"1:711411966579:web:24a259f79bae1a06cb0006","measurementId":"G-1293K0F2VS"}
```

3. Go to **Deployments** → Click **"Redeploy"**
4. Wait for build to complete

---

## 🎉 Frontend Live

Your frontend will be at: **https://mkulimalink.vercel.app**

---

## 📝 Tell Me When

Come back and tell me when:
- ✅ Build is complete (green checkmark)
- ✅ Environment variables are added
- ✅ Redeployed with env vars

Then I'll help you deploy the backend to Heroku!
