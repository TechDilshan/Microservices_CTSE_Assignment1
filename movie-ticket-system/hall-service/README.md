## Hall Service - Movie Hub

This document describes the Hall Service microservice, which is the assigned microservice for this student in the CTSE cloud/microservices assignment.

### Role in the Overall Application

The Hall Service is responsible for managing cinema halls and their seating configuration. It provides:

- CRUD operations for halls (name, location, image, owner).  
- Seat-block configuration per hall (ODC/Balcony/Box counts, rows/columns).  
- Derived seat layouts and seat lists that other services (especially Booking Service) use to compute available seats.

Other services depend on Hall Service to know:

- Which halls exist and who owns them.  
- How many seats exist in each section of a hall.  
- Which concrete seat identifiers are valid for bookings (e.g. `ODC-A1`, `Balcony-1`).

### Tech Stack

- Node.js, Express  
- MongoDB (hall and seat-block collections)  
- JWT-based authentication and role-based authorization  
- Swagger/OpenAPI for API documentation

### Key Endpoints

Base path (via API Gateway): `/api/halls`

- **Create Hall (Admin only)**  
  - `POST /api/halls`  
  - Auth: `admin` JWT  
  - Body: `{ hallOwnerId, name, location, hallImageUrl }`

- **Get All Halls (Public / filtered by role)**  
  - `GET /api/halls`  
  - Auth: optional  
  - Returns all halls; if a hall owner is logged in, returns only their halls.

- **Get Hall by ID (Public)**  
  - `GET /api/halls/:id`

- **Update / Delete Hall (Admin or Hall Owner)**  
  - `PUT /api/halls/:id`  
  - `DELETE /api/halls/:id`

- **Get Seat Block (Public)**  
  - `GET /api/halls/:hallId/seat-block`  
  - Returns seat-block configuration and generated layout.

- **Get Seat Layout (Public)**  
  - `GET /api/halls/:hallId/seat-layout`  
  - Returns only the layout structure for the hall.

- **Create/Update Seat Block (Hall Owner)**  
  - `PUT /api/halls/:hallId/seat-block`  
  - Auth: `hall_owner` for own halls.

For detailed request/response bodies, see the shared API documentation or `swagger/hall-api.yaml`.

### Integration with Other Microservices

Although the Hall Service does not initiate outbound HTTP calls, it is a critical integration point for other services:

- **Booking Service → Hall Service**  
  - Booking Service calls:
    - `GET /api/halls/:hallId/seat-block` and  
    - `GET /api/halls/:hallId/seat-layout`  
    to compute the full list of seats, as well as booked vs. available seats for a given show.
  - This satisfies the assignment requirement that this microservice participates in at least one working integration with another student’s service during the demo.

During the viva, you can demonstrate:

1. Hitting `GET /api/halls/:hallId/seat-block` on the cloud-deployed Hall Service.  
2. Then calling the Booking Service’s `GET /api/bookings/available-seats?...` endpoint, which internally retrieves data from Hall Service before responding.

### DevOps and DevSecOps

This microservice participates in the shared DevOps setup at the repository root:

- **CI Build**:  
  - `ci.yml` GitHub Actions workflow installs dependencies and builds `hall-service` on each push/PR.

- **Docker Image Build & Push**:  
  - `docker-publish.yml` builds and pushes `hall-service` image to Docker Hub alongside other microservices.

- **SAST / Dependency Security Scans**:  
  - `snyk-security-scan.yml` runs Snyk against `hall-service` dependencies using the free Snyk plan (requires `SNYK_TOKEN` secret).

### Security Measures

- **Authentication and Authorization**  
  - Uses shared JWT tokens issued by User Service.  
  - Middleware checks `Authorization: Bearer <token>` and verifies roles (`admin`, `hall_owner`) for protected routes.

- **Data Security and Least Privilege**  
  - Hall Service only has access to its own MongoDB collections.  
  - In cloud deployment, the ECS/Container Apps identity for Hall Service is restricted to just the DB and secrets it needs (see `/docs/SECURITY.md` for details).

### Cloud Deployment Overview (Per-Student View)

The Hall Service is packaged into a Docker image (`hall-service:latest`) and deployed as its own cloud workload:

- On AWS ECS Fargate (or equivalent):  
  - One ECS service with tasks running the Hall Service container.  
  - Environment variables are provided from Parameter Store/Secrets Manager (DB URI, JWT secret, etc.).  
  - Service is reachable internally by other microservices and, via API Gateway, from the internet.

See `/docs/DEPLOYMENT.md` for a step-by-step deployment guide based on AWS ECS Fargate.

