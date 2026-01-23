# Vercel Deployment Guide - Complete Walkthrough

## 🎯 Overview
Deploy MkulimaLink to production using Vercel for both frontend and backend in ~1 hour.

**Why Vercel?**
- ✅ Unified platform (frontend + backend)
- ✅ Automatic deployments on git push
- ✅ Built-in CDN and edge functions
- ✅ Serverless functions for backend
- ✅ Environment variables management
- ✅ Free tier available
- ✅ Better performance than Netlify + Heroku

**Timeline**: 
- Setup: 10 minutes
- Frontend deployment: 15 minutes
- Backend deployment: 20 minutes
- Database connection: 10 minutes
- Testing: 5 minutes
- **Total: ~1 hour**

---

## 📋 Pre-Deployment Checklist

Before starting, ensure you have:

- [ ] GitHub account with MkulimaLink repository pushed
- [ ] Vercel account (free at vercel.com)
- [ ] MongoDB Atlas account (free tier)
- [ ] Payment API keys (Stripe, M-Pesa, Airtel)
- [ ] Firebase project ID
- [ ] SendGrid API key
- [ ] Mapbox API key
- [ ] Domain name (optional)

---

# PART 1: SETUP (10 Minutes)

## Step 1: Create Vercel Account & Connect GitHub

### 1.1 Sign Up for Vercel
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. Click **"Authorize"**

**Status**: ✅ Vercel account created

### 1.2 Import Repository
1. Click **"Add New..."** → **"Project"**
2. Click **"Continue with GitHub"**
3. Search for **"MkulimaLink"**
4. Click **"Import"**

**Status**: ✅ Repository imported

---

## Step 2: Configure Project Structure

### 2.1 Prepare Repository Structure
Vercel needs a specific structure. Update your repo:

```bash
# Current structure should be:
MkulimaLink/
├── frontend/          # React app
├── backend/           # Node.js API
├── mobile/            # React Native
├── package.json       # Root package.json
└── vercel.json        # Vercel config (create this)
```

### 2.2 Create Root package.json (if not exists)
```bash
cat > package.json << 'EOF'
{
  "name": "mkulimalink",
  "version": "1.0.0",
  "description": "Agricultural technology platform",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "concurrently \"cd frontend && npm start\" \"cd backend && npm start\"",
    "build": "npm run build --workspaces",
    "start": "npm start --workspaces"
  },
  "devDependencies": {
    "concurrently": "^7.0.0"
  }
}
EOF
```

### 2.3 Create vercel.json
```bash
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/build"
      }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/build/$1"
    }
  ]
}
EOF
```

### 2.4 Commit Changes
```bash
git add package.json vercel.json
git commit -m "Add Vercel configuration for full-stack deployment"
git push origin main
```

**Status**: ✅ Project structure configured

---

# PART 2: FRONTEND DEPLOYMENT (15 Minutes)

## Step 3: Deploy Frontend

### 3.1 Configure Frontend Build
In Vercel dashboard:

1. Click on your project
2. Go to **Settings** → **Build & Development Settings**
3. Set:
   - **Framework**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 3.2 Add Frontend Environment Variables
In Vercel dashboard → **Settings** → **Environment Variables**:

```
REACT_APP_API_URL = https://api.mkulimalink.vercel.app
REACT_APP_MAPBOX_TOKEN = <your-mapbox-token>
REACT_APP_FIREBASE_CONFIG = <your-firebase-config>
```

**Note**: Keep API URL as placeholder for now. Update after backend deployment.

### 3.3 Trigger Frontend Deployment
1. Go to **Deployments** tab
2. Click **"Redeploy"** or push to main branch
3. Wait for build to complete (3-5 minutes)
4. You'll see: **"Production"** with a green checkmark

### 3.4 Get Frontend URL
- Copy your Vercel URL (e.g., `https://mkulimalink.vercel.app`)
- This is your production frontend URL

**Status**: ✅ Frontend deployed

---

# PART 3: BACKEND DEPLOYMENT (20 Minutes)

## Step 4: Configure Backend for Vercel

### 4.1 Update Backend for Serverless
Vercel runs backend as serverless functions. Update `backend/server.js`:

