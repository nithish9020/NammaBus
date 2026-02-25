# NammaBus Services

Independent microservices that can be scaled separately based on load.

## Services

| Service        | Port | Purpose                       |
| -------------- | ---- | ----------------------------- |
| **Identity**   | 3001 | OTP login, JWT authentication |
| **Mobility**   | 3002 | Routes, stops, buses CRUD     |
| **Realtime**   | 3003 | GPS tracking, live updates    |
| **Prediction** | 3004 | ETA calculation               |

## Development

### Run individual service

```bash
bun run dev:identity    # port 3001
bun run dev:mobility    # port 3002
bun run dev:realtime    # port 3003
bun run dev:prediction  # port 3004
```

### Run all services

```bash
bun run dev:all
```

### Test endpoints

```bash
# Identity service
curl http://localhost:3001/health

# Mobility service
curl http://localhost:3002/health

# Realtime service
curl http://localhost:3003/health

# Prediction service
curl http://localhost:3004/health
```

## Production

Each service can be:

- **Deployed independently** (separate containers/VMs)
- **Scaled independently** (horizontal scaling based on load)
- **Updated independently** (zero-downtime deployments)

### Example scaling strategy

- Identity: 2 instances (low traffic)
- Mobility: 2 instances (moderate traffic)
- Realtime: 5+ instances (high GPS ingestion load)
- Prediction: 3 instances (compute-intensive)

Use Docker + Kubernetes or Docker Compose with replicas for production.
