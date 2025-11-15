# Real Estate Intelligence OS

A FAANG-grade production-ready Real Estate Intelligence Operating System that doesn't compete with agents, developers, or platforms — it becomes the system they depend on.

## 🚀 Features

### Core Intelligence Layers
- **Market Layer**: Real-time market intelligence and trends
- **Agent Layer**: Agent performance analytics and optimization
- **Client Layer**: Client qualification and journey tracking
- **Property Layer**: Property recommendations and analytics
- **Behavior Layer**: Behavioral insights and conversion optimization

### AI-Powered Features
- **AI Brain**: Google Gemini-powered real estate intelligence
- **Smart Recommendations**: Personalized property and agent recommendations
- **Market Analysis**: AI-driven market insights

### Credit System
- **Credit Wallet**: Earn and spend credits for premium features
- **Transaction History**: Complete credit transaction tracking
- **Admin Management**: Manual credit allocation for admins

### Production-Ready Features
- ✅ Rate limiting and security middleware
- ✅ Health checks and monitoring endpoints
- ✅ Comprehensive error handling
- ✅ Database connection pooling (Supabase)
- ✅ Graceful shutdown handling
- ✅ Environment validation
- ✅ Request compression
- ✅ CORS and security headers

## 🛠️ Tech Stack

- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Testing**: Vitest
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```env
DATABASE_URL=postgresql://user:password@host:port/database
GOOGLE_AI_API_KEY=your_google_ai_api_key
PORT=5000
NODE_ENV=development
```

4. Push database schema:
```bash
npm run db:push
```

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📡 API Endpoints

### Health Checks
- `GET /health` - System health status
- `GET /ready` - Readiness probe
- `GET /live` - Liveness probe

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### AI Brain
- `POST /api/ai/brain` - Generate AI-powered responses

### Credits
- `GET /api/credits/balance` - Get credit balance
- `GET /api/credits/history` - Get transaction history
- `POST /api/credits/earn` - Earn credits
- `POST /api/credits/spend` - Spend credits

### Admin
- `GET /api/admin/users` - List all users with credits
- `POST /api/admin/credits/add` - Manually add credits
- `GET /api/admin/credits/transactions` - View all transactions

## 🏗️ Architecture

The system is designed as an OS that other platforms depend on:

1. **API-First**: All features exposed via RESTful APIs
2. **Role-Based**: Supports multiple user roles (client, agent, developer, contributor, admin)
3. **Intelligence-Driven**: AI and data analytics power all recommendations
4. **Extensible**: Modular architecture allows easy extension
5. **Production-Ready**: Built with enterprise-grade practices

## 🔒 Security

- Rate limiting on all API endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation with Zod
- Authentication and authorization middleware
- SQL injection protection via Drizzle ORM

## 📊 Monitoring

- Health check endpoints for Kubernetes/Docker
- Request logging
- Error tracking
- Performance metrics

## 🤝 Contributing

This is a production system designed to be the foundation for real estate platforms. All contributions should maintain the OS-level architecture and production standards.

## 📄 License

MIT