```javascript
// backend/server.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/analytics', require('./routes/farmAnalytics'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/localization', require('./routes/localization'));
app.use('/api/community', require('./routes/community'));
app.use('/api/monetization', require('./routes/monetization'));
app.use('/api/security', require('./routes/security'));
app.use('/api/aiml', require('./routes/aiml'));
app.use('/api/global-expansion', require('./routes/globalExpansion'));
app.use('/api/iot', require('./routes/iot'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Export for Vercel
module.exports = app;
```

### 4.2 Create API Route Handler
Create `backend/api/index.js`:

```javascript
// backend/api/index.js
const app = require('../server');

module.exports = app;
```

### 4.3 Update vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/build"
      }
    },
    {
      "src": "backend/api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/build/$1"
    }
  ]
}
```

### 4.4 Add Backend Environment Variables
In Vercel dashboard → **Settings** → **Environment Variables**:

```
NODE_ENV = production
JWT_SECRET = <generate-random-secret>
MONGODB_URI = <your-mongodb-atlas-uri>
PAYMENT_API_KEY = <your-stripe-key>
STRIPE_KEY = <your-stripe-key>
MPESA_KEY = <your-mpesa-key>
AIRTEL_KEY = <your-airtel-key>
SENDGRID_API_KEY = <your-sendgrid-key>
FIREBASE_KEY = <your-firebase-key>
MAPBOX_TOKEN = <your-mapbox-token>
```

### 4.5 Commit and Deploy
```bash
git add backend/api/index.js vercel.json
git commit -m "Configure backend for Vercel serverless deployment"
git push origin main
```

Wait for Vercel to rebuild (3-5 minutes).

**Status**: ✅ Backend deployed

---

# PART 4: DATABASE CONNECTION (10 Minutes)

## Step 5: Set Up MongoDB Atlas

### 5.1 Create MongoDB Cluster
1. Go to **https://mongodb.com/cloud/atlas**
2. Sign up or log in
3. Click **"Create a Deployment"**
4. Choose **"Free Tier"** (M0)
5. Select region closest to you
6. Click **"Create Deployment"**

### 5.2 Create Database User
1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Set username: `mkulimalink`
4. Set password: (generate strong password)
5. Click **"Add User"**

### 5.3 Whitelist IP Address
1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

**Note**: For production, whitelist Vercel IPs: `76.75.126.0/24`

### 5.4 Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. Copy connection string
4. Replace `<password>` with your database user password
5. Should look like: `mongodb+srv://mkulimalink:password@cluster.mongodb.net/mkulimalink?retryWrites=true&w=majority`

### 5.5 Add to Vercel
In Vercel dashboard → **Settings** → **Environment Variables**:

```
MONGODB_URI = mongodb+srv://mkulimalink:password@cluster.mongodb.net/mkulimalink?retryWrites=true&w=majority
```

**Status**: ✅ Database connected

---

## Step 6: Update Frontend API URL

### 6.1 Get Backend URL
Your backend is now at: `https://mkulimalink.vercel.app/api`

### 6.2 Update Frontend Environment
In Vercel dashboard → **Settings** → **Environment Variables**:

Update `REACT_APP_API_URL`:
```
REACT_APP_API_URL = https://mkulimalink.vercel.app/api
```

### 6.3 Redeploy Frontend
1. Go to **Deployments**
2. Click **"Redeploy"** on latest deployment
3. Wait for rebuild (2-3 minutes)

**Status**: ✅ Frontend and backend connected

---

# PART 5: TESTING & VERIFICATION (5 Minutes)

## Step 7: Test Deployment

### 7.1 Test Frontend
```bash
# Open in browser
https://mkulimalink.vercel.app

# Check:
# - Homepage loads
# - Navigation works
# - Dashboard accessible
# - No red errors in console (F12)
```

### 7.2 Test Backend API
```bash
# Test health check
curl https://mkulimalink.vercel.app/api/health

# Should return: { "status": "ok", "timestamp": "..." }

# Test analytics endpoint
curl https://mkulimalink.vercel.app/api/analytics/farm/dashboard \
  -H "Authorization: Bearer <your-jwt-token>"
```

### 7.3 Test Database Connection
Check Vercel logs:
1. Go to **Deployments** → Latest deployment
2. Click **"Logs"**
3. Should see: **"Database connected successfully"**
4. Should see no error messages

### 7.4 Test User Flow
1. Open frontend URL
2. Sign up for account
3. Log in
4. Navigate to dashboard
5. Verify data loads from API
6. Try making a test payment

