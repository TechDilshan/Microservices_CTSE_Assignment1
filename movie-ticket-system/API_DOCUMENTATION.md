# Movie Hub - Full API Documentation

**Base URL:** `http://localhost:5001`

All API requests go through the API Gateway on port **5001**. Include `Authorization: Bearer <token>` header for protected endpoints.

---

## Authentication

After login/register, store the JWT `token` and send it with every protected request:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. User Service (`/api/users`)

### 1.1 Register (Customer self-registration)
**POST** `/api/users/register`  
**Auth:** None

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0771234567"
}
```

**Sample Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0771234567",
    "role": "customer",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 1.2 Login
**POST** `/api/users/login`  
**Auth:** None

**Request Body:**
```json
{
  "email": "admin@movieticket.com",
  "password": "admin123"
}
```

**Sample Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin",
    "email": "admin@movieticket.com",
    "phone": "",
    "role": "admin",
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
}
```

---

### 1.3 Get Profile
**GET** `/api/users/profile`  
**Auth:** Required (Bearer token)

**Sample Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0771234567",
  "role": "customer",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 1.4 Update Profile
**PUT** `/api/users/profile`  
**Auth:** Required

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "0779876543"
}
```

**Sample Response (200):**
```json
{
  "message": "Profile updated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "0779876543",
    "role": "customer",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 1.5 Delete Profile
**DELETE** `/api/users/profile`  
**Auth:** Required

**Sample Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

### 1.6 Get All Users (Admin: all | Hall Owner: customers only)
**GET** `/api/users`  
**Auth:** Required (Admin or Hall Owner)

**Sample Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0771234567",
    "role": "customer",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 1.7 Get Hall Owners (Admin only)
**GET** `/api/users/hall-owners`  
**Auth:** Required (Admin)

**Sample Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Hall Owner Name",
    "email": "owner@example.com",
    "phone": "0771111111",
    "role": "hall_owner",
    "createdAt": "2024-01-12T09:00:00.000Z"
  }
]
```

---

### 1.8 Create Hall Owner (Admin only)
**POST** `/api/users/hall-owners`  
**Auth:** Required (Admin)

**Request Body:**
```json
{
  "name": "Hall Owner Name",
  "email": "owner@example.com",
  "password": "owner123",
  "phone": "0771111111"
}
```

**Sample Response (201):**
```json
{
  "message": "Hall owner created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Hall Owner Name",
    "email": "owner@example.com",
    "phone": "0771111111",
    "role": "hall_owner",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 1.9 Get User by ID
**GET** `/api/users/:id`  
**Auth:** Required (Admin or Hall Owner)

**Sample Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0771234567",
  "role": "customer",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 1.10 Update User by ID
**PUT** `/api/users/:id`  
**Auth:** Required (Admin or Hall Owner)

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "0772222222"
}
```

**Sample Response (200):**
```json
{
  "message": "User updated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Updated Name",
    "email": "john@example.com",
    "phone": "0772222222",
    "role": "customer",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 1.11 Delete User by ID
**DELETE** `/api/users/:id`  
**Auth:** Required (Admin or Hall Owner)

**Sample Response (200):**
```json
{
  "message": "User deleted"
}
```

---

## 2. Hall Service (`/api/halls`)

### 2.1 Create Hall (Admin only)
**POST** `/api/halls`  
**Auth:** Required (Admin)

**Request Body:**
```json
{
  "hallOwnerId": "507f1f77bcf86cd799439012",
  "name": "Main Hall",
  "location": "Colombo",
  "hallImageUrl": "https://example.com/hall.jpg"
}
```

**Sample Response (201):**
```json
{
  "message": "Hall created",
  "hall": {
    "_id": "507f1f77bcf86cd799439013",
    "hallOwnerId": "507f1f77bcf86cd799439012",
    "name": "Main Hall",
    "location": "Colombo",
    "hallImageUrl": "https://example.com/hall.jpg",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### 2.2 Get All Halls
**GET** `/api/halls`  
**Auth:** Optional (Public; returns filtered list if Hall Owner is logged in)

**Sample Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "hallOwnerId": "507f1f77bcf86cd799439012",
    "name": "Main Hall",
    "location": "Colombo",
    "hallImageUrl": "https://example.com/hall.jpg",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
]
```

---

### 2.3 Get Halls by Owner (Admin only)
**GET** `/api/halls/owner/:ownerId`  
**Auth:** Required (Admin)

**Sample Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "hallOwnerId": "507f1f77bcf86cd799439012",
    "name": "Main Hall",
    "location": "Colombo",
    "hallImageUrl": "https://example.com/hall.jpg",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
]
```

---

### 2.4 Get Hall by ID
**GET** `/api/halls/:id`  
**Auth:** None (Public)

**Sample Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "hallOwnerId": "507f1f77bcf86cd799439012",
  "name": "Main Hall",
  "location": "Colombo",
  "hallImageUrl": "https://example.com/hall.jpg",
  "createdAt": "2024-01-15T12:00:00.000Z"
}
```

