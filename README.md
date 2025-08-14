# Construction Management API

A RESTful API for managing construction projects, bids, and milestones built with Node.js, Express, and PostgreSQL using Sequelize ORM.

##  Project Overview

This API enables:
- **User Management**: Registration, authentication, and role-based access (Contractors, House Owners, Project Owners)
- **Project Management**: Create and manage construction projects
- **Bidding System**: Contractors can bid on projects
- **Milestone Tracking**: Track project progress and payments

## Database Schema

### Entity Relationship Diagram

```
Users (Homeowners) (1) ←→ (N) Projects
   ↓                        ↓
Bids (N) ←→ (1) Milestones (N)
   ↓
Contractors (Users with contractor role)

```

### Models
- **User**: Authentication, roles, verification
- **Project**: Construction project details with homeowner association
- **Bid**: Contractor proposals for projects
- **Milestone**: Project progress tracking

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd construction
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DATABASE_NAME=construction_db
   DATABASE_USER=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   PORT=3001
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=your_preferred_time
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb construction_db
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   The API will be available at `http://localhost:3000`

## Testing Endpoints

### Authentication Endpoints

#### 1. User Registration
```bash
curl -X POST http://localhost:3001/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "gender": "male",
    "role": "house_owner"
  }'
```

#### 2. OTP Verification
```bash
curl -X POST http://localhost:3001/api/user/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user_id_here",
    "otp": "123456"
  }'
```

#### 3. User Login
```bash
curl -X POST http://localhost:3001/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Project Endpoints

#### 4. Create Project (Requires Authentication)
```bash
curl -X POST http://localhost:3001/api/user/project \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Kitchen Renovation",
    "description": "Complete kitchen remodeling project",
    "location": "123 Main St, City, State"
  }'
```

#### 5. Get Project with Bids
```bash
curl -X GET http://localhost:3001/api/user/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Bid Endpoints

#### 6. Create Bid (Requires Authentication)
```bash
curl -X POST http://localhost:3001/api/user/bid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "projectId": "PROJECT_ID",
    "price": 15000,
    "duration": "6 weeks"
  }'
```

#### 7. Create Milestone for a Project (Requires Authentication)
```bash
curl -X POST http://localhost:3001/api/user/project/milestone \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "projectId": "PROJECT_ID",
    "title": "Terrace Kulture",
    "description": "Flooring and screeding of the apartment done",
    "status": "completed"
    "dueDate": ""
  }'
```
#### 8. Get Project Milestones
```bash
curl -X GET http://localhost:3001/api/user/milestone/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

##  Docker Setup

### Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_HOST=db
      - DATABASE_PORT=5432
      - DATABASE_NAME=construction_db
      - DATABASE_USER=postgres
      - DATABASE_PASSWORD=password
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=construction_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Running with Docker
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

## AWS Elastic Beanstalk Deployment

### 1. Prepare Application
```bash
# Create deployment package
npm run build
zip -r construction-api.zip . -x "node_modules/*" ".git/*" "*.md"
```

### 2. EB CLI Setup
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init construction-api --platform node.js --region us-east-1

# Create environment
eb create production --instance-type t2.micro --single-instance
```

### 3. Environment Variables
Set these in your EB environment:
- `DATABASE_NAME`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_HOST` (RDS endpoint)
- `DATABASE_PORT`
- `JWT_SECRET`
- `NODE_ENV=production`

### 4. Deploy
```bash
eb deploy
```

## API Documentation

### Base URL
```
http://localhost:3000/api/user
```

### Endpoints Summary
| Method | Endpoint                 | Description                | Auth Required |
|--------|--------------------------|----------------------------|---------------|
| POST | `/signup`                | User registration          | No |
| POST | `/verify-otp`            | Email verification         | No |
| POST | `/login`                 | User authentication        | No |
| POST | `/project`               | Create project             | Yes |
| GET | `/project/:id`           | Get project with bids      | Yes |
| POST | `/bid`                   | Create bid                 | Yes |
| POST | `/project/milestone`     | Create project milestone   | Yes |
| GET | `/milestones/:projectId` | Get project with milestone | Yes |


### Response Format
```json
{
  "status": "success",
  "data": {}
}
```

### Error Format
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run lint       # Run linter
```

### Project Structure
```
construction/
├── config/           # Database and app configuration
├── controller/       # Request handlers
├── exceptions/       # Custom error classes
├── middleware/       # Express middleware
├── model/           # Sequelize models
├── repository/      # Data access layer
├── routes/          # API route definitions
├── services/        # Business logic
|── validators/        # validation inputs
└── constructionApplication.js  # Main application file
```

##  Testing

### Manual Testing
Use the provided curl commands or import the Postman collection.

### Automated Testing
```bash
# Run all tests
npm test
```

##  Environment Variables

| Variable | Description              | Default     |
|----------|--------------------------|-------------|
| `DATABASE_NAME` | PostgreSQL database name | -           |
| `DATABASE_USER` | Database username        | -           |
| `DATABASE_PASSWORD` | Database password        | -           |
| `DATABASE_HOST` | Database host            | localhost   |
| `DATABASE_PORT` | Database port            | 5432        |
| `PORT` | Application port         | 3000        |
| `JWT_SECRET` | JWT signing secret       | -           |
| `JWT_EXPIRES_IN` | JWT secret expiration    | -           |
| `NODE_ENV` | Environment mode         | development |


