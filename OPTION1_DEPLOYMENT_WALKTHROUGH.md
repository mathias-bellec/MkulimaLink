# Option 1: Netlify + Heroku Deployment - Complete Walkthrough

## 🎯 Overview
Deploy MkulimaLink to production in 1.5 hours using Netlify (frontend) and Heroku (backend).

**Timeline**: 
- Frontend: 30 minutes
- Backend: 45 minutes
- Testing: 15 minutes
- **Total: 1.5 hours**

---

## 📋 Pre-Deployment Checklist (5 minutes)

Before starting, ensure you have:

- [ ] GitHub account with MkulimaLink repository
- [ ] Netlify account (free at netlify.com)
- [ ] Heroku account (free at heroku.com)
- [ ] MongoDB Atlas account (free at mongodb.com/cloud/atlas)
- [ ] Domain name (optional, can use Netlify/Heroku domains initially)
- [ ] Payment API keys (Stripe, M-Pesa, Airtel)
- [ ] Firebase project ID
- [ ] SendGrid API key
- [ ] Mapbox API key

**Estimated time**: 5 minutes to gather credentials

---

# PART 1: FRONTEND DEPLOYMENT (Netlify) - 30 Minutes

## Step 1: Prepare Frontend Code (5 minutes)

### 1.1 Verify Frontend Structure
```bash
# Navigate to frontend directory
cd frontend

# Check if build script exists
cat package.json | grep -A 5 "scripts"

# Should see: "build": "react-scripts build"
```

### 1.2 Create Environment File
Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://api.mkulimalink.com
REACT_APP_MAPBOX_TOKEN=<your-mapbox-token>
REACT_APP_FIREBASE_CONFIG=<your-firebase-config>
```

**Note**: Replace with your actual values. You can use Heroku URL later.

### 1.3 Commit to GitHub
```bash
cd frontend
git add .
git commit -m "Prepare frontend for production deployment"
git push origin main
```

**Status**: ✅ Frontend code ready

---

## Step 2: Create Netlify Account & Connect Repository (5 minutes)

### 2.1 Sign Up for Netlify
1. Go to **https://netlify.com**
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Click **"Authorize netlify"**

**Status**: ✅ Netlify account created

### 2.2 Create New Site
1. Click **"New site from Git"** (or "Add new site")
2. Click **"GitHub"**
3. Search for **"MkulimaLink"** repository
4. Click to select it

**Status**: ✅ Repository connected

---

## Step 3: Configure Build Settings (5 minutes)

### 3.1 Set Build Command
In Netlify deploy settings:
- **Build command**: `npm run build`
- **Publish directory**: `frontend/build`
- **Node version**: 18

### 3.2 Add Environment Variables
In Netlify Site settings → Environment:

```
REACT_APP_API_URL = https://api.mkulimalink.com
REACT_APP_MAPBOX_TOKEN = <your-token>
REACT_APP_FIREBASE_CONFIG = <your-config>
```

**Note**: Keep `REACT_APP_API_URL` as placeholder for now. Update after Heroku deployment.

### 3.3 Enable Auto-Deploy
- Check **"Deploy on push"**
- This will auto-deploy when you push to main

**Status**: ✅ Build settings configured

---

## Step 4: Deploy Frontend (10 minutes)

### 4.1 Trigger Deployment
1. Click **"Deploy site"** button
2. Netlify will:
   - Clone your repository
   - Install dependencies
   - Run build command
   - Deploy to CDN

### 4.2 Monitor Deployment
- Watch the deployment log
- Should take 3-5 minutes
- Look for: **"Site is live"** message

### 4.3 Get Netlify URL
Once deployed:
- Copy your Netlify URL (e.g., `https://mkulimalink-abc123.netlify.app`)
- This is your temporary frontend URL

**Status**: ✅ Frontend deployed to Netlify

### 4.4 Verify Frontend
1. Open your Netlify URL in browser
2. Should see MkulimaLink homepage
3. Check that pages load
4. **Note**: API calls will fail until backend is deployed

