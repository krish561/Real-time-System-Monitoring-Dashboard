# Real-time System Monitoring Dashboard

A comprehensive web application for monitoring system performance, resource utilization, and user activity in real-time.

## Features

### 1. Real-time Monitoring
- Live CPU Usage tracking using `mpstat`
- Real Memory Usage monitoring using `free` command
- Active Users count through WebSocket connections
- API Request Count tracking

### 2. Interactive Dashboard
- Real-time stats cards showing current metrics
- Interactive line charts for historical data visualization
- Custom styled tooltips for detailed data points
- Export functionality for metrics data (CSV format)

### 3. Alert System
- Configurable threshold alerts for:
  - CPU Usage (default: 95%)
  - Memory Usage (default: 95%)
  - Active Users (default: 100)
  - Request Count (default: 1000)
- Real-time toast notifications when thresholds are exceeded

### 4. User Authentication
- Secure login/registration system
- Password hashing with salt using scrypt
- Session management with PostgreSQL session store
- Protected routes requiring authentication

## Technology Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- WebSocket for real-time updates
- Recharts for data visualization
- Shadcn UI components
- Tailwind CSS for styling
- Wouter for routing

### Backend
- Express.js server
- WebSocket server for real-time metrics
- PostgreSQL database with Drizzle ORM
- Passport.js for authentication
- System metrics collection using native Linux commands

## Key Components

### 1. DashboardStats
Displays current metrics in card format with icons:
- Active Users
- CPU Usage
- Memory Usage
- Request Count

### 2. DataVisualization
Interactive line chart showing historical data with:
- Time-series data for all metrics
- Custom tooltips
- CSV export functionality
- Axis labels and legends

### 3. AlertSettings
Configurable alert thresholds with:
- Input fields for each metric
- Real-time validation
- Toast notifications
- Persistent settings

## Real-time Updates

The application uses WebSocket connections to push updates:
1. Server collects system metrics every 2 seconds
2. Metrics are stored in PostgreSQL database
3. Updates are broadcast to all connected clients
4. Frontend updates charts and stats in real-time
5. Alerts are triggered when thresholds are exceeded

## Authentication Flow

1. Registration:
   - Username/password validation
   - Password hashing with salt
   - Automatic login after registration

2. Login:
   - Passport Local Strategy
   - Session-based authentication
   - Protected route redirection

3. Session Management:
   - PostgreSQL session store
   - Secure session configuration
   - Automatic cleanup of expired sessions

## Development Guidelines

1. Code Structure:
   - Frontend code in `client/src`
   - Backend code in `server`
   - Shared types in `shared`

2. Database:
   - Use Drizzle ORM for database operations
   - Run migrations with `npm run db:push`
   - Keep schema in `shared/schema.ts`

3. Styling:
   - Use Tailwind CSS classes
   - Follow shadcn/ui component patterns
   - Maintain consistent spacing and typography

4. Security:
   - All routes under `/api`
   - Authentication required for dashboard
   - Secure password handling
   - Protected WebSocket connections

## System Requirements

- Node.js (v18 or higher)
- PostgreSQL database
- Linux environment with `sysstat` package for system metrics


## Installation

1. Install system dependencies:
   ```bash
   # Install sysstat for CPU monitoring
   apt-get install sysstat
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npm run db:push
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`.
