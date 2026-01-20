# 🌾 MkulimaLink v2.0 - Agriculture Super-App for East Africa

[![GitHub](https://img.shields.io/badge/GitHub-kadioko%2FMkulimaLink-blue)](https://github.com/kadioko/MkulimaLink)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)

**MkulimaLink** is the most comprehensive agriculture platform in East Africa, combining marketplace, financial services, logistics, insurance, farm management, and advanced technology into one powerful super-app. Built for East Africa's farming community with AI-powered features, real-time communication, blockchain traceability, and offline-first architecture.

## 🏆 Why MkulimaLink Dominates the Market

| Feature | Description |
|---------|-------------|
| **15+ Revenue Streams** | Commissions, loans, insurance, ads, equipment rental, video marketplace, blockchain verification |
| **Offline-First** | Works in rural areas with poor connectivity |
| **Swahili Voice Commerce** | Accessible to low-literacy users with speech-to-text |
| **AI-Powered** | Pest detection, price predictions, crop recommendations, disease detection |
| **Financial Inclusion** | Micro-loans, insurance, M-Pesa, Airtel Money, digital wallets, supply chain finance |
| **Real-Time** | Live chat, delivery tracking, price alerts, WebSocket notifications |
| **Advanced Tech** | AR/VR visualization, blockchain supply chain, video marketplace, voice commerce |
| **Data Intelligence** | Farm analytics, GPS mapping, predictive forecasting, market insights |

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🛒 Marketplace
- **Product Listings** - Farmers list products with photos, AI pest detection
- **Advanced Search** - Filter by category, region, price, quality
- **Transaction Management** - Complete order processing with M-Pesa
- **Reviews & Ratings** - Build trust with verified reviews

### 💬 Real-Time Communication
- **Live Chat** - Direct messaging between buyers and sellers
- **WebSocket Notifications** - Instant alerts for orders, messages, prices
- **Typing Indicators** - See when others are typing
- **Price Negotiation** - In-chat offer/counter-offer system

### 🚚 Logistics & Delivery
- **Delivery Tracking** - Real-time GPS tracking for shipments
- **Route Optimization** - Smart delivery route planning
- **Proof of Delivery** - Photo/signature confirmation
- **Pricing Calculator** - Distance & weight-based pricing

### 💰 Financial Services
- **Micro-Loans** - AI credit scoring, instant approval (10K-5M TZS)
- **Crop Insurance** - Protection against drought, floods, pests
- **Weather Index Insurance** - Automatic satellite-triggered payouts
- **M-Pesa Integration** - Secure mobile payments

### 👥 Group Buying
- **Bulk Purchases** - Join forces for better prices
- **Milestone Discounts** - Unlock savings as more farmers join
- **Progress Tracking** - Real-time participation updates

### 🌱 Farm Management
- **Crop Calendar** - Plan planting to harvest schedules
- **Task Management** - Reminders for farm activities
- **Expense Tracking** - Calculate profitability
- **Yield Recording** - Track actual vs expected yields

### 🚜 Equipment Rental
- **Equipment Marketplace** - Rent tractors, harvesters, tools
- **Booking System** - Availability calendar
- **Operator Services** - Hire with trained operator

### 📊 Analytics & Intelligence
- **Price Alerts** - Get notified when prices hit targets
- **Market Trends** - Historical price analysis
- **Sales Analytics** - Revenue and performance tracking
- **AI Predictions** - Yield and price forecasting
- **Farm Analytics Dashboard** - GPS mapping, satellite monitoring
- **Predictive Analytics** - Yield forecasting, market trends
- **Performance Metrics** - ROI tracking, profitability analysis
- **Market Intelligence** - Regional price trends, demand forecasting

### 🏪 Supplier Directory
- **Input Sourcing** - Seeds, fertilizers, pesticides
- **Verified Suppliers** - Trusted vendor badges
- **Product Catalogs** - Browse inventories

### 🎥 Video Marketplace
- **Product Videos** - Upload and showcase products
- **Video Processing** - Automatic compression and optimization
- **Engagement Tracking** - Views, likes, shares analytics
- **Video Search** - Find products by video content
- **Trending Videos** - Popular product showcases

### 🎨 AR/VR Visualization
- **3D Product Models** - Interactive product viewing
- **AR Experience** - Augmented reality product preview
- **VR Showroom** - Virtual product exploration
- **QR Code Tracking** - Blockchain-verified authenticity
- **Device Compatibility** - Cross-platform support

### 🎤 Voice Commerce
- **Speech-to-Text** - Natural language product search
- **Voice Commands** - Hands-free shopping interface
- **Multi-Language** - English, Swahili, French, Arabic
- **Audio Responses** - Text-to-speech product information
- **Voice Analytics** - Usage patterns and preferences

### ⛓️ Blockchain Supply Chain
- **Immutable Records** - Tamper-proof product history
- **QR Code Verification** - Scan to verify authenticity
- **Supply Chain Tracking** - From farm to market
- **Ownership Transfer** - Transparent transaction records
- **Fraud Detection** - Suspicious activity alerts

### 💳 Advanced Financial Services
- **M-Pesa Integration** - STK Push, C2B, B2C payments
- **Airtel Money** - Collection and disbursement
- **Digital Wallets** - Secure balance management
- **Supply Chain Finance** - Advance payments for farmers
- **Micro-Loans** - AI credit scoring, instant approval
- **Crop Insurance** - Weather-indexed protection

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime environment |
| Express.js | 4.21 | Web framework |
| MongoDB | 7+ | Database |
| Mongoose | 8.5 | ODM |
| Socket.io | 4.7 | Real-time communication |
| Redis | 7+ | Caching & sessions |
| BullMQ | 5+ | Job queues |
| JWT | - | Authentication |
| Winston | 3.11 | Logging |
| Sentry | 8.x | Error tracking |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI framework |
| TanStack Query | 5.x | Data fetching |
| Zustand | 4.5 | State management |
| Socket.io Client | 4.7 | Real-time |
| TailwindCSS | 3.4 | Styling |
| Framer Motion | 11.x | Animations |
| React Leaflet | 4.x | Maps |
| Recharts | 2.x | Charts |
| i18next | 23.x | Internationalization |
| Storybook | 8.x | Component docs |

### Integrations
- **M-Pesa** - Mobile payments (Daraja API)
- **Airtel Money** - Mobile payments (Africa API)
- **Africa's Talking** - SMS notifications
- **OpenWeather** - Weather data
- **TensorFlow.js** - AI/ML models
- **Web3.js** - Blockchain integration (Polygon, Ethereum, BSC)
- **AWS S3** - Video and media storage
- **Google Speech-to-Text** - Voice processing
- **Google Text-to-Speech** - Audio generation
- **FFmpeg** - Video processing

## 📁 Project Structure

```
MkulimaLink/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── models/
│   │   ├── User.js              # User accounts
│   │   ├── Product.js           # Product listings
│   │   ├── Transaction.js       # Orders
│   │   ├── Chat.js              # Messages
│   │   ├── Delivery.js          # Logistics
│   │   ├── Insurance.js         # Insurance policies
│   │   ├── Loan.js              # Micro-loans
│   │   ├── GroupBuy.js          # Group purchases
│   │   ├── CropCalendar.js      # Farm planning
│   │   ├── Equipment.js         # Rentals
│   │   ├── PriceAlert.js        # Price alerts
│   │   ├── Supplier.js          # Suppliers
│   │   └── ...                  # 19 models total
│   ├── routes/
│   │   ├── auth.js              # Authentication
│   │   ├── products.js          # Products CRUD
│   │   ├── transactions.js      # Orders
│   │   ├── chat.js              # Messaging
│   │   ├── delivery.js          # Logistics
│   │   ├── insurance.js         # Insurance
│   │   ├── loans.js             # Loans
│   │   ├── groupbuy.js          # Group buying
│   │   ├── calendar.js          # Crop calendar
│   │   ├── equipment.js         # Equipment rental
│   │   ├── alerts.js            # Price alerts
│   │   ├── suppliers.js         # Suppliers
│   │   ├── analytics.js         # Dashboard stats
│   │   ├── ai.js                # AI features
│   │   ├── payments.js          # M-Pesa & Airtel
│   │   ├── supplyChainFinance.js # SCF routes
│   │   ├── videos.js            # Video marketplace
│   │   ├── arvr.js              # AR/VR routes
│   │   ├── voice.js             # Voice commerce
│   │   ├── blockchain.js        # Blockchain tracking
│   │   ├── farmAnalytics.js     # Farm analytics
│   │   └── ...                  # 30+ routes total
│   ├── utils/
│   │   ├── socket.js            # WebSocket setup
│   │   ├── logger.js            # Winston logging
│   │   ├── sms.js               # SMS service
│   │   ├── cronJobs.js          # Scheduled tasks
│   │   └── ...                  # 10 utilities
│   └── server.js                # Express app
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json        # PWA config
│   └── src/
│       ├── api/
│       │   └── axios.js         # API client
│       ├── components/
│       │   ├── Layout.js        # Main layout
│       │   ├── ChatWidget.js    # Real-time chat
│       │   ├── DeliveryTracker.js
│       │   ├── GroupBuyCard.js
│       │   ├── PriceAlertCard.js
│       │   └── OfflineIndicator.js
│       ├── hooks/
│       │   ├── useSocket.js     # WebSocket hook
│       │   └── useOffline.js    # Offline detection
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Products.js
│       │   ├── ProductDetail.js
│       │   ├── Dashboard.js
│       │   ├── Chats.js
│       │   ├── GroupBuying.js
│       │   ├── CropCalendar.js
│       │   ├── Market.js
│       │   ├── Weather.js
│       │   ├── AIInsights.js
│       │   └── ...              # 16 pages total
│       ├── store/
│       │   └── authStore.js     # Zustand store
│       ├── utils/
│       │   ├── socket.js        # Socket.io client
│       │   └── offlineStorage.js # IndexedDB
│       ├── App.js
│       └── index.js
├── .github/workflows/           # CI/CD pipelines
├── .husky/                      # Git hooks
├── .storybook/                  # Storybook config
├── .env.example                 # Environment template
├── .eslintrc.json               # ESLint config
├── .prettierrc                  # Prettier config
├── Dockerfile                   # Docker build
├── docker-compose.yml           # Docker services
├── jest.config.js               # Test config
├── package.json                 # Root package
├── API_DOCUMENTATION.md         # Full API docs
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Contributor guide
├── DEPLOYMENT.md                # Deploy guide
├── LICENSE                      # MIT License
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **MongoDB** 7+ ([Download](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# Clone repository
git clone https://github.com/kadioko/MkulimaLink.git
cd MkulimaLink

# Install all dependencies (backend + frontend)
npm run install-all

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# (See Environment Variables section)

# Create uploads directory
mkdir -p uploads/products logs

# Seed demo data (optional)
npm run seed
```

### Running Development Server

```bash
# Start MongoDB (if local)
mongod

# Start both backend and frontend
npm run dev

# Or start separately:
npm run server    # Backend on http://localhost:5000
npm run client    # Frontend on http://localhost:3000
```

### Demo Accounts
After running `npm run seed`:
- **Farmer**: `farmer@demo.com` / `password123`
- **Buyer**: `buyer@demo.com` / `password123`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (filterable) |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Chat & Messaging
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat` | Get user's chats |
| POST | `/api/chat/start` | Start new chat |
| POST | `/api/chat/:id/messages` | Send message |
| PUT | `/api/chat/:id/read` | Mark as read |

### Financial Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/loans/apply` | Apply for loan |
| GET | `/api/loans/credit-score` | Get credit score |
| POST | `/api/insurance/quote` | Get insurance quote |
| POST | `/api/insurance/purchase` | Buy policy |

### Group Buying
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groupbuy` | List group buys |
| POST | `/api/groupbuy/create` | Create group buy |
| POST | `/api/groupbuy/:id/join` | Join group |

### Delivery
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/delivery/create` | Create delivery |
| GET | `/api/delivery/track/:tracking` | Track shipment |

📖 **Full API documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/mkulimalink
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=30d

# M-Pesa (Daraja API)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback
MPESA_ENV=sandbox

# SMS (Africa's Talking)
AFRICASTALKING_API_KEY=your_api_key
AFRICASTALKING_USERNAME=your_username
AFRICASTALKING_SENDER_ID=MkulimaLink

# Weather
OPENWEATHER_API_KEY=your_api_key

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=af-south-1
AWS_S3_BUCKET=mkulimalink-uploads

# Business Config
COMMISSION_RATE=0.05
PREMIUM_MONTHLY_PRICE=10000
PREMIUM_YEARLY_PRICE=100000
```

## 🚢 Deployment

### Quick Deploy with PM2

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Start with PM2
pm2 start backend/server.js --name mkulimalink
pm2 save
pm2 startup
```

### Docker

```bash
# Development (MongoDB + Redis only)
npm run docker:dev

# Production (full stack)
docker-compose up -d
```

📖 **Full deployment guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

## 💰 Revenue Model

| Stream | Rate | Status |
|--------|------|--------|
| Transaction Commission | 3-7% | ✅ Active |
| Premium Subscriptions | 10K-100K TZS/month | ✅ Active |
| Featured Listings | 5K-35K TZS | ✅ Active |
| Loan Origination | 2% | ✅ Active |
| Insurance Commission | 10% | ✅ Active |
| Delivery Fees | Platform cut | ✅ Active |
| Equipment Rental | 10% | ✅ Active |
| Video Marketplace | 15% | ✅ New |
| AR/VR Verification | 5K-50K TZS | ✅ New |
| Voice Commerce Premium | 5K/month | ✅ New |
| Blockchain Verification | 2K per batch | ✅ New |
| Supply Chain Finance | 3-5% | ✅ New |
| Analytics Premium | 20K/month | 🔄 Phase 5 |
| Data Insights | Custom pricing | 🔄 Phase 5 |
| Community Features | 10K/month | 🔄 Phase 7 |
| **Total Potential** | **15+ streams** | **Scaling** |

## 🧪 Testing

```bash
# Run backend tests with coverage
npm test

# Watch mode
npm run test:watch

# Run frontend tests
cd frontend && npm test
```

## 🔧 Developer Tools

### API Documentation
```bash
# Access Swagger UI at
http://localhost:5000/api/docs
```

### Storybook (Component Library)
```bash
cd frontend
npm run storybook
# Opens at http://localhost:6006
```

### Database Migrations
```bash
npm run migrate           # Run migrations
npm run migrate:rollback  # Rollback last
npm run migrate:status    # Check status
npm run migrate:create "name"  # Create new
```

### Linting & Formatting
```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
npm run format      # Format code
```

## 🌍 Internationalization

Supported languages:
- 🇬🇧 **English** (default)
- 🇹🇿 **Swahili** (Kiswahili)

Language files: `frontend/src/i18n/locales/`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔒 Security & Compliance

- **Authentication**: JWT with refresh tokens, biometric support
- **Rate Limiting**: IP & per-user rate limiting
- **Input Validation**: XSS, NoSQL injection, CSRF protection
- **Headers**: Helmet.js security headers, CSP policies
- **CORS**: Strict CORS configuration
- **Error Tracking**: Sentry integration
- **Git Hooks**: Husky pre-commit hooks
- **Encryption**: End-to-end encryption for sensitive data
- **Blockchain**: Immutable audit trails
- **Compliance**: GDPR-ready, data protection policies
- **Zero-Trust**: Enhanced authentication for sensitive operations

## 🚀 Roadmap & Phases

### ✅ Completed Phases
- **Phase 1**: Core Marketplace & Logistics
- **Phase 2**: Mobile App & AI/ML Infrastructure
- **Phase 3**: Financial Services (M-Pesa, Wallets, Loans, Insurance, SCF)
- **Phase 4**: Advanced Features (Video, AR/VR, Voice, Blockchain)

### 🔄 In Progress & Upcoming
- **Phase 5**: Analytics & Insights (4 weeks) - Farm analytics, GPS mapping, predictive forecasting
- **Phase 6**: Localization & Expansion (3-4 weeks) - Multi-country support, regional adaptation
- **Phase 7**: Community & Social (3 weeks) - Farmer networks, forums, training platform
- **Phase 8**: Monetization (2-3 weeks) - Premium tiers, advertising, data marketplace
- **Phase 9**: Advanced Security (2 weeks) - Zero-trust, fraud detection, compliance automation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@mkulimalink.co.tz
- **Issues**: [GitHub Issues](https://github.com/kadioko/MkulimaLink/issues)

## 🙏 Acknowledgments

- Tanzania Meteorological Authority (TMA)
- Africa's Talking
- Safaricom (M-Pesa)
- All contributors

---

<p align="center">
  Made with ❤️ for Tanzania's Farmers
</p>
