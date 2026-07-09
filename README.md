# Bookstore

A bookstore application backed by a MySQL database for managing users, catalog, orders, and favorites.

## Database Setup

Run the schema script to create the database and tables:

```bash
mysql -u <user> -p < docs/scheme.sql
```

## Data Model

| Table | Description |
|-------|-------------|
| **users** | Accounts with name, email, password, phone, and role |
| **categories** | Book categories |
| **books** | Catalog items linked to a category (title, author, ISBN, price, image, etc.) |
| **orders** | User purchases with status, total price, and shipping address |
| **order_items** | Line items within an order (book, quantity, price) |
| **favorites** | Books saved by users |

### Relationships

- A **book** belongs to one **category**
- An **order** belongs to one **user** and contains many **order_items**
- Each **order_item** references a **book**
- **favorites** link a **user** to a **book**
