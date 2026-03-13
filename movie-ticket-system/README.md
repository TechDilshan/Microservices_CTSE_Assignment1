# Movie Hub - Movie Ticket Management System

Fully functional microservices backend for **Movie Hub** with roles: **Admin**, **Hall Owner**, **Customer**, **Visitors**.

## Architecture

| Service        | Port | Tech Stack        | Description                      |
|----------------|------|-------------------|----------------------------------|
| API Gateway    | 5001 | Node.js, Express  | Routes requests to services      |
| User Service   | 3001 | Node.js, MongoDB  | Users, roles, auth               |
| Hall Service   | 3005 | Node.js, MongoDB  | Halls, SeatBlocks, seat layout   |
| Movie Service  | 8000 | Python, FastAPI, MongoDB | Movies, showtimes, prices |
| Booking Service| 3003 | Node.js, MongoDB  | Bookings, seat availability      |
| Payment Service| 3004 | Java, Spring Boot | Payments                         |

## Data Models

- **User**: userId, name, email, password, phone, role (admin|hall_owner|customer), createdAt
- **Hall**: hallId, hallOwnerId, name, location, hallImageUrl
- **SeatBlock**: hallId, numSeats { ODC, Balcony, Box }, odc { rows, columns }
- **Movie**: movieId, hallId, name, startDate, endDate, duration, language, genre, movieImageUrl, showTime[], price { ODC_Full, ODC_Half, Balcony, Box }
- **Booking**: bookingId, hallId, movieId, userId, showTime, date, seats[]
- **Payment**: payId, bookingId, userId, amount, method, status

## Quick Start

### 1. Environment

Copy `.env.example` to `.env` in each service. Use the same `JWT_SECRET` across all services. Booking service needs:
- `HALL_SERVICE_URL=http://localhost:3005`
- `PAYMENT_SERVICE_URL=http://localhost:3004`

### 2. Install Dependencies

```bash
cd movie-ticket-system
npm install --prefix api-gateway
npm install --prefix user-service
npm install --prefix hall-service
npm install --prefix booking-service

# Movie Service (Python)
cd movie-service && pip install -r requirements.txt
```

### 3. Seed Admin

```bash
cd user-service && node src/scripts/seedAdmin.js
# Admin: admin@movieticket.com / admin123
```

### 4. Run Services

```bash
# Terminal 1 - API Gateway
cd api-gateway && npm start

# Terminal 2 - User Service
cd user-service && npm start

# Terminal 3 - Hall Service
cd hall-service && npm start

# Terminal 4 - Movie Service (Python)
cd movie-service && uvicorn app.main:app --host 0.0.0.0 --port 8000

# Terminal 5 - Booking Service
cd booking-service && npm start

# Terminal 6 - Payment Service (Java)
cd payment-service && ./mvnw spring-boot:run
```

### 5. API Gateway Base URL

`http://localhost:5001`

- `/api/users` - User service
- `/api/halls` - Hall service
- `/api/movies` - Movie service
- `/api/bookings` - Booking service
- `/api/payments` - Payment service
- `/docs` - Swagger UI

## API Summary

### Admin
- Login, CRUD Hall Owners, CRUD Halls

### Hall Owner
- Login, update/delete own account, view/delete customers
- CRUD Movies, CRUD Bookings, CRUD Payments
- View/update SeatBlock (ODC rows/columns, Balcony, Box) – generates full seat structure

### Customer
- Self-register, login, update/delete own account
- View movies and halls (with or without login)
- View movie details, book seats, view available seat structure
- Create booking, pay via `POST /api/bookings/:id/pay`, view booking history

### Visitors
- View movies and halls without login

## Seat Structure

SeatBlock defines ODC (rows × columns), Balcony count, Box count. Full structure is generated: `ODC-A1`, `ODC-A2`, …, `Balcony-1`, `Balcony-2`, …, `Box-1`, …  
Booked seats are excluded; availability is returned per hall, movie, date, and showTime.