---

### 2.5 Update Hall
**PUT** `/api/halls/:id`  
**Auth:** Required (Admin or Hall Owner - own halls only)

**Request Body:**
```json
{
  "name": "Updated Hall Name",
  "location": "Kandy",
  "hallImageUrl": "https://example.com/new-hall.jpg"
}
```

**Sample Response (200):**
```json
{
  "message": "Hall updated",
  "hall": {
    "_id": "507f1f77bcf86cd799439013",
    "hallOwnerId": "507f1f77bcf86cd799439012",
    "name": "Updated Hall Name",
    "location": "Kandy",
    "hallImageUrl": "https://example.com/new-hall.jpg",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### 2.6 Delete Hall
**DELETE** `/api/halls/:id`  
**Auth:** Required (Admin or Hall Owner - own halls only)

**Sample Response (200):**
```json
{
  "message": "Hall deleted"
}
```

---

### 2.7 Get Seat Block (Public)
**GET** `/api/halls/:hallId/seat-block`  
**Auth:** None

**Sample Response (200):**
```json
{
  "seatBlock": {
    "_id": "507f1f77bcf86cd799439014",
    "hallId": "507f1f77bcf86cd799439013",
    "numSeats": {
      "ODC": 30,
      "Balcony": 4,
      "Box": 5
    },
    "odc": {
      "rows": 10,
      "columns": 4
    },
    "createdAt": "2024-01-15T13:00:00.000Z"
  },
  "layout": {
    "ODC": [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]],
    "Balcony": ["Balcony-1", "Balcony-2", "Balcony-3", "Balcony-4"],
    "Box": ["Box-1", "Box-2", "Box-3", "Box-4", "Box-5"]
  },
  "allSeats": ["ODC-A1", "ODC-A2", "ODC-B1", "Balcony-1", "Balcony-2", "Box-1"]
}
```

---

### 2.8 Get Seat Layout (Public)
**GET** `/api/halls/:hallId/seat-layout`  
**Auth:** None

**Sample Response (200):**
```json
{
  "layout": {
    "ODC": [["A1", "A2", "A3", "A4"], ["B1", "B2", "B3", "B4"]],
    "Balcony": ["Balcony-1", "Balcony-2", "Balcony-3", "Balcony-4"],
    "Box": ["Box-1", "Box-2", "Box-3", "Box-4", "Box-5"]
  }
}
```

---

### 2.9 Create/Update Seat Block (Hall Owner)
**PUT** `/api/halls/:hallId/seat-block`  
**Auth:** Required (Hall Owner - own halls only)

**Request Body:**
```json
{
  "numSeats": {
    "ODC": 30,
    "Balcony": 4,
    "Box": 5
  },
  "odc": {
    "rows": 10,
    "columns": 4
  }
}
```

**Sample Response (200):**
```json
{
  "message": "Seat block saved",
  "seatBlock": {
    "_id": "507f1f77bcf86cd799439014",
    "hallId": "507f1f77bcf86cd799439013",
    "numSeats": { "ODC": 30, "Balcony": 4, "Box": 5 },
    "odc": { "rows": 10, "columns": 4 },
    "createdAt": "2024-01-15T13:00:00.000Z"
  },
  "layout": {
    "ODC": [["A1", "A2", "A3", "A4"]],
    "Balcony": ["Balcony-1", "Balcony-2", "Balcony-3", "Balcony-4"],
    "Box": ["Box-1", "Box-2", "Box-3", "Box-4", "Box-5"]
  },
  "allSeats": ["ODC-A1", "ODC-A2", "Balcony-1", "Box-1"]
}
```

---

## 3. Movie Service (`/api/movies`)

### 3.1 Create Movie
**POST** `/api/movies`  
**Auth:** Required (Hall Owner or Admin)

**Request Body:**
```json
{
  "hallId": "507f1f77bcf86cd799439013",
  "name": "Avengers Endgame",
  "startDate": "2024-02-01",
  "endDate": "2024-02-28",
  "duration": 180,
  "language": "English",
  "genre": "Action",
  "movieImageUrl": "https://example.com/movie.jpg",
  "showTime": ["10:00", "14:00", "18:00"],
  "price": {
    "ODC_Full": 500,
    "ODC_Half": 300,
    "Balcony": 800,
    "Box": 1000
  }
}
```

**Sample Response (200):**
```json
{
  "movie_id": "507f1f77bcf86cd799439015"
}
```

---

### 3.2 Get All Movies
**GET** `/api/movies`  
**Query:** `?hallId=507f1f77bcf86cd799439013` (optional)  
**Auth:** None (Public)

**Sample Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "hallId": "507f1f77bcf86cd799439013",
    "name": "Avengers Endgame",
    "startDate": "2024-02-01T00:00:00.000Z",
    "endDate": "2024-02-28T00:00:00.000Z",
    "duration": 180,
    "language": "English",
    "genre": "Action",
    "movieImageUrl": "https://example.com/movie.jpg",
    "showTime": ["10:00", "14:00", "18:00"],
    "price": {
      "ODC_Full": 500,
      "ODC_Half": 300,
      "Balcony": 800,
      "Box": 1000
    },
    "createdAt": "2024-01-15T14:00:00.000Z"
  }
]
```

