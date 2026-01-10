# MkulimaLink v2.0 - Agriculture Super-App for East Africa

MkulimaLink is the **most comprehensive agriculture platform** in East Africa, combining marketplace, financial services, logistics, insurance, and farm management into one powerful super-app. Built for Tanzania's farming community with AI-powered features, real-time communication, and offline-first architecture.

## 🏆 Why MkulimaLink Dominates the Market

- **10+ Revenue Streams** - Commissions, loans, insurance, ads, equipment rental
- **Offline-First** - Works in rural areas with poor connectivity
- **Swahili Voice Commands** - Accessible to low-literacy users
- **AI-Powered** - Pest detection, price predictions, crop recommendations
- **Financial Inclusion** - Micro-loans, insurance, M-Pesa integration
- **Real-Time** - Live chat, delivery tracking, price alerts

## Features

### Core Features
- **User Authentication**: Secure registration and login for farmers and buyers
- **Product Listings**: Farmers can list products with photos and detailed information
- **AI Pest Detection**: Automatic pest detection on uploaded product images
- **Search & Filter**: Advanced product search with multiple filters
- **Transaction Management**: Complete order processing with M-Pesa integration
- **Commission Tracking**: Automated commission calculation and tracking
- **SMS Notifications**: Real-time notifications via Africa's Talking API

### AI-Powered Features (Premium)
- **Crop Yield Predictions**: AI-based yield forecasting
- **Market Price Predictions**: Future price predictions for better selling decisions
- **Buyer-Seller Matching**: Intelligent matching algorithm
- **Crop Recommendations**: AI suggests best crops based on conditions
- **Market Analytics**: Advanced market trend analysis

### Additional Features
- **Real-time Market Prices**: Live agricultural commodity prices across Tanzania
- **Weather Forecasting**: Accurate weather data and farming alerts
- **Mobile-First Design**: Optimized for Android devices and low-bandwidth
- **M-Pesa Integration**: Secure payments through M-Pesa
- **Premium Subscriptions**: Monthly and yearly premium plans

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with Sharp for image processing
- **AI/ML**: TensorFlow.js for pest detection and predictions
- **Payment**: M-Pesa Daraja API
- **SMS**: Africa's Talking API
- **Cron Jobs**: node-cron for scheduled tasks

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Forms**: React Hook Form
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd MkulimaLink
```

2. Install backend dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mkulimalink
JWT_SECRET=your_jwt_secret_key
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
AFRICASTALKING_API_KEY=your_africastalking_key
AFRICASTALKING_USERNAME=your_username
```

5. Create uploads directory:
```bash
mkdir -p uploads/products
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

1. Start MongoDB:
```bash
mongod
```

2. Start backend server:
```bash
npm run server
```

3. Start frontend (in a new terminal):
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Mode

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Start production server:
```bash
npm start
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (farmer only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transaction Endpoints
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/my/purchases` - Get user purchases
- `GET /api/transactions/my/sales` - Get user sales
- `PUT /api/transactions/:id/status` - Update transaction status

### Market Data Endpoints
- `GET /api/market/prices` - Get market prices
- `GET /api/market/prices/latest` - Get latest prices
- `GET /api/market/prices/trends/:product` - Get price trends

### Weather Endpoints
- `GET /api/weather/current/:region` - Get current weather
- `GET /api/weather/forecast/:region` - Get weather forecast
- `GET /api/weather/alerts/:region` - Get weather alerts

### AI Endpoints (Premium)
- `POST /api/ai/yield-prediction` - Predict crop yield
- `POST /api/ai/price-prediction` - Predict market price
- `POST /api/ai/buyer-matching` - Match buyers with products
- `POST /api/ai/recommendations/crop` - Get crop recommendations

### Payment Endpoints
- `POST /api/payments/mpesa/initiate` - Initiate M-Pesa payment
- `POST /api/payments/premium/subscribe` - Subscribe to premium
- `GET /api/payments/balance` - Get user balance
- `POST /api/payments/withdraw` - Request withdrawal

## Deployment

### AWS Deployment

1. **Set up EC2 Instance**:
   - Launch Ubuntu 20.04 LTS instance (t2.micro for free tier)
   - Configure security groups (ports 22, 80, 443, 5000)

2. **Install Dependencies**:
```bash
sudo apt update
sudo apt install nodejs npm mongodb nginx
```

3. **Clone and Setup**:
```bash
git clone <repository-url>
cd MkulimaLink
npm install
cd frontend && npm install && npm run build
```

4. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Set up PM2**:
```bash
npm install -g pm2
pm2 start backend/server.js --name mkulimalink
pm2 startup
pm2 save
```

6. **Configure SSL** (optional):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Environment Variables for Production

Ensure all production environment variables are set:
- Use strong JWT_SECRET
- Configure production MongoDB URI
- Add production M-Pesa credentials
- Set up production SMS API keys
- Configure AWS S3 for file uploads (optional)

## Mobile Optimization

The application is optimized for mobile devices with:
- Responsive design using TailwindCSS
- Touch-friendly UI components
- Image compression for low bandwidth
- Progressive Web App (PWA) capabilities
- Lazy loading for better performance

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- File upload restrictions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@mkulimalink.co.tz or create an issue in the repository.

## Acknowledgments

- Tanzania Meteorological Authority (TMA) for weather data
- Africa's Talking for SMS services
- Safaricom for M-Pesa integration
- All contributors and testers
