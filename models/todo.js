const { promisePool } = require("../config/database");

class Todo {
  // Get all todos with pagination and search
  static async findAll(page = 1, pageSize = 10, search = "") {
    try {
      // Calculate offset
      const offset = (page - 1) * pageSize;

      let countQuery = "SELECT COUNT(*) as total FROM todos";
      let dataQuery = "SELECT * FROM todos";
      let params = [];
      let countParams = [];

      // Add search condition if provided
      if (search) {
        const searchCondition = " WHERE name LIKE ?";
        countQuery += searchCondition;
        dataQuery += searchCondition;
        params = [`%${search}%`];
        countParams = [`%${search}%`];
      }

      // Add ordering
      dataQuery += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
      params.push(pageSize, offset);

      // Get total count
      const [countResult] = await promisePool.query(countQuery, countParams);
      const total = countResult[0].total;

      // Get paginated data
      const [rows] = await promisePool.query(dataQuery, params);

      return {
        code: 200,
        data: rows,
        message: "Success",
        total: total,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: "Database error",
      };
    }
  }

  // Get todo by ID
  static async findById(id) {
    try {
      const [rows] = await promisePool.query("SELECT * FROM todos WHERE id = ?", [id]);
      if (rows.length === 0) {
        return {
          code: 400,
          data: null,
          message: "Todo not found",
        };
      }
      return {
        code: 200,
        data: rows[0],
        message: "Success",
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: "Database error",
      };
    }
  }

  // Create a new todo
  static async create(name, age, address, status) {
    try {
      // Check if title is provided
      if (!name || name.trim() === "") {
        return {
          code: 400,
          data: null,
          message: "Title is required",
        };
      }

      const [result] = await promisePool.query("INSERT INTO todos (name, status, address, age) VALUES (?, ?,?,?)", [name, status, address, age]);

      return {
        code: 200,
        data: { id: result.insertId },
        message: "Todo created successfully",
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: "Database error" + error,
      };
    }
  }

  // Update todo
  static async update(id, name, status, age, address) {
    try {
      // First check if todo exists
      const existingTodo = await this.findById(id);
      if (existingTodo.code === 400) {
        return {
          code: 400,
          data: null,
          message: "Todo not found",
        };
      }

      const [result] = await promisePool.query("UPDATE todos SET name = ?, status = ?, age = ?, address = ? WHERE id = ?", [name, status, age, address, id]);

      if (result.affectedRows === 0) {
        return {
          code: 400,
          data: null,
          message: "Todo not found",
        };
      }

      return {
        code: 200,
        data: { id },
        message: "Todo updated successfully",
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: "Database error",
      };
    }
  }

  // Delete todo
  static async delete(id) {
    try {
      const [result] = await promisePool.query("DELETE FROM todos WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return {
          code: 400,
          data: null,
          message: "Todo not found",
        };
      }

      return {
        code: 200,
        data: null,
        message: "Todo deleted successfully",
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: "Database error",
      };
    }
  }

  // Toggle todo completion status
  static async toggle(id) {
    try {
      // First check if todo exists
      const existingTodo = await this.findById(id);
      if (existingTodo.code === 400) {
        return {
          code: 400,
          data: null,
          message: "Todo not found",
        };
      }

      const [result] = await promisePool.query("UPDATE todos SET status = NOT status WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return {
          code: 400,
          data: null,
          message: "Todo not found",
        };
      }

      return {
        code: 200,
        data: { id },
        message: "Todo toggled successfully",
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: "Database error",
      };
    }
  }
}

module.exports = Todo;