**Status**: ✅ Frontend verified

---

## Step 5: Configure Custom Domain (Optional - 5 minutes)

### 5.1 Add Custom Domain
1. In Netlify: Site settings → Domain management
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `app.mkulimalink.com`)
4. Click **"Verify"**

### 5.2 Update DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add Netlify nameservers:
   - `dns1.p01.nsone.net`
   - `dns2.p01.nsone.net`
   - `dns3.p01.nsone.net`
   - `dns4.p01.nsone.net`

### 5.3 Wait for DNS Propagation
- Takes 24-48 hours
- Netlify will show when ready
- HTTPS certificate auto-generated

**Status**: ✅ Custom domain configured (optional)

---

# PART 2: BACKEND DEPLOYMENT (Heroku) - 45 Minutes

## Step 6: Prepare Backend Code (5 minutes)

### 6.1 Verify Backend Structure
```bash
# Navigate to backend
cd backend

# Check if start script exists
cat package.json | grep -A 5 "scripts"

# Should see: "start": "node server.js"
```

### 6.2 Create Procfile
Create `backend/Procfile`:
```
web: npm start
```

This tells Heroku how to start your app.

### 6.3 Verify server.js
Check `backend/server.js` has:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 6.4 Commit to GitHub
```bash
cd backend
git add Procfile
git commit -m "Add Procfile for Heroku deployment"
git push origin main
```

**Status**: ✅ Backend code ready

---

## Step 7: Install Heroku CLI & Login (5 minutes)

### 7.1 Install Heroku CLI
```bash
# On macOS
brew tap heroku/brew && brew install heroku

# On Windows (using npm)
npm install -g heroku

# On Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### 7.2 Verify Installation
```bash
heroku --version
# Should show: heroku/7.x.x
```

### 7.3 Login to Heroku
```bash
heroku login
# Opens browser to authenticate
# Click "Log in"
# Returns to terminal with "Logged in as..."
```

**Status**: ✅ Heroku CLI installed and authenticated

---

## Step 8: Create Heroku App (5 minutes)

### 8.1 Create App
```bash
# Navigate to backend directory
cd backend

# Create Heroku app
heroku create mkulimalink-api

# You'll see:
# Creating ⬢ mkulimalink-api... done
# https://mkulimalink-api-xxxxx.herokuapp.com/ | git@heroku.com:mkulimalink-api.git
```

**Note**: If name is taken, Heroku will suggest alternatives.

### 8.2 Verify App Created
```bash
heroku apps
# Should list: mkulimalink-api
```

### 8.3 Add MongoDB Database
```bash
# Add MongoDB Atlas addon
heroku addons:create mongolab:sandbox --app mkulimalink-api

# You'll see:
# Creating mongolab:sandbox on ⬢ mkulimalink-api... done
# Setting MONGODB_URI config var... done
```

**Status**: ✅ Heroku app created with database

---

## Step 9: Set Environment Variables (10 minutes)

### 9.1 Generate JWT Secret
```bash
# Generate random secret
openssl rand -hex 32
# Copy the output (e.g., a1b2c3d4e5f6...)
```

### 9.2 Set All Environment Variables
```bash
heroku config:set \
  NODE_ENV=production \
  JWT_SECRET=<paste-your-secret-here> \
  PAYMENT_API_KEY=<your-stripe-key> \
  STRIPE_KEY=<your-stripe-key> \
  MPESA_KEY=<your-mpesa-key> \
  AIRTEL_KEY=<your-airtel-key> \
  SENDGRID_API_KEY=<your-sendgrid-key> \
  FIREBASE_KEY=<your-firebase-key> \
  MAPBOX_TOKEN=<your-mapbox-token> \
  --app mkulimalink-api
