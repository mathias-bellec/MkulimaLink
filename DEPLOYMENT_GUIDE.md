# MkulimaLink - Deployment Guide

## 🚀 Deployment Overview

This guide covers the complete deployment process for MkulimaLink from development to production across multiple regions.

---

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Production environment variables configured
- [ ] Database credentials secured in vault
- [ ] API keys for third-party services stored
- [ ] SSL/TLS certificates obtained
- [ ] CDN configuration prepared
- [ ] Email/SMS service credentials configured
- [ ] Payment gateway credentials secured
- [ ] Firebase project created for push notifications

### Code Preparation
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Dependencies updated and audited
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Changelog prepared

### Infrastructure
- [ ] Cloud provider account setup (AWS/Heroku/Azure)
- [ ] Database cluster provisioned
- [ ] Redis cache configured
- [ ] CDN configured
- [ ] Load balancer setup
- [ ] Monitoring tools configured
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan documented

---

## 🌐 Deployment Paths & Options

### Option 1: Recommended Path (Fastest & Easiest)

#### Frontend Deployment (Netlify)
```bash
# 1. Connect GitHub repository to Netlify
# 2. Set build command: npm run build
# 3. Set publish directory: frontend/build
# 4. Configure environment variables
# 5. Enable auto-deploy on push
# 6. Set up preview deployments
```

**Advantages**:
- ✅ Automatic deployments
- ✅ Built-in CDN
- ✅ SSL certificates included
- ✅ Preview deployments
- ✅ Easy rollbacks
- ✅ Free tier available

**Time**: 30 minutes

#### Backend Deployment (Heroku)
```bash
# 1. Create Heroku app
heroku create mkulimalink-api

# 2. Add MongoDB Atlas addon
heroku addons:create mongolab:sandbox

# 3. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-secret>
heroku config:set PAYMENT_API_KEY=<key>

# 4. Deploy from GitHub
git push heroku main

# 5. Run migrations
heroku run npm run migrate
```

**Advantages**:
- ✅ Easy deployment
- ✅ Automatic scaling
- ✅ Built-in monitoring
- ✅ Integrated logging
- ✅ One-click rollbacks

**Time**: 45 minutes

**Total Time**: ~1.5 hours

---

### Option 2: AWS Deployment (Most Scalable)

#### Frontend (CloudFront + S3)
```bash
# 1. Build frontend
npm run build

# 2. Create S3 bucket
aws s3 mb s3://mkulimalink-frontend

# 3. Upload files
aws s3 sync frontend/build s3://mkulimalink-frontend

# 4. Create CloudFront distribution
# - Set S3 bucket as origin
# - Enable caching
# - Configure SSL

# 5. Update DNS
# Point domain to CloudFront distribution
```

**Advantages**:
- ✅ High scalability
- ✅ Global CDN
- ✅ Cost-effective for scale
- ✅ Advanced caching options

**Time**: 1-2 hours

#### Backend (EC2 + RDS + ElastiCache)
```bash
# 1. Launch EC2 instance
aws ec2 run-instances --image-id ami-xxxxx --instance-type t3.medium

# 2. Create RDS database
aws rds create-db-instance --db-instance-identifier mkulimalink-db

# 3. Create ElastiCache cluster
aws elasticache create-cache-cluster --cache-cluster-id mkulimalink-cache

# 4. Deploy application
# SSH into EC2 and clone repository
git clone <repo>
npm install
npm start

# 5. Configure load balancer
aws elbv2 create-load-balancer --name mkulimalink-lb
```

**Advantages**:
- ✅ Full control
- ✅ Highly scalable
- ✅ Enterprise-grade
- ✅ Multi-region support

**Time**: 3-4 hours

**Total Time**: ~5-6 hours

---

### Option 3: Docker + Kubernetes (Most Professional)

