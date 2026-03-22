# Movie Hub (Frontend) + Movie Ticket System (Microservices)

## Module & group

| | |
|---|---|
| **Module** | **CTSE** — Current Trends in Software Engineering SE4010 |
| **Project** | Microservices assignment — Movie Ticket System (with Movie frontend) |

**Group members (4)**

| Name | IT Number | Email |
|------|-----------|-------|
|Dilshan S. C |IT22118318 |it22118318@my.slitt.lk |
|Madusarani K. G. L |IT22569868 |it22569868@my.sliit.lk |
|Liyanaarachchi L. A. V. U |IT22120502 |it22120502@my.sliit.lk |
|K. Rangana Malmi Nadee |IT22341204 |it22341204@my.sliit.lk |

This repository contains:

- `movie-mania-hub/`: **Frontend web app** (Vite + React + TypeScript + shadcn/ui + Tailwind).
- `movie-ticket-system/`: **Backend microservices** (Node.js + Express + MongoDB) behind an **API Gateway**.

> Note on docs mismatch: `movie-ticket-system/README.md` describes `movie-service` as Python/FastAPI and `payment-service` as Java/Spring Boot, but the **actual code + `movie-ticket-system/docker-compose.yml`** implement both as **Node/Express** services. This document follows the code/compose file.

## Repository layout

```text
Microservices_CTSE_Assignment1/
  movie-mania-hub/                 # Frontend (React)
  movie-ticket-system/             # Backend (microservices)
    docker-compose.yml             # Runs gateway + services + MongoDBs
    api-gateway/
    user-service/
    hall-service/
    movie-service/
    booking-service/
    payment-service/
    review-service/
    discount-service/
    analytics-service/
```

## High-level architecture

### Frontend

- **App**: `movie-mania-hub/`
- **Tech**: React 18 + Vite + TypeScript, component library patterns from shadcn/ui
- **Routing**: `react-router-dom`
- **HTTP**: `axios`

### Backend (microservices)

All requests should go through the **API Gateway**:

- **API Gateway** (Express): routes requests to services; also provides aggregated Swagger UI at `/docs`.
- **Services** (Express): user, hall, movie, booking, payment, review, discount, analytics
- **Datastores**: MongoDB (one DB container per service in compose)
- **Auth**: JWT (shared `JWT_SECRET` across services)

## CI/CD pipeline (GitHub Actions)

Workflows live under [`.github/workflows/`](.github/workflows/):

| Workflow | File | What it does |
|----------|------|----------------|
| **CI — build & verify** | [`ci.yml`](.github/workflows/ci.yml) | On **push** and **pull requests** to `main`: installs dependencies and builds Node.js services (API gateway, user, hall, booking, review, discount, analytics); separate jobs for **movie-service** (Python) and **payment-service** (Java) as defined in the workflow. |
| **CD — Docker images** | [`docker-publish.yml`](.github/workflows/docker-publish.yml) | On **push** to `main`: builds the multi-service Docker context under `movie-ticket-system/` and **pushes images to Docker Hub** (`docker.io`) using secrets `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, and `DOCKERHUB_NAMESPACE`. Tags: `api-gateway`, `user-service`, `hall-service`, `booking-service`, `movie-service`, `payment-service`, `review-service`, `discount-service`, `analytics-service` (each `:latest`). |
| **DevSecOps — Snyk** | [`snyk-security-scan.yml`](.github/workflows/snyk-security-scan.yml) | On **push** and **PRs** to `main`: runs **Snyk** dependency scans on selected Node services and the Java payment service (requires `SNYK_TOKEN` in repo secrets). |

> **Note:** The root README describes the **running** stack as Node/Express for movie and payment services; the CI workflow still includes Python/Java jobs — align the workflow with the codebase if those jobs are no longer needed.

## AWS ECR (container registry)

For AWS deployments (e.g. **ECS**, **EKS**, **App Runner**), images are typically stored in **Amazon Elastic Container Registry (ECR)** instead of or in addition to Docker Hub.

| Item | Example / pattern |
|------|-------------------|
| **Registry URL** | `<aws-account-id>.dkr.ecr.<region>.amazonaws.com` |
| **Example region** | `ap-southeast-1` (update to your region) |
| **Repositories** | One repository per service image, e.g. `api-gateway`, `user-service`, `hall-service`, `booking-service`, `movie-service`, `payment-service`, `review-service`, `discount-service`, `analytics-service` |
| **Full image reference** | `<account-id>.dkr.ecr.<region>.amazonaws.com/<repo-name>:<tag>` (e.g. `:latest` or a Git SHA) |

**Typical setup**

- Create ECR repositories (or a naming prefix) matching each microservice image name.
- Authenticate CI to ECR with **IAM** (access keys in GitHub secrets) or **OIDC** (recommended: GitHub → AWS role, then `aws ecr get-login-password`).
- Push the same Dockerfiles used locally / in compose; task definitions in ECS reference the ECR URIs above.

The repository’s **CD** workflow currently targets **Docker Hub**; to use ECR, add a job (or replace the push step) that logs in to ECR and tags/pushes images to the URIs in this table.

## Services and ports (from `movie-ticket-system/docker-compose.yml`)

| Component | Container | Host Port | Purpose |
|---|---:|---:|---|
| API Gateway | `api-gateway` | 5001 | Single entrypoint + Swagger aggregation |
| User Service | `user-service` | 3001 | Users, auth, roles |
| Hall Service | `hall-service` | 3005 | Halls, seat blocks / layouts |
| Movie Service | `movie-service` | 8000 | Movies, showtimes, pricing |
| Booking Service | `booking-service` | 3003 | Bookings + seat availability |
| Payment Service | `payment-service` | 3004 | Payments |
| Review Service | `review-service` | 3010 | Reviews |
| Discount Service | `discount-service` | 3020 | Discounts |
| Analytics Service | `analytics-service` | 3030 | Aggregates metrics from other services |

MongoDB containers (compose): `user-mongo`, `hall-mongo`, `movie-mongo`, `booking-mongo`, `payment-mongo`, `review-mongo`, `discount-mongo`.

## Quick start (recommended): run backend with Docker Compose

From repository root:

```bash
cd movie-ticket-system
docker-compose up --build
```

### Backend URLs

- **API Gateway base URL**: `http://localhost:5001`
- **Gateway health**: `GET /` → `{ "message": "Movie Ticket API Gateway running" }`
- **Swagger UI (gateway)**: `http://localhost:5001/docs`