```

### 9.3 Verify Variables Set
```bash
heroku config --app mkulimalink-api
# Should show all your variables
```

**Status**: ✅ Environment variables configured

---

## Step 10: Deploy Backend to Heroku (10 minutes)

### 10.1 Add Heroku Remote
```bash
# From backend directory
cd backend

# Add Heroku as remote
heroku git:remote --app mkulimalink-api
```

### 10.2 Deploy Code
```bash
# Push to Heroku
git push heroku main

# You'll see deployment logs:
# Counting objects: 100%
# Compressing objects: 100%
# Writing objects: 100%
# remote: Building source...
# remote: -----> Building on the Heroku-20 stack
# ...
# remote: -----> Launching...
# remote: -----> Deployed to Heroku
```

**Note**: First deployment takes 3-5 minutes.

### 10.3 Monitor Deployment
```bash
# Watch logs in real-time
heroku logs --tail --app mkulimalink-api

# Should see:
# Server running on port 5000
# Database connected
# API ready
```

**Status**: ✅ Backend deployed to Heroku

---

## Step 11: Run Database Migrations (5 minutes)

### 11.1 Run Migrations
```bash
# Run database setup
heroku run npm run migrate --app mkulimalink-api

# You'll see:
# Running npm run migrate on ⬢ mkulimalink-api... up, run.1234
# > mkulimalink@1.0.0 migrate
# Migrations completed successfully
```

### 11.2 Seed Database (Optional)
```bash
# Add sample data
heroku run npm run seed --app mkulimalink-api

# You'll see:
# Running npm run seed on ⬢ mkulimalink-api... up, run.1234
# > mkulimalink@1.0.0 seed
# Database seeded with sample data
```

**Status**: ✅ Database initialized

---

## Step 12: Get Backend URL & Update Frontend (5 minutes)

### 12.1 Get Heroku Backend URL
```bash
# Get your Heroku app URL
heroku info --app mkulimalink-api

# Look for: Web URL: https://mkulimalink-api-xxxxx.herokuapp.com/
# Copy this URL
```

### 12.2 Update Frontend Environment
Go back to Netlify:
1. Site settings → Environment variables
2. Update `REACT_APP_API_URL`:
   - Old: `https://api.mkulimalink.com`
   - New: `https://mkulimalink-api-xxxxx.herokuapp.com`
3. Save

### 12.3 Trigger Frontend Rebuild
1. Go to Netlify Deploys
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for build to complete

**Status**: ✅ Frontend and backend connected

---

## Step 13: Configure Custom Domain (Optional - 5 minutes)

### 13.1 Add Custom Domain to Heroku
```bash
# Add your domain
heroku domains:add api.mkulimalink.com --app mkulimalink-api

# You'll see:
# Adding api.mkulimalink.com to ⬢ mkulimalink-api... done
# Configure your DNS provider to point to mkulimalink-api-xxxxx.herokuapp.com
```

### 13.2 Update DNS
1. Go to your domain registrar
2. Create CNAME record:
   - Name: `api`
   - Value: `mkulimalink-api-xxxxx.herokuapp.com`
3. Save

### 13.3 Wait for DNS Propagation
- Takes 24-48 hours
- Test with: `nslookup api.mkulimalink.com`

**Status**: ✅ Custom domain configured (optional)

---

# PART 3: TESTING & VERIFICATION (15 Minutes)

## Step 14: Test Frontend (5 minutes)

### 14.1 Open Frontend in Browser
```
https://mkulimalink-abc123.netlify.app
```

### 14.2 Verify Pages Load
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Dashboard accessible
- [ ] Analytics page loads
- [ ] Community page loads
- [ ] Settings page loads

### 14.3 Check Console for Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Should see no red errors
4. Should see API connection message

**Status**: ✅ Frontend verified

---

## Step 15: Test Backend API (5 minutes)

### 15.1 Test API Endpoints
```bash
# Test health check
curl https://mkulimalink-api-xxxxx.herokuapp.com/api/health

# Should return: { "status": "ok" }

# Test analytics endpoint
curl https://mkulimalink-api-xxxxx.herokuapp.com/api/analytics/farm/dashboard \
  -H "Authorization: Bearer <your-jwt-token>"

# Should return farm data
```