#### Docker Setup
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### Build & Push
```bash
# 1. Build Docker image
docker build -t mkulimalink-api:1.0.0 .

# 2. Tag for registry
docker tag mkulimalink-api:1.0.0 gcr.io/project/mkulimalink-api:1.0.0

# 3. Push to registry
docker push gcr.io/project/mkulimalink-api:1.0.0
```

#### Kubernetes Deployment
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mkulimalink-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mkulimalink-api
  template:
    metadata:
      labels:
        app: mkulimalink-api
    spec:
      containers:
      - name: api
        image: gcr.io/project/mkulimalink-api:1.0.0
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
```

```bash
# Deploy to Kubernetes
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

**Advantages**:
- ✅ Auto-scaling
- ✅ Self-healing
- ✅ Rolling updates
- ✅ Multi-region ready
- ✅ Enterprise-grade

**Time**: 4-6 hours

**Total Time**: ~8-10 hours

---

## 🎯 Recommended Deployment Path

### For MVP/Quick Launch: **Option 1 (Netlify + Heroku)**
- **Time**: 1.5 hours
- **Cost**: $0-50/month
- **Scalability**: Up to 100K users
- **Best for**: Startups, MVP validation

### For Growth Stage: **Option 2 (AWS)**
- **Time**: 5-6 hours
- **Cost**: $100-500/month
- **Scalability**: Up to 1M users
- **Best for**: Growing companies

### For Enterprise: **Option 3 (Kubernetes)**
- **Time**: 8-10 hours
- **Cost**: $500-2000+/month
- **Scalability**: Unlimited
- **Best for**: Large enterprises

---

## 📝 Step-by-Step: Recommended Path (Option 1)

### Phase 1: Frontend Deployment (Netlify) - 30 min

1. **Create Netlify Account**
   - Go to netlify.com
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New site from Git"
   - Select GitHub
   - Choose MkulimaLink repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Node version: 18

4. **Set Environment Variables**
   - REACT_APP_API_URL=https://api.mkulimalink.com
   - REACT_APP_MAPBOX_TOKEN=<token>

5. **Deploy**
   - Click "Deploy site"
   - Wait for build completion (~5 min)
   - Get Netlify URL

6. **Configure Custom Domain**
   - Add custom domain
   - Update DNS records
   - Enable HTTPS (automatic)

### Phase 2: Backend Deployment (Heroku) - 45 min

1. **Create Heroku Account**
   - Go to heroku.com
   - Sign up

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Create Application**
   ```bash
   heroku create mkulimalink-api
   ```

4. **Add Database**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Configure Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=<generate-random-secret>
   heroku config:set MONGODB_URI=<from-mongolab>
   heroku config:set PAYMENT_API_KEY=<your-key>
   heroku config:set STRIPE_KEY=<your-key>
   heroku config:set MPESA_KEY=<your-key>
   heroku config:set SENDGRID_API_KEY=<your-key>
   heroku config:set FIREBASE_KEY=<your-key>
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Run Migrations**
   ```bash
   heroku run npm run migrate
   heroku run npm run seed
   ```

8. **Configure Custom Domain**
   ```bash
   heroku domains:add api.mkulimalink.com
   ```

### Phase 3: Mobile Deployment - 1-2 hours

#### iOS (App Store)
1. Create Apple Developer account
2. Create app in App Store Connect
3. Build for iOS: `eas build --platform ios`
4. Submit for review
5. Wait for approval (24-48 hours)

#### Android (Google Play)
1. Create Google Play Developer account
2. Create app in Google Play Console
3. Build for Android: `eas build --platform android`
4. Submit for review
5. Wait for approval (2-4 hours)

---

## 🔒 Security Checklist

### Before Production
- [ ] Enable HTTPS/SSL everywhere
- [ ] Configure CORS properly
- [ ] Set security headers
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up DDoS protection
- [ ] Enable database encryption
- [ ] Configure backups
- [ ] Set up monitoring
- [ ] Enable logging
- [ ] Configure alerts
- [ ] Test disaster recovery

