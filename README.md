# 🛒 EcommerceDeliveryPlus

EcommerceDeliveryPlus is a multi-tenant inventory, order, and delivery management platform designed for shops, warehouses, wholesalers, retailers, and e-commerce businesses.

The platform helps businesses manage products, inventory across multiple warehouses, orders, invoices, users, and delivery operations through a centralized system.

## ✨ Features

- 🔐 User authentication and JWT-based authorization
- 👥 Role-based access control (RBAC)
- 🏢 Multi-tenant / company-based architecture
- 📦 Product and product variant management
- 🏭 Multi-warehouse inventory management
- 📊 Stock management and inventory movements
- 🔄 Stock reservation, release, transfer, and confirmation
- 🛒 Order management
- 🧾 Invoice management
- 🚚 Delivery management
- 👤 Customer and user management
- 🔑 Role and permission management
- 🐳 Dockerized API and database
- 🗃️ Sequelize database migrations
- 📡 REST API
- 🖥️ React Admin dashboard

## 🏗️ Architecture

The application follows a layered architecture with a clear separation between the Admin application, API, business logic, and database.

```text
                         User
                          │
                          ▼
                ┌─────────────────┐
                │   React Admin   │
                │   :5173         │
                └────────┬────────┘
                         │
                         │ HTTP / REST API
                         ▼
                ┌─────────────────┐
                │   Express API   │
                │   :4000         │
                └────────┬────────┘
                         │
                         │ Sequelize
                         ▼
                ┌─────────────────┐
                │     MariaDB     │
                │   :3306 Docker  │
                └─────────────────┘
```

### Application Flow

```text
Admin
  ↓
API
  ↓
Authentication
  ↓
Authorization
  ↓
Controller
  ↓
Use Case
  ↓
Domain / Business Rules
  ↓
Repository
  ↓
MariaDB
```

The Admin application communicates with the API and does not connect directly to the database.

## 🗂️ Database ERD

The following diagram represents the main database structure:

![Database ERD](diagrams/Diagramecommercedelevry.drawio.png)

### 🗃️ Main Database Entities

The application currently contains several core entities:

```text
Users
Companies
Products
Variants
Categories
Warehouses
Inventories
InventoryMovements
Orders
OrderItems
Invoices
Customers
```

### Inventory Structure

```text
Inventories
├── id
├── variantId
├── warehouseId
├── quantity
├── reserved
└── companyId
```

Available stock is calculated as:

```text
available = quantity - reserved
```

## 🛠️ Tech Stack

### Backend

- Node.js
- TypeScript
- Express.js
- Sequelize ORM
- REST API
- JWT Authentication
- Object-Oriented Programming (OOP)
- Clean Architecture principles
- Domain-Driven Design (DDD) concepts

### Database

- MariaDB
- SQL
- Sequelize CLI
- Database migrations

### Admin

- React
- React Admin
- Material UI

### DevOps

- Docker
- Docker Compose
- Git
- GitHub

## 📁 Project Structure

```text
ecommercedelevry/
│
├── api/
│   ├── src/
│   │   ├── controllers/
│   │   ├── domains/
│   │   ├── repositories/
│   │   ├── useCases/
│   │   ├── routes/
│   │   └── ...
│   │
│   ├── migrations/
│   ├── models/
│   ├── config/
│   ├── Dockerfile
│   └── package.json
│
├── admin/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── diagrams/
│   └── Diagramecommercedelevry.drawio.png
│
├── docker-compose.yml
├── .env.docker
└── README.md
```

## 🐳 Docker

The project uses Docker Compose to run the backend API and MariaDB database.

### Services

```text
api
mariadb
```

### Ports

| Service | Host Port | Container Port |
|---------|-----------|-----------------|
| API     | 4000      | 4000            |
| MariaDB | 3308      | 3306            |

### API

From the Host:

```text
http://localhost:4000
```

API base path:

```text
http://localhost:4000/api
```

### MariaDB

From the Host:

```text
127.0.0.1:3308
```

From the API container:

```text
mariadb:3306
```

## ⚙️ Environment Variables

Docker uses the following database configuration:

```env
DB_HOST=mariadb
DB_NAME=ecommercedelevry
DB_PASSWORD=rootpassword
DB_PORT=3306
DB_USER=root
```

### Important

Inside the API container:

```env
DB_HOST=mariadb
DB_PORT=3306
```

The API should **not** use:

```env
DB_HOST=localhost
```

to connect to MariaDB inside Docker.

## 🚀 Getting Started

### Requirements

Make sure you have installed:

- Node.js
- npm
- Docker
- Docker Compose

Check your versions:

