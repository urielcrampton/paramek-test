# Paramek Test - JS+Python Monorepo

A modern monorepo setup with React + Vite frontend and FastAPI backend.

## 🏗️ Project Structure

```
paramek-test/
├── apps/
│   ├── web/          # React + Vite frontend
│   └── api/          # FastAPI backend
├── db/
│   └── migrations/   # PostgreSQL database migrations
├── docker-compose.yml
├── package.json      # Root workspace configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Python 3.8+
- Docker and Docker Compose (optional)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd paramek-test
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   # Copy environment files
   cp apps/web/.env.example apps/web/.env
   cp apps/api/.env.example apps/api/.env
   
   # Edit the .env files with your configuration
   ```

3. **Start development servers:**
   ```bash
   # Start both services concurrently
   npm run dev
   
   # Or start individually
   npm run dev:web    # Frontend on http://localhost:3000
   npm run dev:api    # Backend on http://localhost:8000
   ```

### Docker Setup

1. **Build and start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Database: PostgreSQL on localhost:5433

## 📦 Available Scripts

### Root Level Commands

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:web` - Start only the frontend
- `npm run dev:api` - Start only the backend
- `npm run build` - Build both applications
- `npm run build:web` - Build only the frontend
- `npm run build:api` - Build only the backend
- `npm run install:all` - Install dependencies for all workspaces
- `npm run clean` - Clean all node_modules and build artifacts
- `npm run lint` - Run linting for all workspaces
- `npm run test` - Run tests for all workspaces

### Frontend (apps/web)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (apps/api)

- `npm run dev` - Start FastAPI with auto-reload
- `npm run start` - Start FastAPI in production mode
- `npm run test` - Run pytest tests
- `npm run lint` - Run linting (configure as needed)

## 🛠️ Technology Stack

### Frontend (apps/web)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

### Backend (apps/api)
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Pytest** - Testing framework
- **PostgreSQL** - Database with raw SQL
- **psycopg2** - PostgreSQL adapter for Python
- **Requests** - HTTP library for external APIs

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Paramek Test
VITE_APP_VERSION=1.0.0
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://wti:wti@localhost:5433/wti
COUNTRIES_API_BASE=https://restcountries.com/v3.1
```

## 🐳 Docker

The project includes Docker support for both services:

- **Frontend**: Node.js 18 Alpine with Vite dev server
- **Backend**: Python 3.11 Slim with FastAPI

### Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build web
```

## 📁 Workspace Management

This project uses npm workspaces for monorepo management:

- Root `package.json` defines workspace configuration
- Each app has its own `package.json` with scoped naming
- Shared dependencies can be hoisted to the root
- Individual apps can have their own specific dependencies

## 🧪 Testing

### Frontend Testing
```bash
cd apps/web
npm test  # Add test scripts as needed
```

### Backend Testing
```bash
cd apps/api
npm test  # Runs pytest
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd apps/web
npm run build
# Deploy the 'dist' folder to your static hosting service
```

### Backend Deployment
```bash
cd apps/api
# Use the Dockerfile for containerized deployment
# Or deploy directly with uvicorn in production
```

## 📝 API Documentation

When the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Available Endpoints

#### Health Check
- `GET /health` - Check API health status

#### Countries (External API Proxy)
- `GET /countries` - Get all countries
- `GET /countries?q={name}` - Search countries by name

#### Trips (CRUD Operations)
- `GET /trips` - List all trips
- `POST /trips` - Create a new trip
- `PUT /trips/{id}` - Update a trip
- `DELETE /trips/{id}` - Delete a trip


### Getting Help

- Check the logs: `docker-compose logs -f`
- Verify environment variables are set correctly
- Ensure all dependencies are installed: `npm run install:all`