---

### 3.3 Get Movie by ID
**GET** `/api/movies/:id`  
**Auth:** None (Public)

**Sample Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "hallId": "507f1f77bcf86cd799439013",
  "name": "Avengers Endgame",
  "startDate": "2024-02-01T00:00:00.000Z",
  "endDate": "2024-02-28T00:00:00.000Z",
  "duration": 180,
  "language": "English",
  "genre": "Action",
  "movieImageUrl": "https://example.com/movie.jpg",
  "showTime": ["10:00", "14:00", "18:00"],
  "price": {
    "ODC_Full": 500,
    "ODC_Half": 300,
    "Balcony": 800,
    "Box": 1000
  },
  "createdAt": "2024-01-15T14:00:00.000Z"
}
```

---

### 3.4 Update Movie
**PUT** `/api/movies/:id`  
**Auth:** Required (Hall Owner or Admin)

**Request Body (all fields optional):**
```json
{
  "name": "Avengers Endgame (Updated)",
  "showTime": ["10:00", "14:00", "18:00", "21:00"],
  "price": {
    "ODC_Full": 550,
    "ODC_Half": 350,
    "Balcony": 850,
    "Box": 1100
  }
}
```

**Sample Response (200):**
```json
{
  "message": "Movie updated"
}
```

---

### 3.5 Delete Movie
**DELETE** `/api/movies/:id`  
**Auth:** Required (Hall Owner or Admin)

**Sample Response (200):**
```json
{
  "message": "Movie deleted"
}
```

---

## 4. Booking Service (`/api/bookings`)

### 4.1 Create Booking
**POST** `/api/bookings`  
**Auth:** Required (Customer)

**Request Body:**
```json
{
  "hallId": "507f1f77bcf86cd799439013",
  "movieId": "507f1f77bcf86cd799439015",
  "showTime": "14:00",
  "date": "2024-02-15",
  "seats": ["ODC-A1", "ODC-A2", "ODC-A3"]
}
```

**Sample Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "userId": "507f1f77bcf86cd799439011",
  "hallId": "507f1f77bcf86cd799439013",
  "movieId": "507f1f77bcf86cd799439015",
  "showTime": "14:00",
  "date": "2024-02-15T00:00:00.000Z",
  "seats": ["ODC-A1", "ODC-A2", "ODC-A3"],
  "status": "pending",
  "paymentStatus": "pending",
  "createdAt": "2024-01-15T15:00:00.000Z"
}
```

