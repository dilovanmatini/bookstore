# Bookstore

A bookstore application backed by a MySQL database for managing users, catalog, orders, and favorites.

## Database Setup

Run the schema script to create the database and tables:

```bash
mysql -u <user> -p < docs/scheme.sql
```

Then (optionally) load dummy data:

```bash
mysql -u <user> -p < docs/seed.sql
```

Seed accounts (password for all: `password123`):

| Email | Role |
|-------|------|
| `admin@bookstore.com` | admin |
| `jane@example.com` | user |
| `john@example.com` | user |
| `banned@example.com` | user (inactive) |

## Data Model

| Table | Description |
|-------|-------------|
| **users** | Accounts with name, email, password, phone, role, and active status |
| **sessions** | Server-side login sessions (`jti`) used to revoke JWTs on logout |
| **categories** | Book categories |
| **books** | Catalog items linked to a category (title, author, ISBN, price, image, etc.) |
| **orders** | User purchases with status, total price, and shipping address. Cart = order with status `draft` |
| **order_items** | Line items within an order (book, quantity, price) |
| **favorites** | Books saved by users |

### Relationships

- A **book** belongs to one **category**
- An **order** belongs to one **user** and contains many **order_items**
- Each **order_item** references a **book**
- **favorites** link a **user** to a **book**

### Order statuses

`draft` → `pending` → `in_progress` → `on_the_way` → `delivered`  
Also: `cancelled` (from `pending` or `in_progress`)

## Endpoints

All authenticated routes expect a Bearer token unless noted. Admin routes require `role = admin`.

> **Teaching:** 5 intentional API bugs for student testing are documented in [`docs/student-api-bugs.md`](docs/student-api-bugs.md) (wrong vs correct code included).

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, returns token |
| POST | `/auth/logout` | Revoke current session/token in the database |
| GET | `/auth/me` | Current user |
| PATCH | `/auth/me` | Update profile (name, phone, password) |

### Catalog (public)

`query` searches title, description, author, year, ISBN, and price.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/categories` | List categories |
| GET | `/books?query=&category_id=&limit=&offset=` | Search / filter books |
| GET | `/books/recent?limit=` | Recently added books |
| GET | `/books/:id` | Book detail |

### Cart (authenticated)

Cart is the current user's draft order and its items.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/cart` | Get cart with items |
| POST | `/cart` | Add item `{ book_id, quantity }` |
| PATCH | `/cart/:itemId` | Update item quantity |
| DELETE | `/cart/:itemId` | Remove item |
| DELETE | `/cart` | Clear cart |

### Orders (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/orders` | Checkout cart → `{ address }` (sets status to `pending`) |
| GET | `/orders?status=` | List own orders |
| GET | `/orders/:id` | Order detail with items |
| PATCH | `/orders/:id/cancel` | Cancel own pending order |

### Favorites (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/favorites` | List favorite books |
| POST | `/favorites` | Add favorite `{ book_id }` |
| DELETE | `/favorites/:bookId` | Remove favorite by book |

### Admin — Categories

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/categories?query=` | List / search |
| GET | `/admin/categories/:id` | Get one |
| POST | `/admin/categories` | Create |
| PUT | `/admin/categories/:id` | Update |
| DELETE | `/admin/categories/:id` | Delete |

### Admin — Books

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/books?query=` | List / search |
| GET | `/admin/books/:id` | Get one |
| POST | `/admin/books` | Create |
| PUT | `/admin/books/:id` | Update |
| DELETE | `/admin/books/:id` | Delete |

### Admin — Orders

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/orders?query=&status=` | List / search |
| GET | `/admin/orders/:id` | Order detail with items |
| PATCH | `/admin/orders/:id` | Update status `{ status }` (`in_progress`, `on_the_way`, `delivered`, `cancelled`) |

### Admin — Users

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/users?query=` | List / search |
| GET | `/admin/users/:id` | Get one |
| POST | `/admin/users` | Create |
| PUT | `/admin/users/:id` | Update |
| PATCH | `/admin/users/:id` | Set active status `{ is_active }` (ban / unban) |
| DELETE | `/admin/users/:id` | Delete |