```bash
node --version
npm --version
docker --version
docker compose version
```

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommercedelevry
```

### 2. Start Docker

From the project root:

```bash
docker compose up -d
```

Check the containers:

```bash
docker compose ps
```

Expected services:

```text
ecommerce-api
ecommerce-mariadb
```

## 🔌 API

View API logs:

```bash
docker compose logs -f api
```

The API should be available at:

```text
http://localhost:4000
```

API routes:

```text
http://localhost:4000/api
```

You can test the API with:

- Postman
- curl
- Browser
- React Admin

Example:

```bash
curl http://localhost:4000/api
```

## 🗄️ Database

### Access MariaDB from Docker

```bash
docker exec -it ecommerce-mariadb mariadb -u root -p
```

Enter the configured password:

```text
rootpassword
```

Select the database:

```sql
USE ecommercedelevry;
```

Show tables:

```sql
SHOW TABLES;
```

Example:

```sql
SELECT * FROM Users;
```

### Access MariaDB from the Host

If the MariaDB client is installed:

```bash
mariadb -h 127.0.0.1 -P 3308 -u root -p
```

Then:

```sql
USE ecommercedelevry;
```

## 🔄 Sequelize Migrations

Check migration status:

```bash
docker compose exec api npx sequelize-cli db:migrate:status
```

Run pending migrations:

```bash
docker compose exec api npx sequelize-cli db:migrate
```

Migration configuration:

```text
api/config/config-cli.cjs
```

The project loads environment variables for Sequelize CLI using:

```js
const dotenv = require("dotenv");
dotenv.config();
```

## 🖥️ Admin Dashboard

The Admin application is located in:

```text
admin/
```

Install dependencies:

```bash
cd admin
npm install
```

Start the development server:

```bash
npm run dev
```

The Admin application is normally available at:

```text
http://localhost:5173
```

The Admin communicates with:

```text
http://localhost:4000/api
```

## 🔐 Authentication & Authorization

The API uses JWT-based authentication.

### Authentication flow

```text
Admin
  │
  │ Login
  ▼
API
  │
  │ Validate credentials
  ▼
JWT
  │
  ▼
Admin
  │
  │ Authorization: Bearer <token>
  ▼
Protected API
```

Example:

```http
Authorization: Bearer <access_token>
```

## 👥 Roles

The application supports role-based access control.

Current roles include:

```text
SUPERADMIN
ADMIN
OWNER
USER
SUPPLIER
DELIVERER
SECRTRIE
```

The authorization model is designed around:

```text
Role
  ↓
Permission
  ↓
Scope
  ↓
Resource Policy
  ↓
Business Rule
```

The multi-tenant structure separates companies and their operational data using `companyId`.

## 📦 Inventory Management

Inventory is managed per:

```text
Company
   ↓
Warehouse
   ↓
Product Variant
   ↓
Inventory
```

Stock operations include:

```text
Add Stock
Reserve Stock
Release Reservation
Confirm Sale
Transfer Stock
Adjust Stock
```

Inventory movements are tracked through:

```text
InventoryMovements
```

## 🛒 Order Flow

The general order flow is:

```text
Customer
   ↓
Order
   ↓
Stock Check
   ↓
Reserve Stock
   ↓
Invoice
   ↓
Payment
   ↓
Confirm Sale
   ↓
Inventory Movement
```

## 🧪 Testing

Recommended testing flow:

```text
1. Start Docker
       ↓
2. Verify MariaDB
       ↓
3. Verify API
       ↓
4. Start Admin
       ↓
5. Login
       ↓
6. Test API requests
       ↓
7. Create / update data
       ↓
8. Verify data in MariaDB
```

Check Docker:

```bash
docker compose ps
```

Check API:

```bash
docker compose logs -f api
```

Check Database:

```bash
docker exec -it ecommerce-mariadb mariadb -u root -p
```

Check Admin:

```bash
cd admin
npm run dev
```

## 🐙 Git Workflow

Check the current status:

```bash
git status
```

Check changes:

```bash
git diff
```

Stage changes:

```bash
git add .
```

Review staged changes:

```bash
git diff --cached
```

Check for whitespace errors:

```bash
git diff --check
```

Commit:

```bash
git commit -m "your commit message"
```

View the latest commit:

```bash
git log -1 --oneline
```

## 🛑 Stop the Project

Stop containers:

```bash
docker compose stop
```

Remove containers:

```bash
docker compose down
```

Avoid `docker compose down -v` unless you intentionally want to remove the Docker volumes and database data.

## 🔧 Useful Docker Commands

List containers:

```bash
docker compose ps
```

API logs:

```bash
docker compose logs -f api
```

MariaDB logs:

```bash
docker compose logs -f mariadb
```

Restart API:

```bash
docker compose restart api
```

Restart MariaDB:

```bash
docker compose restart mariadb
```

Open API container:

```bash
docker exec -it ecommerce-api sh
```

Open MariaDB container:

```bash
docker exec -it ecommerce-mariadb sh
```

## 🔗 System Architecture

```text
                         USER
                          │
                          ▼
                ┌─────────────────┐
                │   React Admin   │
                │   localhost:5173│
                └────────┬────────┘
                         │
                         │ HTTP / JWT
                         ▼
                ┌─────────────────┐
                │   Express API   │
                │   localhost:4000│
                └────────┬────────┘
                         │
                         │ Sequelize
                         ▼
                ┌─────────────────┐
                │     MariaDB     │
                │   mariadb:3306  │
                └────────┬────────┘
                         │
                         ▼
                    Docker Volume
                    mariadb_data
```

### Core Principle

```text
React Admin
     ↓
REST API
     ↓
Business Logic
     ↓
Repository
     ↓
MariaDB
```

The frontend/Admin application never connects directly to the database.

## 📌 Project Status

EcommerceDeliveryPlus is under active development, with ongoing work around:

- Multi-tenant architecture
- Inventory management
- Order and invoice workflows
- RBAC and authorization
- SuperAdmin / Platform Access
- Docker environment
- API and Admin integration
- Testing and validation with real business workflows
