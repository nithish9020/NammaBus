# NammaBus API Guide for Frontend Developers

This guide provides a comprehensive overview of the NammaBus backend API endpoints. It is designed to help frontend developers understand how to interact with the API for the User Mobile App, Driver Mobile App, and the Admin Web App.

**Base URL**: `http://localhost:3000/api`

**Authentication**: All API endpoints require authentication. A session cookie is required for all requests.

---

## Common Endpoints

These endpoints are used across multiple applications.

### 1. User Login

This endpoint is used to log in a user, driver, or admin. The response will contain a session cookie that must be used for all subsequent requests.

- **Endpoint**: `POST /auth/login`
- **Usage**: User Mobile App, Driver Mobile App, Admin Web App

**Example Request (User)**

```json
{
  "email": "passenger@example.com",
  "password": "password123"
}
```

**Example Request (Driver)**

```json
{
  "email": "driver@example.com",
  "password": "password123"
}
```

**Example Request (Admin)**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Example Success Response (200 OK)**

```json
{
  "message": "Logged in successfully"
}
```

---

## Admin Web App

These endpoints are intended for use by the Admin Web App for managing the NammaBus system.

### Identity Management

#### Get All Users

- **Endpoint**: `GET /identity/users`
- **Usage**: Retrieves a list of all users.
- **Example Success Response (200 OK)**
  ```json
  [
    {
      "id": "user-uuid-1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "passenger"
    }
  ]
  ```

#### Get All Drivers

- **Endpoint**: `GET /identity/drivers`
- **Usage**: Retrieves a list of all drivers.
- **Example Success Response (200 OK)**
  ```json
  [
    {
      "id": "driver-uuid-1",
      "userId": "user-uuid-2",
      "licenseNumber": "DL12345",
      "phone": "1234567890",
      "city": "Coimbatore"
    }
  ]
  ```

#### Create Driver

- **Endpoint**: `POST /identity/drivers`
- **Usage**: Creates a new driver.
- **Example Request**
  ```json
  {
    "userId": "user-uuid-3",
    "licenseNumber": "DL54321",
    "phone": "0987654321",
    "city": "Coimbatore"
  }
  ```
- **Example Success Response (201 Created)**
  ```json
  {
    "id": "driver-uuid-2",
    "userId": "user-uuid-3",
    "licenseNumber": "DL54321",
    "phone": "0987654321",
    "city": "Coimbatore"
  }
  ```

### Mobility Management

#### Create Stop

- **Endpoint**: `POST /mobility/stops`
- **Usage**: Creates a new bus stop.
- **Example Request**
  ```json
  {
    "name": "Gandhipuram",
    "lat": "11.0183",
    "lon": "76.9717",
    "city": "Coimbatore",
    "pincode": "641012"
  }
  ```
- **Example Success Response (201 Created)**
  ```json
  {
    "id": "stop-uuid-1",
    "name": "Gandhipuram",
    "lat": "11.0183",
    "lon": "76.9717",
    "city": "Coimbatore",
    "pincode": "641012"
  }
  ```

#### Create Route

- **Endpoint**: `POST /mobility/routes`
- **Usage**: Creates a new bus route.
- **Example Request**
  ```json
  {
    "routeNumber": "1A",
    "name": "Gandhipuram to Ukkadam",
    "origin": "Gandhipuram",
    "destination": "Ukkadam",
    "city": "Coimbatore",
    "stops": [
      { "stopId": "stop-uuid-1", "sequence": 1 },
      { "stopId": "stop-uuid-2", "sequence": 2 }
    ]
  }
  ```
- **Example Success Response (201 Created)**
  ```json
  {
    "id": "route-uuid-1",
    "routeNumber": "1A",
    "name": "Gandhipuram to Ukkadam",
    "origin": "Gandhipuram",
    "destination": "Ukkadam",
    "city": "Coimbatore"
  }
  ```

#### Create Bus