---

### 4.2 Get Available Seats
**GET** `/api/bookings/available-seats?hallId=507f1f77bcf86cd799439013&movieId=507f1f77bcf86cd799439015&date=2024-02-15&showTime=14:00`  
**Auth:** None (Public)

**Sample Response (200):**
```json
{
  "layout": {
    "ODC": [["A1", "A2", "A3", "A4"]],
    "Balcony": ["Balcony-1", "Balcony-2", "Balcony-3", "Balcony-4"],
    "Box": ["Box-1", "Box-2", "Box-3", "Box-4", "Box-5"]
  },
  "allSeats": ["ODC-A1", "ODC-A2", "ODC-A3", "Balcony-1", "Box-1"],
  "availableSeats": ["ODC-A3", "ODC-A4", "Balcony-1", "Balcony-2", "Box-1"],
  "bookedSeats": ["ODC-A1", "ODC-A2"]
}
```

---

### 4.3 Get User Bookings (Customer)
**GET** `/api/bookings/user`  
**Auth:** Required (Customer)

**Sample Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439011",
    "hallId": "507f1f77bcf86cd799439013",
    "movieId": "507f1f77bcf86cd799439015",
    "showTime": "14:00",
    "date": "2024-02-15T00:00:00.000Z",
    "seats": ["ODC-A1", "ODC-A2", "ODC-A3"],
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2024-01-15T15:00:00.000Z"
  }
]
```

---

### 4.4 Get All Bookings (Hall Owner / Admin)
**GET** `/api/bookings`  
**Auth:** Required (Hall Owner or Admin; Hall Owner sees only their halls)

**Sample Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439011",
    "hallId": "507f1f77bcf86cd799439013",
    "movieId": "507f1f77bcf86cd799439015",
    "showTime": "14:00",
    "date": "2024-02-15T00:00:00.000Z",
    "seats": ["ODC-A1", "ODC-A2", "ODC-A3"],
    "status": "confirmed",
    "paymentStatus": "paid",
    "createdAt": "2024-01-15T15:00:00.000Z"
  }
]
```

---

### 4.5 Get Payments for My Bookings (Hall Owner / Admin)
**GET** `/api/bookings/payments`  
**Auth:** Required (Hall Owner or Admin)

**Sample Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439017",
    "bookingId": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 1500,
    "method": "card",
    "status": "SUCCESS"
  }
]
```

---

### 4.6 Pay for Booking (Customer)
**POST** `/api/bookings/:id/pay`  
**Auth:** Required (Customer - own booking only)

**Request Body:**
```json
{
  "amount": 1500,
  "method": "card"
}
```

**Sample Response (200):**
```json
{
  "message": "Payment successful",
  "payment": {
    "id": "507f1f77bcf86cd799439017",
    "bookingId": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 1500,
    "method": "card",
    "status": "SUCCESS"
  },
  "booking": {
    "_id": "507f1f77bcf86cd799439016",
    "status": "confirmed",
    "paymentStatus": "paid"
  }
}
```

---

### 4.7 Update Payment Status (Hall Owner / Admin)
**PUT** `/api/bookings/payments/:paymentId/status`  
**Auth:** Required (Hall Owner or Admin)

**Request Body:**
```json
{
  "status": "SUCCESS"
}
```

**Sample Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439017",
  "bookingId": "507f1f77bcf86cd799439016",
  "userId": "507f1f77bcf86cd799439011",
  "amount": 1500,
  "method": "card",
  "status": "SUCCESS"
}
```

---

### 4.8 Delete Payment (Hall Owner / Admin)
**DELETE** `/api/bookings/payments/:paymentId`  
**Auth:** Required (Hall Owner or Admin)