### Gateway routes (prefixes)

The gateway mounts proxy routes for:

- `/api/users` → user service
- `/api/halls` → hall service
- `/api/movies` → movie service
- `/api/bookings` → booking service
- `/api/payments` → payment service
- `/api/reviews` → review service
- `/api/discounts` → discount service
- `/api/analytics` → analytics service

> The exact proxy wiring lives under `movie-ticket-system/api-gateway/routes/*.proxy.js`.

## Run frontend (`movie-mania-hub/`)

In a separate terminal (from repo root):

```bash
cd movie-mania-hub
npm install
npm run dev
```

Then open the Vite URL printed in the terminal (typically `http://localhost:5173`).

## Environment variables

### API Gateway (compose)

Compose sets these for the gateway container:

- `PORT=5001`
- `USER_SERVICE=http://user-service:3001`
- `HALL_SERVICE=http://hall-service:3005`
- `MOVIE_SERVICE=http://movie-service:8000`
- `BOOKING_SERVICE=http://booking-service:3003`
- `PAYMENT_SERVICE=http://payment-service:3004`
- `REVIEW_SERVICE=http://review-service:3010`
- `DISCOUNT_SERVICE=http://discount-service:3020`
- `ANALYTICS_SERVICE=http://analytics-service:3030`

### Node services (common)

Most Node services use:

- `PORT`: service port (as in compose)
- `MONGO_URI`: Mongo connection string (compose uses `mongodb://<service>-mongo:27017/<db>`)
- `JWT_SECRET`: shared secret for JWT validation (compose uses `supersecretkey_movie_ticket_system`)

### Booking service (service-to-service calls)

Compose sets:

- `MOVIE_SERVICE_URL=http://movie-service:8000/api`
- `HALL_SERVICE_URL=http://hall-service:3005`
- `PAYMENT_SERVICE_URL=http://payment-service:3004/api`

### Analytics service (aggregations)

Compose sets:

- `REVIEW_SERVICE_URL=http://review-service:3010/api/reviews/summary/all`
- `MOVIE_SERVICE_URL=http://movie-service:8000/api/movies`
- `HALL_SERVICE_URL=http://hall-service:3005/api/halls`
- `BOOKING_SERVICE_URL=http://booking-service:3003/api/bookings`

## Authentication (JWT)

Protected endpoints expect:

```text
Authorization: Bearer <token>
```

Roles used across the system (as described in backend docs):

- `admin`
- `hall_owner`
- `customer`

## API documentation

- **Comprehensive API examples**: see `movie-ticket-system/API_DOCUMENTATION.md`
- **Gateway Swagger UI**: `http://localhost:5001/docs`
- **Movie service Swagger** (direct, if you ever hit service ports): `http://localhost:8000/docs` and `GET http://localhost:8000/docs.json`

## Development (without Docker)

If you want to run services locally (not compose), each Node service supports:

```bash
npm install
npm start
```

You must then provide correct `.env` values per service (ports, Mongo URIs, and shared `JWT_SECRET`).

## Common workflows (from provided backend docs)

- **Public browsing**: list halls + movies without login
- **Customer**: register/login → browse → check available seats → create booking → pay
- **Hall owner**: manage seat blocks/layout, movies, view/manage bookings/payments for own halls
- **Admin**: manage hall owners, halls, and overall system access

## Troubleshooting

- **Swagger UI shows errors**: ensure all services are up and reachable from the gateway (compose `depends_on` helps, but services may still be starting).
- **Auth fails between services**: confirm **the same `JWT_SECRET`** is used everywhere (compose already does this for Node services).
- **Mongo connection issues**: if running locally (no Docker), update `MONGO_URI` to a reachable Mongo instance (e.g. `mongodb://localhost:27017/...`).
