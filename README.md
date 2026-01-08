# Food Ordering POS Backend

A backend service for managing inventory in a Food Ordering POS system.  
This project focuses on clean data modeling, CRUD APIs, and audit logging at a branch level.

Built as part of an intern take home assignment to demonstrate backend fundamentals using pure Node.js and TypeScript.

## 🔗 Links

- **GitHub Repository:** [https://github.com/SooryaCodes/foodo-pos-test](https://github.com/SooryaCodes/foodo-pos-test)
- **Live Deployment:** [https://foodo-pos-test.onrender.com](https://foodo-pos-test.onrender.com)
- **API Documentation:** [https://foodo-pos-test.onrender.com/docs](https://foodo-pos-test.onrender.com/docs)

---

## Problem Overview

The system manages inventory at a branch level with the following hierarchy:

```
Store
  → Branch
    → Item
      → Variant
```

Each item can have multiple variants, and every update to an item or variant is tracked using an audit logging mechanism.

---

## Tech Stack

- **Node.js** using native HTTP module (no Express)
- **TypeScript** with strict type checking
- **MongoDB Atlas** for database
- **Swagger** for API documentation
- **Docker** and Docker Compose for containerization

No frameworks such as Express are used to demonstrate core HTTP handling.

---

## Core Features

### Items
- Create items under a branch
- Update item details (name, category, brand, product code)

### Variants
- Create variants under an item
- Update pricing, quantity, and dynamic properties
- Support flexible key-value properties

### Audit Logging
- Every update creates exactly one audit log entry
- Logs include user, field changed, old value, new value, and timestamp
- Logs are stored permanently for history tracking

### Activity Feed
- Audit logs are displayed in reverse chronological order
- No grouping applied as per requirements

---

## Bonus Features Implemented

- **Soft delete variants** without removing data
- **View complete history** of a variant using audit logs
- **Filter audit logs by item** including all its variants

---

## API Documentation

Swagger UI is available for exploring and testing all APIs.

**Live API Documentation:** [https://foodo-pos-test.onrender.com/docs](https://foodo-pos-test.onrender.com/docs)

For local development, after starting the server, open:

**http://localhost:3000/docs**

Swagger is used as the primary way to test endpoints instead of Postman.

---

## Project Setup

### Prerequisites
- Node.js (LTS version recommended)
- Docker and Docker Compose
- MongoDB Atlas account

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/foodo_pos?retryWrites=true&w=majority
```

**Note:** If your password contains special characters, URL encode them (e.g., `@` becomes `%40`).

### Run Using Docker

```bash
docker compose up --build
```

The server will start on port 3000.

### Run Locally Without Docker

```bash
npm install
npm run dev
```

The server will start on port 3000.

---

## API Testing Flow

Recommended testing order using Swagger:

1. Create an item
2. Update the item
3. Create a variant under the item
4. Update variant pricing or properties
5. Soft delete a variant
6. View audit logs
7. Filter audit logs by item or variant

This flow ensures all core and bonus features are covered.

---

## API Endpoints

### Items
- `POST /item` - Create a new item
- `PUT /item/{id}` - Update an existing item

### Variants
- `POST /variants` - Create a new variant
- `PUT /variants/{id}` - Update an existing variant
- `DELETE /variants/{id}` - Soft delete a variant

### Audit Logs
- `GET /audit-logs` - Get all audit logs
- `GET /audit-logs?itemId={id}` - Get logs for an item and all its variants
- `GET /audit-logs?variantId={id}` - Get logs for a specific variant

---

## Database Structure

### Collections Used
- `items` - Stores item information
- `variants` - Stores variant information with reference to items
- `audit_logs` - Stores all audit trail entries

### Relationships
- Variants reference items using `itemId`
- Audit logs reference items or variants using `entityType` and `entityId`

---

## Screenshots

### MongoDB Atlas Collections

![Items Collection](screenshots/items-collection.png)

![Variants Collection](screenshots/variants-collection.png)

![Audit Logs Overview](screenshots/audit-logs-overview.png)

![Audit Logs Detailed](screenshots/audit-logs-detailed.png)

---

## Assumptions

- Store management is out of scope
- Authentication is not implemented and user is treated as a static "system" value
- Product code uniqueness is assumed per branch
- Variant properties are replaced during update for simplicity
- Performance optimizations are not required for this assignment
- MongoDB connection is established once at server startup

---

## Project Structure

```
src/
├── controllers/       # Request handlers
│   ├── item.controller.ts
│   ├── variant.controller.ts
│   ├── audit.controller.ts
│   └── swagger.controller.ts
├── db/               # Database connection
│   └── mongo.ts
├── types/            # TypeScript type definitions
│   ├── item.ts
│   ├── variant.ts
│   └── audit.ts
├── utils/            # Utility functions
│   ├── bodyParser.ts
│   └── response.ts
├── router.ts         # Request routing
├── server.ts         # HTTP server setup
└── swagger.ts         # Swagger configuration
```

---


## Notes

This project intentionally avoids heavy abstractions to focus on backend fundamentals such as:
- HTTP request/response handling
- Data modeling and relationships
- Audit trail safety
- API documentation
- Type safety with TypeScript

---

## Author

Built by [Soorya Krishna](https://sooryaa.me/)

---

## License

ISC