### 15.2 Test Database Connection
```bash
# Check logs for database connection
heroku logs --tail --app mkulimalink-api

# Should see: "Database connected successfully"
```

### 15.3 Test Payment Gateway
```bash
# Make test payment
curl -X POST https://mkulimalink-api-xxxxx.herokuapp.com/api/payments/test \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "TZS"}'

# Should return: { "status": "success", "transaction_id": "..." }
```

**Status**: ✅ Backend verified

---

## Step 16: Final Verification (5 minutes)

### 16.1 Test User Flow
1. Open frontend URL
2. Sign up for account
3. Log in
4. Navigate to dashboard
5. Check analytics load
6. Try making a payment (test mode)
7. Verify email received

### 16.2 Check Performance
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://mkulimalink-api-xxxxx.herokuapp.com/api/health

# Should be < 200ms
```

### 16.3 Monitor Logs
```bash
# Watch for errors
heroku logs --tail --app mkulimalink-api

# Should see no errors, only info logs
```

**Status**: ✅ All systems verified

---

# PART 4: MOBILE APPS (Optional - 1-2 Hours)

## Step 17: Build & Deploy iOS App

### 17.1 Build for iOS
```bash
cd mobile/MkulimaLink

# Build for iOS
eas build --platform ios

# Follow prompts:
# - Select development build: No
# - Select iOS build type: Release
# - Wait for build (5-10 minutes)
```

### 17.2 Submit to App Store
1. Go to App Store Connect
2. Create new app
3. Upload build
4. Fill in app details
5. Submit for review

**Timeline**: 24-48 hours for approval

---

## Step 18: Build & Deploy Android App

### 18.1 Build for Android
```bash
cd mobile/MkulimaLink

# Build for Android
eas build --platform android

# Follow prompts:
# - Select Android build type: Release
# - Wait for build (5-10 minutes)
```

### 18.2 Submit to Google Play
1. Go to Google Play Console
2. Create new app
3. Upload APK/AAB
4. Fill in app details
5. Submit for review

**Timeline**: 2-4 hours for approval

---

# ✅ DEPLOYMENT COMPLETE!

## Summary

### What You've Deployed
- ✅ Frontend on Netlify
- ✅ Backend on Heroku
- ✅ Database on MongoDB Atlas
- ✅ 100+ API endpoints
- ✅ 30+ React components
- ✅ Real-time analytics
- ✅ Payment processing
- ✅ User authentication
- ✅ Community features
- ✅ Expert network
- ✅ Training platform

### URLs
- **Frontend**: https://mkulimalink-abc123.netlify.app
- **Backend**: https://mkulimalink-api-xxxxx.herokuapp.com
- **Custom Frontend**: https://app.mkulimalink.com (optional)
- **Custom Backend**: https://api.mkulimalink.com (optional)

### Next Steps
1. Monitor logs for errors
2. Gather user feedback
3. Plan Phase 14 (Blockchain)
4. Scale infrastructure as needed

---

## 🆘 Troubleshooting

### Frontend Won't Load
- Check Netlify logs: Site settings → Deploys
- Verify build command: `npm run build`
- Check environment variables set correctly

### Backend Won't Start
- Check Heroku logs: `heroku logs --tail`
- Verify Procfile exists
- Check environment variables: `heroku config`
- Verify database connection: `heroku logs --tail`

### API Calls Failing
- Check CORS settings in backend
- Verify API URL in frontend env vars
- Check backend logs for errors
- Test with curl: `curl https://api.../api/health`

### Database Connection Failed
- Verify MongoDB URI in Heroku config
- Check MongoDB Atlas firewall rules
- Verify IP whitelist includes Heroku

---

**🎉 Congratulations! MkulimaLink is now live in production!**
