# EventPulse

EventPulse is a production-style Event Management backend API built with Node.js, Express, MongoDB, Mongoose, JWT authentication, role-based authorization, Socket.io real-time announcements, Swagger documentation, and Jest/Supertest tests.

## Features
- MVC architecture with clean folder separation
- MongoDB connection through config
- User, Category, Event, Registration, and Message models
- JWT-based authentication and role-based authorization
- CRUD for categories and events
- Event filtering, pagination, sorting, and search
- Registration management with capacity enforcement
- Real-time announcements via Socket.io
- Swagger docs at /api-docs
- Health endpoint at /health
- Seed script for development data

## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Socket.io
- Swagger UI + Swagger JSDoc
- Jest + Supertest

## Folder Structure
- config/
- controllers/
- middleware/
- models/
- routes/
- seeds/
- tests/
- utils/

## Installation
```bash
npm install
cp .env.example .env
```

## Environment Variables
| Name | Description |
| --- | --- |
| PORT | Server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT |
| JWT_EXPIRES_IN | JWT expiration |
| NODE_ENV | Runtime environment |

## Run in Development
```bash
npm run dev
```

## Seed Data
```bash
npm run seed
```

## Test
```bash
npm test
```

## API Overview
- Auth: /api/auth/register, /api/auth/login
- Categories: /api/categories
- Events: /api/events
- Registrations: /api/registrations
- Messages: /api/messages/:eventId
- Health: /health
- Docs: /api-docs

## Roles
- admin: can manage categories, events, and announcements
- attendee: can register for events and view their registrations

## Socket.io
Clients can join event rooms using `joinEventRoom` and broadcast announcements using `announceToEvent`.

## Deployment Notes
- Use MongoDB Atlas for the database
- Deploy the Node app to Vercel or another Node host
- Set environment variables in the deployment platform
