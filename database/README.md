# Database Setup

## Prerequisites

1. Make sure you have MySQL installed and running on your system
2. Create a MySQL user with sufficient privileges to create databases and tables

## Configuration

1. Update the `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=todo_db
   ```

2. Make sure your MySQL server is running

## Initialize the Database

Run the following command to create the necessary tables:

```bash
npm run init-db
```

This will create the `todos` table in the specified database.

## Database Schema

The `todos` table has the following structure:

```sql
CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Troubleshooting

If you encounter connection errors:

1. Make sure MySQL is running
2. Verify your credentials in the `.env` file
3. Ensure the user has permissions to create databases/tables
4. Check if the firewall allows connections to MySQL (default port 3306)