### Environment Variables
```bash
# Never commit these!
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
MONGODB_URI=<secure-connection-string>
REDIS_URL=<secure-redis-url>
PAYMENT_API_KEY=<secure-key>
STRIPE_KEY=<secure-key>
MPESA_KEY=<secure-key>
SENDGRID_API_KEY=<secure-key>
FIREBASE_KEY=<secure-key>
AWS_ACCESS_KEY_ID=<secure-key>
AWS_SECRET_ACCESS_KEY=<secure-key>
```

---

## 📊 Monitoring & Maintenance

### Setup Monitoring
```bash
# New Relic
npm install newrelic
# Add to server.js: require('newrelic')

# Sentry (Error tracking)
npm install @sentry/node
# Configure in server.js

# LogRocket (Session replay)
# Configure in frontend
```

### Configure Alerts
- CPU usage > 80%
- Memory usage > 85%
- Error rate > 1%
- Response time > 1s
- Database connection failures
- API downtime

### Backup Strategy
- Daily automated backups
- Weekly full backups
- Monthly archive backups
- Test restore monthly
- Keep 30 days of backups

---

## 🌍 Multi-Region Deployment

### Africa (Primary)
- **Frontend**: Netlify (auto-global CDN)
- **Backend**: Heroku (US) or AWS (Africa region if available)
- **Database**: MongoDB Atlas (Africa region)
- **CDN**: Cloudflare

### Asia (Secondary)
- **Frontend**: Netlify (auto-global CDN)
- **Backend**: AWS Asia Pacific
- **Database**: MongoDB Atlas (Asia region)
- **CDN**: Cloudflare

### Americas (Tertiary)
- **Frontend**: Netlify (auto-global CDN)
- **Backend**: AWS US
- **Database**: MongoDB Atlas (US region)
- **CDN**: Cloudflare

---

## 📈 Scaling Strategy

### Phase 1: MVP (0-10K users)
- Single Heroku dyno
- Shared MongoDB
- Netlify free tier
- Basic monitoring

### Phase 2: Growth (10K-100K users)
- Heroku Professional dyno
- MongoDB dedicated cluster
- Netlify Pro
- Advanced monitoring

### Phase 3: Scale (100K-1M users)
- AWS with load balancing
- MongoDB sharded cluster
- CloudFront CDN
- Enterprise monitoring

### Phase 4: Enterprise (1M+ users)
- Kubernetes cluster
- Multi-region deployment
- Database replication
- Advanced analytics

---

## 🚀 Deployment Timeline

### Quick Launch (1.5 hours)
1. Netlify setup: 30 min
2. Heroku setup: 45 min
3. Testing: 15 min

### Full Launch (6 hours)
1. Frontend: 1 hour
2. Backend: 2 hours
3. Mobile: 2 hours
4. Testing: 1 hour

### Enterprise Launch (2-3 days)
1. Infrastructure: 1 day
2. Security hardening: 1 day
3. Testing & optimization: 1 day
4. Documentation: 4 hours

---

## 📞 Support & Troubleshooting

### Common Issues

**Deployment fails**
- Check logs: `heroku logs --tail`
- Verify environment variables
- Check database connection
- Review build output

**Slow performance**
- Check database indexes
- Enable caching
- Optimize images
- Use CDN

**High costs**
- Review resource usage
- Optimize database queries
- Use caching effectively
- Consider reserved instances

---

## ✅ Post-Deployment

1. **Verify Deployment**
   - Test all endpoints
   - Check mobile apps
   - Verify database
   - Test payments

2. **Monitor Performance**
   - Check response times
   - Monitor error rates
   - Track user activity
   - Review logs

3. **Communicate Launch**
   - Announce to users
   - Send press release
   - Update social media
   - Notify stakeholders

4. **Plan Next Steps**
   - Gather user feedback
   - Plan Phase 14 (Blockchain)
   - Plan Phase 15 (Advanced Analytics)
   - Plan Phase 16 (Enterprise)

---

**Ready to deploy? Start with Option 1 for fastest time to market!**
