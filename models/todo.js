const { promisePool } = require('../config/database');

class Todo {
  // Get all todos
  static async findAll() {
    try {
      const [rows] = await promisePool.query('SELECT * FROM todos ORDER BY created_at DESC');
      return {
        code: 200,
        data: rows,
        message: 'Success'
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: 'Database error'
      };
    }
  }

  // Get todo by ID
  static async findById(id) {
    try {
      const [rows] = await promisePool.query('SELECT * FROM todos WHERE id = ?', [id]);
      if (rows.length === 0) {
        return {
          code: 400,
          data: null,
          message: 'Todo not found'
        };
      }
      return {
        code: 200,
        data: rows[0],
        message: 'Success'
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: 'Database error'
      };
    }
  }

  // Create a new todo
  static async create(title) {
    try {
      // Check if title is provided
      if (!title || title.trim() === '') {
        return {
          code: 400,
          data: null,
          message: 'Title is required'
        };
      }
      
      const [result] = await promisePool.query(
        'INSERT INTO todos (title, completed) VALUES (?, ?)',
        [title, false]
      );
      
      return {
        code: 200,
        data: { id: result.insertId },
        message: 'Todo created successfully'
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: 'Database error'
      };
    }
  }

  // Update todo
  static async update(id, title, completed) {
    try {
      // First check if todo exists
      const existingTodo = await this.findById(id);
      if (existingTodo.code === 400) {
        return {
          code: 400,
          data: null,
          message: 'Todo not found'
        };
      }
      
      const [result] = await promisePool.query(
        'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
        [title, completed, id]
      );
      
      if (result.affectedRows === 0) {
        return {
          code: 400,
          data: null,
          message: 'Todo not found'
        };
      }
      
      return {
        code: 200,
        data: { id },
        message: 'Todo updated successfully'
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: 'Database error'
      };
    }
  }

  // Delete todo
  static async delete(id) {
    try {
      const [result] = await promisePool.query('DELETE FROM todos WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return {
          code: 400,
          data: null,
          message: 'Todo not found'
        };
      }
      
      return {
        code: 200,
        data: null,
        message: 'Todo deleted successfully'
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: 'Database error'
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
          message: 'Todo not found'
        };
      }
      
      const [result] = await promisePool.query(
        'UPDATE todos SET completed = NOT completed WHERE id = ?',
        [id]
      );
      
      if (result.affectedRows === 0) {
        return {
          code: 400,
          data: null,
          message: 'Todo not found'
        };
      }
      
      return {
        code: 200,
        data: { id },
        message: 'Todo toggled successfully'
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: 'Database error'
      };
    }
  }
}

module.exports = Todo;