- **Endpoint**: `POST /mobility/buses`
- **Usage**: Creates a new bus.
- **Example Request**
  ```json
  {
    "registrationNumber": "TN 38 AB 1234",
    "capacity": 50,
    "city": "Coimbatore"
  }
  ```
- **Example Success Response (201 Created)**
  ```json
  {
    "id": "bus-uuid-1",
    "registrationNumber": "TN 38 AB 1234",
    "capacity": 50,
    "city": "Coimbatore"
  }
  ```

### Realtime Statistics

#### Get Realtime Stats

- **Endpoint**: `GET /realtime/stats`
- **Usage**: Retrieves statistics about active WebSocket rooms and watchers.
- **Example Success Response (200 OK)**
  ```json
  {
    "totalRooms": 5,
    "totalWatchers": 12,
    "rooms": [
      { "tripId": "trip-uuid-1", "watchers": 3 },
      { "tripId": "trip-uuid-2", "watchers": 9 }
    ]
  }
  ```

---

## Driver Mobile App

These endpoints are intended for use by the Driver Mobile App.

### Trip Management

#### Create Trip

- **Endpoint**: `POST /mobility/trips`
- **Usage**: Starts a new trip.
- **Example Request**
  ```json
  {
    "busId": "bus-uuid-1",
    "routeId": "route-uuid-1",
    "driverId": "driver-uuid-1"
  }
  ```
- **Example Success Response (201 Created)**
  ```json
  {
    "id": "trip-uuid-1",
    "busId": "bus-uuid-1",
    "routeId": "route-uuid-1",
    "driverId": "driver-uuid-1",
    "status": "scheduled"
  }
  ```

#### Update Trip Status

- **Endpoint**: `PATCH /mobility/trips/:id`
- **Usage**: Updates the status of a trip (e.g., to `in_progress` or `completed`).
- **Example Request**
  ```json
  {
    "status": "in_progress"
  }
  ```
- **Example Success Response (200 OK)**
  ```json
  {
    "id": "trip-uuid-1",
    "status": "in_progress"
  }
  ```

#### Add GPS Locations

- **Endpoint**: `POST /mobility/trips/:id/locations`
- **Usage**: Sends a batch of GPS location updates for a trip.
- **Example Request**
  ```json
  {
    "locations": [
      { "lat": "11.0183", "lon": "76.9717", "speed": "45.5", "heading": "180" }
    ]
  }
  ```
- **Example Success Response (201 Created)**
  ```json
  {
    "message": "Locations added"
  }
  ```

---

## User Mobile App

These endpoints are intended for use by the User Mobile App.

### Realtime Tracking

The primary interaction for the user app is via WebSockets for real-time location updates.

#### WebSocket Connection

- **Endpoint**: `ws://localhost:3000/ws`
- **Usage**: Establishes a WebSocket connection for real-time updates. Requires a session cookie in the headers.

#### Subscribe to a Trip

- **Action**: Send a `subscribe` message over the WebSocket.
- **Usage**: Subscribes the client to real-time location updates for a specific trip.
- **Example Message**
  ```json
  {
    "type": "subscribe",
    "tripId": "trip-uuid-1"
  }
  ```
- **Server Acknowledgement**
  ```json
  {
    "type": "subscribed",
    "tripId": "trip-uuid-1"
  }
  ```

#### Receive Location Updates

- **Action**: Listen for `bus:location` messages.
- **Usage**: The server will push location updates for the subscribed trip.
- **Example Message**
  ```json
  {
    "type": "bus:location",
    "tripId": "trip-uuid-1",
    "busId": "bus-uuid-1",
    "lat": "11.0183",
    "lon": "76.9717",
    "speed": "45.5",
    "heading": "180",
    "recordedAt": "2026-03-31T10:00:00Z"
  }
  ```

#### Trip Ended Notification

- **Action**: Listen for `trip:ended` messages.
- **Usage**: The server will notify clients when a trip has ended.
- **Example Message**
  ```json
  {
    "type": "trip:ended",
    "tripId": "trip-uuid-1"
  }
  ```
