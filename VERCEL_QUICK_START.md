# Vercel Deployment - Quick Start (1 Hour)

## 🚀 Quick Steps

### Step 1: Create Vercel Account (2 min)
1. Go to https://vercel.com
2. Click "Sign Up"
3. Click "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Project (3 min)
1. Click "Add New" → "Project"
2. Search "MkulimaLink"
3. Click "Import"

### Step 3: Configure Frontend (5 min)
In Vercel dashboard:
1. Settings → Build & Development Settings
2. Framework: React
3. Build Command: `npm run build`
4. Output Directory: `build`

### Step 4: Add Environment Variables (5 min)
Settings → Environment Variables:
```
REACT_APP_API_URL=https://mkulimalink.vercel.app/api
REACT_APP_MAPBOX_TOKEN=<your-token>
REACT_APP_FIREBASE_CONFIG=<your-config>
```

### Step 5: Deploy Frontend (5 min)
1. Click "Redeploy" or push to main
2. Wait for build (3-5 min)
3. Get your URL: https://mkulimalink.vercel.app

### Step 6: Set Up MongoDB (5 min)
1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Get connection string
5. Add to Vercel env vars as `MONGODB_URI`

### Step 7: Add Backend Environment Variables (5 min)
Settings → Environment Variables:
```
NODE_ENV=production
JWT_SECRET=<generate-random>
MONGODB_URI=<your-mongodb-uri>
PAYMENT_API_KEY=<your-key>
STRIPE_KEY=<your-key>
MPESA_KEY=<your-key>
AIRTEL_KEY=<your-key>
SENDGRID_API_KEY=<your-key>
FIREBASE_KEY=<your-key>
MAPBOX_TOKEN=<your-token>
```

### Step 8: Deploy Backend (5 min)
1. Redeploy frontend to apply all env vars
2. Backend automatically deploys with frontend
3. API available at: https://mkulimalink.vercel.app/api

### Step 9: Test (5 min)
```bash
# Test frontend
curl https://mkulimalink.vercel.app

# Test backend
curl https://mkulimalink.vercel.app/api/health
```

### Step 10: Custom Domain (Optional - 5 min)
1. Settings → Domains
2. Add your domain
3. Update DNS CNAME to: cname.vercel-dns.com

---

## ✅ Done!
Your app is live at: https://mkulimalink.vercel.app

For detailed guide, see: VERCEL_DEPLOYMENT_GUIDE.md