**Sample Response (200):**
```json
{
  "message": "Payment deleted"
}
```

---

### 4.9 Get Booking by ID
**GET** `/api/bookings/:id`  
**Auth:** Required (Customer: own only | Hall Owner: own halls | Admin: any)

**Sample Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "userId": "507f1f77bcf86cd799439011",
  "hallId": "507f1f77bcf86cd799439013",
  "movieId": "507f1f77bcf86cd799439015",
  "showTime": "14:00",
  "date": "2024-02-15T00:00:00.000Z",
  "seats": ["ODC-A1", "ODC-A2", "ODC-A3"],
  "status": "confirmed",
  "paymentStatus": "paid",
  "createdAt": "2024-01-15T15:00:00.000Z"
}
```

---

### 4.10 Update Booking
**PUT** `/api/bookings/:id`  
**Auth:** Required (Hall Owner or Admin)

**Request Body:**
```json
{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

**Sample Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "userId": "507f1f77bcf86cd799439011",
  "hallId": "507f1f77bcf86cd799439013",
  "movieId": "507f1f77bcf86cd799439015",
  "showTime": "14:00",
  "date": "2024-02-15T00:00:00.000Z",
  "seats": ["ODC-A1", "ODC-A2", "ODC-A3"],
  "status": "confirmed",
  "paymentStatus": "paid",
  "createdAt": "2024-01-15T15:00:00.000Z"
}
```

---

### 4.11 Delete Booking
**DELETE** `/api/bookings/:id`  
**Auth:** Required (Hall Owner or Admin)

**Sample Response (200):**
```json
{
  "message": "Booking deleted"
}
```

---

## 5. Payment Service (`/api/payments`)

*Note: For frontend, prefer booking endpoints above for payment creation and management. Direct Payment API is also available.*

### 5.1 Create Payment (Direct)
**POST** `/api/payments`  
**Auth:** Required

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439016",
  "userId": "507f1f77bcf86cd799439011",
  "amount": 1500,
  "method": "card"
}
```

**Sample Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439017",
  "bookingId": "507f1f77bcf86cd799439016",
  "userId": "507f1f77bcf86cd799439011",
  "amount": 1500,
  "method": "card",
  "status": "SUCCESS"
}
```

---

### 5.2 Get All Payments
**GET** `/api/payments`  
**Auth:** Required

**Sample Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439017",
    "bookingId": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 1500,
    "method": "card",
    "status": "SUCCESS"
  }
]
```

---

### 5.3 Get Payment by ID
**GET** `/api/payments/:id`  
**Auth:** Required

**Sample Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439017",
  "bookingId": "507f1f77bcf86cd799439016",
  "userId": "507f1f77bcf86cd799439011",
  "amount": 1500,
  "method": "card",
  "status": "SUCCESS"
}
```

---

### 5.4 Get Payments by Booking ID
**GET** `/api/payments/booking/:bookingId`  
**Auth:** Required

**Sample Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439017",
    "bookingId": "507f1f77bcf86cd799439016",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 1500,
    "method": "card",
    "status": "SUCCESS"
  }
]
```

---

### 5.5 Update Payment Status
**PUT** `/api/payments/:id/status?status=SUCCESS`  
**Auth:** Required

**Sample Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439017",
  "bookingId": "507f1f77bcf86cd799439016",
  "userId": "507f1f77bcf86cd799439011",
  "amount": 1500,
  "method": "card",
  "status": "SUCCESS"
}
```

---

### 5.6 Delete Payment
**DELETE** `/api/payments/:id`  
**Auth:** Required

**Sample Response (204):** No body

---

## Lovable AI Setup

**API Base URL:**
```
http://localhost:5001
```

**Auth Header (for protected routes):**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Typical Flow:**
1. **Login:** `POST /api/users/login` → store `token` and `user`
2. **Public data:** `GET /api/halls`, `GET /api/movies`, `GET /api/bookings/available-seats` (no auth)
3. **Protected:** Add `Authorization: Bearer ${token}` to all other requests

**Role-based access:**
- `admin` – Full access
- `hall_owner` – Own halls, movies, bookings, payments
- `customer` – Own profile, bookings, payments