**Status**: ✅ All systems verified

---

## Step 8: Configure Custom Domain (Optional)

### 8.1 Add Custom Domain
In Vercel dashboard → **Settings** → **Domains**:

1. Click **"Add"**
2. Enter your domain (e.g., `app.mkulimalink.com`)
3. Click **"Add"**

### 8.2 Update DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add CNAME record:
   - Name: `app`
   - Value: `cname.vercel-dns.com`
3. Save

### 8.3 Wait for DNS Propagation
- Takes 24-48 hours
- Vercel will show when ready
- HTTPS certificate auto-generated

**Status**: ✅ Custom domain configured (optional)

---

# PART 6: MONITORING & MAINTENANCE

## Step 9: Set Up Monitoring

### 9.1 Enable Vercel Analytics
In Vercel dashboard → **Settings** → **Analytics**:
- Enable **Web Analytics**
- Enable **Performance Monitoring**

### 9.2 Monitor Deployments
1. Go to **Deployments** tab
2. Watch for any failed deployments
3. Click on deployment to see logs
4. Check for errors or warnings

### 9.3 Monitor API Performance
```bash
# Check API response times
curl -w "Response time: %{time_total}s\n" \
  https://mkulimalink.vercel.app/api/health
```

### 9.4 Set Up Alerts
In Vercel dashboard → **Settings** → **Alerts**:
- Alert on deployment failures
- Alert on performance degradation
- Alert on error rate increase

**Status**: ✅ Monitoring configured

---

# ✅ DEPLOYMENT COMPLETE!

## Summary

### What You've Deployed
- ✅ Frontend on Vercel
- ✅ Backend on Vercel (serverless)
- ✅ Database on MongoDB Atlas
- ✅ 100+ API endpoints
- ✅ 30+ React components
- ✅ Real-time analytics
- ✅ Payment processing
- ✅ User authentication
- ✅ Community features
- ✅ Expert network
- ✅ Training platform
- ✅ IoT integration
- ✅ AI/ML models

### Your Production URLs
- **Frontend**: https://mkulimalink.vercel.app
- **Backend API**: https://mkulimalink.vercel.app/api
- **Custom Domain** (optional): https://app.mkulimalink.com

### Key Benefits
- ✅ Automatic deployments on git push
- ✅ Built-in CDN for global performance
- ✅ Serverless backend (scales automatically)
- ✅ Free SSL/TLS certificates
- ✅ Environment variables management
- ✅ Analytics and monitoring
- ✅ Easy rollbacks
- ✅ Preview deployments

---

## 🆘 Troubleshooting

### Frontend Won't Load
- Check Vercel logs: Deployments → Latest → Logs
- Verify build command: `npm run build`
- Check environment variables set correctly
- Clear browser cache

### Backend API Not Responding
- Check Vercel logs for errors
- Verify MongoDB connection string
- Check environment variables
- Test with: `curl https://mkulimalink.vercel.app/api/health`

### Database Connection Failed
- Verify MongoDB URI in Vercel config
- Check MongoDB Atlas firewall rules
- Verify IP whitelist includes Vercel IPs
- Test connection locally first

### Deployment Fails
- Check build logs in Vercel dashboard
- Verify all dependencies installed
- Check for syntax errors
- Ensure Node version compatible

---

## 📊 Next Steps

1. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor API response times
   - Watch error rates

2. **Gather User Feedback**
   - Collect feedback from early users
   - Fix any bugs
   - Optimize performance

3. **Scale Infrastructure**
   - Upgrade MongoDB tier if needed
   - Configure caching
   - Add CDN optimization

4. **Plan Phase 14**
   - Blockchain features
   - Cryptocurrency integration
   - NFT certificates

---

## 💡 Pro Tips

1. **Use Preview Deployments**
   - Every PR gets a preview URL
   - Test changes before merging
   - Share with team for feedback

2. **Monitor Deployments**
   - Check logs after each deployment
   - Set up alerts for failures
   - Review performance metrics

3. **Manage Secrets Securely**
   - Never commit API keys
   - Use Vercel environment variables
   - Rotate secrets regularly

4. **Optimize Performance**
   - Enable caching
   - Compress images
   - Minimize bundle size
   - Use edge functions

---

**🎉 Congratulations! MkulimaLink is now live on Vercel!**

Your full-stack application is deployed, scalable, and ready for production traffic.
